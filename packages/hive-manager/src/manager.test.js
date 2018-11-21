const { join } = require("path");
const Manager = require("./manager");

const VU_SCRIPT = join(__dirname, "../test/fixture/dumbVu.js");

const FUNDING_ACCOUNT_PRIVATE =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";

const manager = new Manager({
  vu: VU_SCRIPT,
  faucetPrivateKey: FUNDING_ACCOUNT_PRIVATE
});

manager.startRampUp();
