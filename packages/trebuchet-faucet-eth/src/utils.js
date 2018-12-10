const grpc = require("grpc");
const loader = require("@grpc/proto-loader");

const protoFromFile = protoPath => {
  const packageDefinition = loader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  return grpc.loadPackageDefinition(packageDefinition);
};

const Client = (protoPath, url) => {
  const proto = protoFromFile(protoPath);
  return new proto.Faucet(url, grpc.credentials.createInsecure());
};

const Server = ({ protoPath, url, services }) => {
  const proto = protoFromFile(protoPath);
  const server = new grpc.Server();
  services.forEach(svc => {
    server.addService(proto[svc.name].service, svc.controllers);
  });
  server.bind(url, grpc.ServerCredentials.createInsecure());
  return server;
};

module.exports = {
  Client,
  Server,
  protoFromFile
};
