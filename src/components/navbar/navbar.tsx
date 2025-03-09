'use client'

import { useRouter } from "next/navigation";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"
import Image from "next/image";
import { CiUser } from "react-icons/ci";
import { Button } from "../ui/button";
import logo from "../../assets/image/logo-sixcool.svg";
import { useGlobalContext } from "@/context/global-context";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { user, setUser, net, setNet } = useGlobalContext();
    const route = useRouter();
    const [check, setCheck] = useState(net === "devnet");
    useEffect(() => {
        setCheck(net === "devnet")
    }, [net])

    return (
        <Menubar className="flex justify-between py-4 items-center bg-[#121212] border-0 shadow-xl shadow-[#382158] rounded-full px-4 md:px-10 mb-10 h-20">
            <MenubarMenu>
                <Image src={logo} alt="logo" className="h-full w-fit cursor-pointer" onClick={() => route.push("/", {scroll:true})} />
                
                {
                    user ?
                    <div className="flex gap-4">
                        <div className="items-center justify-center gap-4 hidden sm:flex">
                            <span className="cursor-pointer" onClick={() => route.push("/tokens", {scroll:true})}>My Tokens</span>
                            <span className="cursor-pointer" onClick={() => route.push("/create", {scroll:true})}>Create Token</span>
                        </div>
                        <div>
                            <MenubarTrigger className="cursor-pointer relative p-0">
                                {
                                    user.avatar ? <img src={user.avatar} alt="avatar" className="size-12 rounded-full border border-[#fff3]" /> :
                                        <CiUser className="size-12 rounded-full border-black border-2" />
                                }
                            </MenubarTrigger>
                            <MenubarContent className=" absolute -right-14 bg-[#121212] shadow-md shadow-[#fff3] text-white">
                                <MenubarItem onClick={() => route.push('/profile', {scroll: true})}>
                                    Profile
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => { route.push('/change', {scroll: true}) }}>
                                    Change Password
                                </MenubarItem>
                                <MenubarSeparator className="sm:hidden"/>
                                <MenubarItem className="sm:hidden" onClick={() => { route.push('/tokens', {scroll: true}) }}>
                                    My Tokens
                                </MenubarItem>
                                <MenubarSeparator className="sm:hidden" />
                                <MenubarItem className="sm:hidden" onClick={() => { route.push('/create', {scroll: true}) }}>
                                    Create Token
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem asChild={true} onClick={e => e.preventDefault()}>
                                    <div className="flex justify-between w-full">
                                        Devnet
                                    <Switch className="data-[state=checked]:bg-[#9434d3] data-[state=unchecked]:bg-[#fff5]" checked={check} onClick={() => {
                                        if (check) {
                                            setCheck(false);
                                            setNet("mainnet");
                                        } else {
                                            setCheck(true);
                                            setNet("devnet");
                                        }
                                    }} /></div>
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => { localStorage.removeItem('token'); setUser(null); route.push('/') }}>
                                    Sign Out
                                </MenubarItem>
                            </MenubarContent>
                        </div>
                    </div>
                    :
                    <div className="flex gap-4">
                        <Button onClick={() => { route.push('/auth/signin') }} className="rounded-full bg-transparent border hover:bg-white hover:text-black">Sign In</Button>
                        <Button onClick={() => { route.push('/auth/register') }} className="rounded-full bg-transparent border hover:bg-white hover:text-black hidden md:block">Sign Up</Button>
                    </div>
                }
            </MenubarMenu>
        </Menubar>
    )
}
export default Navbar;