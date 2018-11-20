"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_1 = __importDefault(require("grpc"));
const proto_loader_1 = require("@grpc/proto-loader");
const protoFromFile = (protoPath) => {
    const packageDefinition = proto_loader_1.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
    return grpc_1.default.loadPackageDefinition(packageDefinition);
};
exports.Client = (protoPath, url) => {
    const proto = protoFromFile(protoPath);
    return new proto.Faucet(url, grpc_1.default.credentials.createInsecure());
};
exports.Server = ({ protoPath, url, services }) => {
    const proto = protoFromFile(protoPath);
    const server = new grpc_1.default.Server();
    services.forEach(svc => {
        server.addService(proto[svc.name].service, svc.controllers);
    });
    server.bind(url, grpc_1.default.ServerCredentials.createInsecure());
    return server;
};
//# sourceMappingURL=utils.js.map