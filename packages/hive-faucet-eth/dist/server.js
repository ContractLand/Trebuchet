"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hive_grpc_1 = require("hive-grpc");
const funder_1 = require("./funder");
const DEFAULT_GRPC_URL = "0.0.0.0:50051";
const DEFAULT_ETH_RPC_URL = "ws://localhost:8545";
const Server = (config) => {
    const funder = new funder_1.Funder({
        rpc: config.rpc || DEFAULT_ETH_RPC_URL,
        fundingAccount: config.faucetPrivateKey
    });
    const Fund = ({ request }, cb) => {
        funder.fund(request.address, "100")
            .then(() => {
            cb(null, { success: true });
        })
            .catch(cb);
    };
    return hive_grpc_1.FaucetServer({ Fund }, config.grpcUrl || DEFAULT_GRPC_URL);
};
exports.default = Server;
//# sourceMappingURL=server.js.map