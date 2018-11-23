# Reporting

Reporting is handled by the reporting module.

## Design Goal

To allow the framework to be used for all types of load test, the reporting module needs to be able to deal with different type of report and provide a summary that will be useful. 

## Types of Reports

There is two main types of report that the reporting module will support, transactions and VU summary.

### Transactions

A transaction report is a simple report on a single action performed by the VU that is measured for the load test. Examples of transactions:

- REST API call to a server
- Ethereum transactions (transfer, contract deploy, contract call, etc)
- Code execution (using exec)

A transaction report will be sent to the reporting module with the following schema:

```js
const txReport = {
  vu: "eca815a6-2310-474b-9728-603b8dd16b23",    // UUID of VU
  type: "TRANSFER",    // Type of transaction, used to aggregate transactions
  start: 1542943240437,    // Starting timestamp of the transaction
  end: 1542943249200,    // Ending timestamp of the transaction (optional)
  duration: 8763,    // Duration of the transaction (optional)
  error: false,    // If the transaction throwed any errors
  data: {    // Optional field for additional data to be collected
    to: "0x3c7539cd57b7e03f722c3aeb636247188b25dcc4",
    value: "0x71afd498d0000",
    gas: "0x5208",
    nonce: "0x0",
    chainId: "0x1f4",
    gasPrice: "0x0",
    data: "0x"
  }
}
```

### VU Summary

A VU summary is a summary report by a single VU to summarise the lifecycle of the VU.

```js
const vuReport = {
  vu: "eca815a6-2310-474b-9728-603b8dd16b23",    // UUID of VU
  start: 1542943240437,    // Starting timestamp of the virtual user
  end: 1542943249200,    // Ending timestamp of the virtual user
  duration: 8763,    // Duration of the transaction
  error: false    // If the virtual encountered any error while executing
}
```