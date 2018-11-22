const { join } = require("path");
const Manager = require("./manager");

// const VU_SCRIPT = join(__dirname, "../test/fixture/dumbVu.js");
const VU_SCRIPT = join(__dirname, "../test/fixture/fundAndSendVu.js");

const FUNDING_ACCOUNT_PRIVATE =
  "0xbc5b578e0dcb2dbf98dd6e5fe62cb5a28b84a55e15fc112d4ca88e1f62bd7c35";

const manager = new Manager({
  vu: VU_SCRIPT,
  faucetPrivateKey: FUNDING_ACCOUNT_PRIVATE
});

manager.startRampUp();
