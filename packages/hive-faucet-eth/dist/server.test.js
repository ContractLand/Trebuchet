"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const hive_grpc_1 = require("hive-grpc");
const GRPC_URL = "localhost:50051";
const FUNDING_ACCOUNT_PRIVATE = "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";
describe("server", () => {
    let client;
    let server;
    beforeAll(() => {
        server = server_1.default({
            grpcUrl: GRPC_URL,
            faucetPrivateKey: FUNDING_ACCOUNT_PRIVATE
        });
        client = hive_grpc_1.FaucetClient(GRPC_URL);
        console.log(client);
    });
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        // GRPC has a problem with shutting down, therefore requiring --forceExit on jest.
        const deferShutdown = new Promise((resolve) => {
            server.tryShutdown(() => {
                resolve();
            });
        });
        yield deferShutdown;
    }));
    test("single transaction", () => __awaiter(this, void 0, void 0, function* () {
        const receiver = "0x70aec4b9cffa7b55c0711b82dd719049d615e21d";
        const deferFund = new Promise((resolve, reject) => {
            client.Fund({ address: receiver }, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        const res = yield deferFund;
        console.log(res);
    }));
});
//# sourceMappingURL=server.test.js.map