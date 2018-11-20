"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const utils_1 = require("../utils");
exports.PROTO_PATH = path_1.join(__dirname, '../../proto/faucet/faucet.proto');
exports.DEFAULT_GRPC_URL = "0.0.0.0:50051";
exports.FaucetServer = (controllers, url = exports.DEFAULT_GRPC_URL) => {
    const server = utils_1.Server({
        protoPath: exports.PROTO_PATH,
        url: url || exports.DEFAULT_GRPC_URL,
        services: [{
                name: "Faucet",
                controllers
            }]
    });
    server.start();
    return server;
};
exports.FaucetClient = (url = exports.DEFAULT_GRPC_URL) => {
    return utils_1.Client(exports.PROTO_PATH, url);
};
//# sourceMappingURL=index.js.map