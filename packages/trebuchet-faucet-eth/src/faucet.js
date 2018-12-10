const { join } = require("path");
const Funder = require("./funder");
const { Client, Server } = require("./utils");

const DEFAULT_GRPC_URL = "0.0.0.0:50051";
const DEFAULT_ETH_RPC_URL = "ws://localhost:8545";
const PROTO_PATH = join(__dirname, "faucet.proto");

const FaucetServer = config => {
  const funder = new Funder({
    rpc: config.rpc || DEFAULT_ETH_RPC_URL,
    fundingAccount: config.faucetPrivateKey
  });

  const Fund = ({ request }, cb) => {
    funder
      .fund(request.address, request.amount)
      .then(() => {
        cb(null, { success: true });
      })
      .catch(cb);
  };

  const server = Server({
    protoPath: PROTO_PATH,
    url: config.grpcUrl || DEFAULT_GRPC_URL,
    services: [
      {
        name: "Faucet",
        controllers: { Fund }
      }
    ]
  });
  server.start();
  return server;
};

const FaucetClient = (url = DEFAULT_GRPC_URL) => Client(PROTO_PATH, url);

module.exports = {
  FaucetServer,
  FaucetClient
};
