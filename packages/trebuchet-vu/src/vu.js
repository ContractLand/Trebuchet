class VirtualUser {
  constructor({ index, id }) {
    this.id = id;
    this.index = index;
  }

  /**
   * Wraps a given function to automatically send a transaction report to the reporting module
   * @param  {string} name - Name to appear on the transaction report
   * @param  {function} fn - Function to be called
   * @param  {any} ...args - Arguments to be passed into the function
   */
  async txWrapper(name, fn, ...args) {
    const start = Date.now();
    const data = await fn(...args);
    const end = Date.now();
    this.reportTx({
      name,
      start,
      end,
      duration: end - start,
      error: false,
      data
    });
    return data;
  }

  /**
   * Sends a report to parent process through IPC when available
   * @param  {Object} data - Data to be sent to manager
   */
  reportTx(data) {
    if (process.send) {
      const txReport = {
        ...data,
        vu: this.id,
        type: "TX"
      };
      process.send(txReport);
    }
  }
}

module.exports = VirtualUser;
