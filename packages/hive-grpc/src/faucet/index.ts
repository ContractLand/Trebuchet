import grpc from 'grpc';
import {join} from "path";
import {Client, Server} from "../utils";

export const PROTO_PATH = join(__dirname, '../../proto/faucet/faucet.proto');
export const DEFAULT_GRPC_URL = "0.0.0.0:50051";

export const FaucetServer = (controllers: any, url: string = DEFAULT_GRPC_URL): grpc.Server => {
  const server = Server({
    protoPath: PROTO_PATH,
    url: url || DEFAULT_GRPC_URL,
    services: [{
      name: "Faucet",
      controllers
    }]
  });
  server.start();
  return server;
}

export const FaucetClient = (url: string = DEFAULT_GRPC_URL): any => {
  return Client(PROTO_PATH, url);
}