"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moralis_1 = __importDefault(require("moralis"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const abi_json_1 = __importDefault(require("./abi.json"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/userDetail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // this is also an chain id 0x13882 finds on https://chainlist.org/chain/80002
    const { userAddress } = req.query;
    try {
        const response = yield moralis_1.default.EvmApi.utils.runContractFunction({
            chain: '0x13882',
            address: '0x62c8586604B73F206449c7E951b2EbFc169738C2',
            functionName: 'addressToWalletName',
            abi: abi_json_1.default,
            params: {
                '': userAddress
            }
        });
        const jsonResponseName = response.raw;
        return res.status(200).json({
            name: jsonResponseName
        });
    }
    catch (error) {
        console.log(error);
        return res.status(503).json({
            msg: "error in fetching details from contract"
        });
    }
}));
const PORT = 4000 || process.env.PORT;
moralis_1.default.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijg3OGFmOWJiLTE0M2EtNDIxZC05MTg2LTgzNTg0MDNjMjIyMCIsIm9yZ0lkIjoiMzU4NDU0IiwidXNlcklkIjoiMzY4MzkyIiwidHlwZUlkIjoiMGIyMTVhZDAtNjUxYy00MTU2LTkyYWQtNzZhODc3MmNlODdhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU0ODM2NTYsImV4cCI6NDg1MTI0MzY1Nn0.kaxNpG-PaERlCemrXgDlgXwE3Ro7uasw36tocEcvYNU"
}).then(() => {
    app.listen(PORT, () => {
        console.log("server listening at port: ", PORT);
    });
}).catch((err) => {
    console.log("error while server side running: ", err);
});
