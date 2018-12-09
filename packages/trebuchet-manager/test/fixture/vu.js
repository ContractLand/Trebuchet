process.on("message", async state => {
  // eslint-disable-next-line no-console
  console.log("Test stdout");

  // eslint-disable-next-line no-console
  console.error("Test stderr");

  await new Promise(resolve => {
    setTimeout(() => {
      const txReport = {
        data: { index: state.index },
        vu: state.id,
        type: "TX"
      };
      process.send(txReport);
      resolve();
    }, 20);
  });
  process.exit();
});
