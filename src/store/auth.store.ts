import { create } from "zustand";
import { ethers } from "ethers";
import { persist } from "zustand/middleware";
import { isStillAllowed } from "../utils";

type ErrorMetaMask = {
    code: string
    message: string
}

type StoreCrypto = {
    address: string,
    isLoading: boolean,
    networkId: string,
    error: ErrorMetaMask | null | string,
    allowed: boolean,
    loginWallet: () => Promise<boolean>,
    allowedWDApp: () => Promise<boolean>,
    changeNetwork: () => void
}

export const useAuthCrypto = create<StoreCrypto>()((

    persist(
        (set) => ({
            isLoading: false,
            address: String(""),
            error: null,
            allowed: false,
            networkId: "0",

            loginWallet: async () => {

                set({ isLoading: true })

                try {

                    if (typeof window.ethereum === "undefined") {
                        set({ isLoading: false, error: { code: "1", message: "No hay Metamask o wallet instalada" } })
                        return false
                    }

                    // Pide conexión a MetaMask 
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.send("eth_requestAccounts", []);
                    const address = accounts[0];
                    const network = await provider.getNetwork();

                    set({ isLoading: false, error: null, allowed: true, networkId: String(network.chainId), address })
                    return true

                } catch (error: unknown) {
                    console.log(error)
                    console.log("Error encontrado al iniciar sesion: ", error);
                    set({
                        isLoading: false,
                        allowed: false,
                        networkId: String(0),
                        address: "",
                        error: "Se encontró el siguiente problema : " + error
                    })
                    return false
                }
            },

            allowedWDApp: async () => {

                const permission = await isStillAllowed()

                if (permission.length > 0) {
                    set({ allowed: true })
                    return true;
                } else {
                    set({ allowed: false, networkId: "0", address: "" })
                    return false;
                }

            },
            changeNetwork: async() => {

                if(!window.ethereum) return

                window.ethereum.on("chainChanged", (chainId) => {
                    const netCurrentID = String(chainId);
                    set({ networkId: netCurrentID })
                })

            }
        }),
        {
            name: 'wallet',
            partialize: (state) => ({
                allowed: state.allowed,
                networkId: state.networkId,
                address: state.address,
            })
        }
    )
))