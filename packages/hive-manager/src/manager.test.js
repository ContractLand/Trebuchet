const { join } = require("path");
const Manager = require("./manager");

// const VU_SCRIPT = join(__dirname, "../test/fixture/dumbVu.js");
const SETUP_SCRIPT = join(__dirname, "../test/fixture/ethFaucet.js");
const VU_SCRIPT = join(__dirname, "../test/fixture/fundAndSendVu.js");

const manager = new Manager({
  setupScript: SETUP_SCRIPT,
  vuScript: VU_SCRIPT
});

manager.runTest();
