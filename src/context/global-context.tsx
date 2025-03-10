"use client"

import { validate_token } from "@/utils/api"
import { createContext, useContext, type ReactNode, useState, SetStateAction, Dispatch, useEffect } from "react"

type User = {
    email: string,
    name: string,
    avatar: string
}
// Define the shape of your context state
type GlobalContextType = {
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>,
    net: "mainnet" | "devnet" | null,
    setNet: Dispatch<SetStateAction<"mainnet" | "devnet" | null>>
}

// Create the context with default values
const GlobalContext = createContext<GlobalContextType>({
    user: null,
    setUser: () => {},
    net: null,
    setNet: () => {}
})

// Create a provider component
export function GlobalContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [net, setNet] = useState<"mainnet" | "devnet" | null>(null);
    useEffect(() => {
        validate_token().then(data => setUser(data))
        const net = localStorage.getItem("net") === "devnet" ? "devnet" : "mainnet";
        setNet(net);
    }, [])

    useEffect(() => {
        net === "devnet" ? localStorage.setItem("net", "devnet") : localStorage.removeItem("net")
    }, [net])

    return <GlobalContext.Provider value={{ user, setUser, net, setNet }}>{children}</GlobalContext.Provider>
}

// Create a custom hook to use the context
export function useGlobalContext() {
    const context = useContext(GlobalContext)

    if (context === undefined) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider")
    }

    return context
}

