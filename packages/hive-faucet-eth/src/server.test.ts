import grpc from 'grpc';
import FaucetServer from "./server";
import { Client } from "./utils";

const PROTO_PATH = __dirname + "/../faucet.proto";
const GRPC_URL = "localhost:50051";
const FUNDING_ACCOUNT_PRIVATE =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";

describe("server", () => {
  let client: any;
  let server: grpc.Server;

  beforeAll(() => {
    server = FaucetServer({
      grpcUrl: GRPC_URL,
      faucetPrivateKey: FUNDING_ACCOUNT_PRIVATE
    });
    client = Client(PROTO_PATH, GRPC_URL);
  });

  afterAll(async () => {
    // GRPC has a problem with shutting down, therefore requiring --forceExit on jest.
    const deferShutdown = new Promise((resolve) => {
      server.tryShutdown(() => {
        resolve()
      })
    });
    await deferShutdown;
  });

  test("single transaction", async () => {
    const receiver = "0x70aec4b9cffa7b55c0711b82dd719049d615e21d";
    const deferFund = new Promise((resolve, reject) => {
      client.Fund({ address: receiver }, (err: Error, response: any) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    const res= await deferFund;
    console.log(res);
  });
});
