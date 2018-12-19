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
    try {
      const data = await fn(...args);
      const end = Date.now();
      this.reportSuccess({
        name,
        start,
        end,
        duration: end - start,
        error: false,
        data
      });
      return data;
    } catch (err) {
      const end = Date.now();
      this.reportFailure({
        name,
        start,
        end,
        duration: end - start,
        error: true,
        trace: err
      });
      throw err;
    }
  }

  /**
   * Sends a report to manager through pass-in reporter
   * @param  {Object} data - Data to be sent to manager
   */
  reportSuccess(data) {
    if (this.reporter && this.reporter.reportSuccess) {
      this.reporter.reportSuccess({
        ...data,
        vu: this.id,
        type: "TX"
      });
    }
  }

  /**
   * Sends an error report to manager through pass-in reporter
   * @param  {Object} data - Data to be sent to manager
   */
  reportFailure(data) {
    if (this.reporter && this.reporter.reportFailure) {
      this.reporter.reportFailure({
        ...data,
        vu: this.id,
        type: "TX"
      });
    }
  }
}

module.exports = VirtualUser;
