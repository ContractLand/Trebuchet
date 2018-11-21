const Bottleneck = require("bottleneck");
const { spawn } = require("child_process");
const FaucetServer = require("hive-faucet-eth");
const Web3 = require("web3");

const DEFAULT_VU_TYPE = "ETH";
const DEFAULT_RPC = "http://localhost:8545";
const DEFAULT_GRPC_URL = "localhost:50051";
const DEFAULT_RAMP_PERIOD = 2000;
const DEFAULT_CONCURRENCY = 5;
const DEFAULT_ACTIVE_PERIOD = 5000;
const DEFAULT_COOLING_PERIOD = 5000;

const STAGES = {
  INIT: "INIT",
  RAMP_UP: "RAMP_UP",
  ACTIVE: "ACTIVE",
  COOL_OFF: "COOL_OFF",
  TERMINATED: "TERMINATED"
};

const newPrivateKey = web3 => web3.eth.accounts.create().privateKey;

class Manager {
  constructor({
    vu,
    faucetPrivateKey,
    type = DEFAULT_VU_TYPE,
    rpc = DEFAULT_RPC,
    grpc = DEFAULT_GRPC_URL,
    rampPeriod = DEFAULT_RAMP_PERIOD,
    concurrency = DEFAULT_CONCURRENCY,
    activePeriod = DEFAULT_ACTIVE_PERIOD,
    coolingTimeout = DEFAULT_COOLING_PERIOD
  }) {
    this.vu = vu;
    this.type = type;
    this.rpc = rpc;
    this.grpc = grpc;
    this.rampPeriod = rampPeriod;
    this.concurrency = concurrency;
    this.activePeriod = activePeriod;
    this.coolingTimeout = coolingTimeout;
    this.faucetPrivateKey = faucetPrivateKey;
    this.stage = STAGES.INIT;
    this.web3 = new Web3(rpc);
    this.currentConcurrency = 1;
    this.vuLimiter = new Bottleneck({ maxConcurrent: this.currentConcurrency });
    this.vuLimiter.on("empty", () => {
      if (this.stage === STAGES.RAMP_UP || this.stage === STAGES.ACTIVE) {
        this.scheduleVirtualUser();
      } else if (
        this.stage === STAGES.COOL_OFF ||
        this.stage === STAGES.TERMINATED
      ) {
        this.hardStop();
      }
    });
    this.rampUpInterval = null;
    this.hardstopTimeout = null;
  }

  startFaucet() {
    this.server = FaucetServer({
      grpcUrl: this.grpc,
      faucetPrivateKey: this.faucetPrivateKey
    });
  }

  startRampUp() {
    this.stage = STAGES.RAMP_UP;
    const rampUp = () => {
      if (this.currentConcurrency < this.concurrency) {
        this.currentConcurrency += 1;
        this.vuLimiter.updateSettings({
          maxConcurrent: this.currentConcurrency
        });
      } else {
        this.startActive();
      }
    };
    this.rampUpInterval = setInterval(
      rampUp,
      this.rampPeriod / this.concurrency
    );
    this.scheduleVirtualUser();
  }

  startActive() {
    this.stage = STAGES.ACTIVE;
    console.log("STAGE TRANSITED:", this.stage);
    clearInterval(this.rampUpInterval);
    setTimeout(() => {
      this.startCoolOff();
    }, this.activePeriod);
  }

  startCoolOff() {
    this.stage = STAGES.COOL_OFF;
    console.log("STAGE TRANSITED:", this.stage);
    this.vuLimiter.stop();
    console.log("COOOOOOLING");
    this.hardstopTimeout = setTimeout(() => {
      this.hardStop();
    }, this.coolingTimeout);
  }

  // Hardstop and stop both races to here
  // eslint-disable-next-line class-methods-use-this
  hardStop() {
    // If all the child process ends before the hardstop, clear timeout and stop anyway
    if (this.hardstopTimeout) {
      console.log("Stopping when child process terminates");
      clearTimeout(this.hardstopTimeout);
    } else {
      console.log("HARD STOPPED");
    }
    this.stage = STAGES.TERMINATED;

    // Generates report here
  }

  // eslint-disable-next-line class-methods-use-this
  processMessage(report) {
    console.log("Processing report");
    console.log(report);
  }

  // Run a virtual user in the queue
  scheduleVirtualUser() {
    try {
      this.vuLimiter.schedule(this.runVirtualUser.bind(this));
    } catch (e) {
      console.log(e);
    }
  }

  // Can consider using a fixed list of actors instead of using random keys
  async runVirtualUser() {
    return new Promise((resolve, reject) => {
      const initialState = {
        privateKey: newPrivateKey(this.web3),
        grpc: this.grpc,
        rpc: this.rpc
      };

      const virtualUser = spawn("node", [this.vu], {
        stdio: ["pipe", "pipe", "pipe", "ipc"]
      });

      /*
      // Print stdout
      virtualUser.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      // Print stderr
      virtualUser.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
      });
      */

      // Async process ends when child process dies
      virtualUser.on("close", code => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
        // console.log(`child process exited with code ${code}`);
      });

      // Handle messages from child processes
      virtualUser.on("message", this.processMessage);

      // Start the child process by sending it initial state
      virtualUser.send(initialState);
    });
  }
}

module.exports = Manager;
