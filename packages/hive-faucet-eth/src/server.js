const { FaucetServer } = require("hive-grpc");
const Funder = require("./funder");

const DEFAULT_GRPC_URL = "0.0.0.0:50051";
const DEFAULT_ETH_RPC_URL = "ws://localhost:8545";

const Server = config => {
  const funder = new Funder({
    rpc: config.rpc || DEFAULT_ETH_RPC_URL,
    fundingAccount: config.faucetPrivateKey
  });

  const Fund = ({ request }, cb) => {
    funder
      .fund(request.address, request.amount)
      .then(() => {
        cb(null, { success: true });
      })
      .catch(cb);
  };

  return FaucetServer({ Fund }, config.grpcUrl || DEFAULT_GRPC_URL);
};

module.exports = Server;
