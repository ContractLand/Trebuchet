const Sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

module.exports = { Sleep };
