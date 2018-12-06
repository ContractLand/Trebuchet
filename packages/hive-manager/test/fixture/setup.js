module.exports = async function setup() {
  // Non-pure setup script to set manager state
  await new Promise(resolve => {
    setTimeout(() => {
      this.SETUP_SCRIPT_RAN = true;
      resolve();
    }, 20);
  });
};
