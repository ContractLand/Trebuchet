const FaucetServer = require("hive-faucet-eth");

const RPC = "http://localhost:8545";
const GRPC = "localhost:50051";
const FAUCET_PRIVATE_KEY =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";

const setup = () => {
  FaucetServer({
    rpc: RPC,
    grpcUrl: GRPC,
    faucetPrivateKey: FAUCET_PRIVATE_KEY
  });
};

module.exports = setup;
