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
const web3_1 = __importDefault(require("web3"));
const await_semaphore_1 = require("await-semaphore");
class Funder {
    constructor({ rpc, fundingAccount }) {
        this.rpc = rpc;
        this.web3 = new web3_1.default(rpc);
        this.account = this.web3.eth.accounts.privateKeyToAccount(fundingAccount);
        this.mutex = new await_semaphore_1.Mutex();
        this.nonceArray = [];
    }
    _initNonce() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nonce)
                return this.nonce;
            this.nonce = yield this.web3.eth.getTransactionCount(this.account.address, "pending");
            return this.nonce;
        });
    }
    fund(account, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let txPromise;
            yield this.mutex.use(() => __awaiter(this, void 0, void 0, function* () {
                yield this._initNonce();
                const nonceToUse = this.nonce;
                this.nonce += 1;
                this.nonceArray.push(nonceToUse);
                const tx = {
                    gas: 21000,
                    to: account,
                    from: this.account.address,
                    value: amount,
                    nonce: nonceToUse,
                };
                const signedTx = yield this.account.signTransaction(tx);
                txPromise = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            }));
            const txReceipt = yield txPromise;
            return txReceipt;
        });
    }
}
exports.Funder = Funder;
//# sourceMappingURL=funder.js.map