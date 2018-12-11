const bootstrap = VU => {
  process.on("message", async state => {
    const vu = new VU(state);
    await vu.run();
    process.exit();
  });
};

module.exports = bootstrap;
