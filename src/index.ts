import express from "express";
import moralis from "moralis";
import dotenv from "dotenv";
import cors from "cors";
import abi from "./abi.json";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/userDetail", async(req, res)=>{

    // this is also an chain id 0x13882 finds on https://chainlist.org/chain/80002
    const { userAddress } = req.query;
    try{
        const response = await moralis.EvmApi.utils.runContractFunction({
            chain: '0x13882',
            address: '0x62c8586604B73F206449c7E951b2EbFc169738C2',
            functionName: 'addressToWalletName',
            abi: abi,
            params: {
                _user: userAddress
            }
        });
    
    
        const jsonResponseName = response.raw;
    
        return res.status(200).json({
            name: jsonResponseName
        });
    }catch(error){
        console.log(error);
        return res.status(503).json({
            msg: "error in fetching details from contract"
        });
    }
})

const PORT = 4000 || process.env.PORT;
moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijg3OGFmOWJiLTE0M2EtNDIxZC05MTg2LTgzNTg0MDNjMjIyMCIsIm9yZ0lkIjoiMzU4NDU0IiwidXNlcklkIjoiMzY4MzkyIiwidHlwZUlkIjoiMGIyMTVhZDAtNjUxYy00MTU2LTkyYWQtNzZhODc3MmNlODdhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU0ODM2NTYsImV4cCI6NDg1MTI0MzY1Nn0.kaxNpG-PaERlCemrXgDlgXwE3Ro7uasw36tocEcvYNU"
}).then(()=>{
    app.listen(PORT, ()=>{
        console.log("server listening at port: ",PORT);
    })
}).catch((err: Error)=>{
    console.log("error while server side running: ",err);
})
