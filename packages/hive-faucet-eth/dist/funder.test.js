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
require("jest");
const bn_js_1 = __importDefault(require("bn.js"));
const web3_1 = __importDefault(require("web3"));
const lodash_1 = require("lodash");
const funder_1 = require("./funder");
const RPC = "http://localhost:8545";
const FUNDING_ACCOUNT_PRIVATE = "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";
const FUNDING_ACCOUNT_ADDRESS = "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4";
test("constructor", () => {
    const funder = new funder_1.Funder({
        rpc: RPC,
        fundingAccount: FUNDING_ACCOUNT_PRIVATE
    });
    expect(funder.rpc).toBe(RPC);
    expect(funder.web3).toBeTruthy();
    expect(funder.account.address).toBe(FUNDING_ACCOUNT_ADDRESS);
    expect(funder.account.privateKey).toBe(FUNDING_ACCOUNT_PRIVATE);
});
describe("methods", () => {
    let web3;
    let funder;
    beforeAll(() => {
        web3 = new web3_1.default(RPC);
        funder = new funder_1.Funder({
            rpc: RPC,
            fundingAccount: FUNDING_ACCOUNT_PRIVATE
        });
    });
    describe("fund", () => {
        test("single transaction", () => __awaiter(this, void 0, void 0, function* () {
            const amountToFund = "100";
            const accountToFund = "0x27e2bfc8de48d61cb92bce9b42bb3d20e366312b";
            const balanceBefore = yield web3.eth.getBalance(accountToFund);
            const beforeBn = new bn_js_1.default(balanceBefore);
            const fundingTx = yield funder.fund(accountToFund, amountToFund);
            const balanceAfter = yield web3.eth.getBalance(accountToFund);
            const afterBn = new bn_js_1.default(balanceAfter);
            const diff = afterBn
                .sub(beforeBn)
                .sub(new bn_js_1.default(amountToFund));
            expect(fundingTx).toBeTruthy();
            expect(diff.toString(10)).toBe("0");
        }), 20000);
        test("multiple transaction", () => __awaiter(this, void 0, void 0, function* () {
            const amountToFund = "100";
            const accounts = lodash_1.times(10, () => web3.eth.accounts.create());
            const balancesBeforePromises = accounts.map(acc => web3.eth.getBalance(acc.address));
            const balancesBefore = yield Promise.all(balancesBeforePromises);
            const balancesBeforeBn = balancesBefore.map(bal => new bn_js_1.default(bal));
            const promises = accounts.map(acc => funder.fund(acc.address, amountToFund));
            const resolvedPromises = yield Promise.all(promises);
            const balancesAfterPromises = accounts.map(acc => web3.eth.getBalance(acc.address));
            const balancesAfter = yield Promise.all(balancesAfterPromises);
            const balancesAfterBn = balancesAfter.map(bal => new bn_js_1.default(bal));
            const balanceDiff = lodash_1.zipWith(balancesAfterBn, balancesBeforeBn, (after, before) => after.sub(before));
            const fundedCorrectly = lodash_1.every(balanceDiff, (diff) => diff.cmp(new bn_js_1.default(amountToFund)) === 0);
            expect(fundedCorrectly).toBe(true);
        }), 20000);
    });
});
//# sourceMappingURL=funder.test.js.map