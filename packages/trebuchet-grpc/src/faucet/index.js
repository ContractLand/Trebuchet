const { join } = require("path");
const { Client, Server } = require("../utils");

const PROTO_PATH = join(__dirname, "faucet.proto");
const DEFAULT_GRPC_URL = "0.0.0.0:50051";

const FaucetServer = (controllers, url) => {
  const server = Server({
    protoPath: PROTO_PATH,
    url: url || DEFAULT_GRPC_URL,
    services: [
      {
        name: "Faucet",
        controllers
      }
    ]
  });
  server.start();
  return server;
};

const FaucetClient = (url = DEFAULT_GRPC_URL) => Client(PROTO_PATH, url);

module.exports = {
  FaucetServer,
  FaucetClient
};
