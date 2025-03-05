"use client"

import { createContext, useContext, type ReactNode, useState } from "react"

// Define the shape of your context state
type GlobalContextType = {
    user: {
        name: string,
        avatar: string,
        isLoggedIn: boolean
    }
    login: (name: string, avatar: string) => void
    logout: () => void
}

// Create the context with default values
const GlobalContext = createContext<GlobalContextType>({
    user: {
        name: "",
        avatar: "",
        isLoggedIn: false,
    },
    login: () => { },
    logout: () => { },
})

// Create a provider component
export function GlobalContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<{ name: string; avatar: string, isLoggedIn: boolean }>({
        name: "",
        avatar: "",
        isLoggedIn: false,
    });


    const login = (name: string, avatar: string) => {
        setUser({ name, avatar, isLoggedIn: true })
    }

    const logout = () => {
        setUser({ name: "", avatar: "", isLoggedIn: false })
    }

    return <GlobalContext.Provider value={{ user, login, logout }}>{children}</GlobalContext.Provider>
}

// Create a custom hook to use the context
export function useGlobalContext() {
    const context = useContext(GlobalContext)

    if (context === undefined) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider")
    }

    return context
}

