import grpc from "grpc";

declare module "hive-grpc" {
  export function FaucetServer(controllers: any, url?: string): grpc.Server;
  export function FaucetClient(url?: string): any;
}