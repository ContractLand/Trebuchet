import grpc from 'grpc';
import {FaucetServer} from "hive-grpc";
import {Funder} from "./funder";

interface FaucetServerConfig {
  rpc?: string;
  grpcUrl?: string;
  faucetPrivateKey: string;
}

const PROTO_PATH = __dirname + '/../faucet.proto';

const DEFAULT_GRPC_URL = "0.0.0.0:50051";
const DEFAULT_ETH_RPC_URL = "ws://localhost:8545"

const Server = (config: FaucetServerConfig): grpc.Server => {
  const funder = new Funder({
    rpc: config.rpc || DEFAULT_ETH_RPC_URL,
    fundingAccount: config.faucetPrivateKey
  });
  
  const Fund = ({request}: any, cb: any) => {
    funder.fund(request.address, "100")
    .then(() => {
      cb(null, {success:true});
    })
    .catch(cb);
  }

  return FaucetServer({Fund}, config.grpcUrl || DEFAULT_GRPC_URL);
}

export default Server;