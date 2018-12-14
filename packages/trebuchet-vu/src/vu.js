class VirtualUser {
  constructor({ index, id, reporter }) {
    this.id = id;
    this.index = index;
    this.reporter = reporter;
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
   * Sends a report to manager through pass-in reporter
   * @param  {Object} data - Data to be sent to manager
   */
  reportTx(data) {
    if (this.reporter && this.reporter.reportTransaction) {
      this.reporter.reportTransaction({
        ...data,
        vu: this.id,
        type: "TX"
      });
    }
  }
}

module.exports = VirtualUser;
