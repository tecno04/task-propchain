import { ethers } from "ethers";

export const isStillAllowed = async () => {

    if (!window.ethereum) return false

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    console.log(accounts);
    return accounts;

}

export const getWalletInfo = async () => {

    if(!window.ethereum){
        console.log("No se logue o no hay billetera instalada");
        return {  address: "0x0000000000000000000000000000000000000000", balance: 0.00, error: "Metamask or wallet not found" }
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        const address = accounts[0];

        // Obtiene balance
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);

        return { address, balance: balanceInEth, error: null }
        
    } catch (error) {
        console.log(error);
    }


}