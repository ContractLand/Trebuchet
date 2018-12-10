const { Sleep } = require("./utils");

module.exports = async function setup() {
  // eslint-disable-next-line no-console
  console.log("Running setup");
  await Sleep(1000);
  // eslint-disable-next-line no-console
  console.log("Setup complete");
};
