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
import logo from "../../assets/image/logo-sixcool.webp";
import { useGlobalContext } from "@/context/global-context";

const Navbar = () => {
    const { user, setUser } = useGlobalContext();
    const route = useRouter();

    return (
        <Menubar className="flex justify-between py-4 items-center bg-[#121212] border-0 shadow-xl shadow-[#382158] rounded-full px-10 mb-10 h-20">
            <MenubarMenu>
                <Image src={logo} alt="logo" className="h-full w-fit cursor-pointer" onClick={() => route.push("/", {scroll:true})} />
                <div className="flex items-center justify-center gap-8">
                    <span className="hover:to-white hover:from-white  hover:text-black py-3 px-8 rounded-full cursor-pointer bg-gradient-to-r to-[#351166] from-[#b55ced]" onClick={() => route.push("/tokens", {scroll:true})}>MY TOKENS</span>
                    <span className="hover:to-white hover:from-white  hover:text-black py-3 px-8 rounded-full cursor-pointer bg-gradient-to-r to-[#351166] from-[#b55ced]" onClick={() => route.push("/create", {scroll:true})}>CREATE TOKEN</span>
                </div>
                {
                    user ?
                    <div>
                        <MenubarTrigger className="cursor-pointer relative">
                            {
                                user.avatar ? <img src={user.avatar} alt="avatar" className="size-12 rounded-full" /> :
                                    <CiUser className="size-12 rounded-full border-black border-2" />
                            }
                        </MenubarTrigger>
                        <MenubarContent className=" absolute -right-14 bg-[#090909] shadow-md shadow-gray-400 text-white">
                            <MenubarItem onClick={() => route.push('/profile', {scroll: true})}>
                                Profile
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={() => { route.push('/change', {scroll: true}) }}>
                                Change Password
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={() => { localStorage.removeItem('token'); setUser(null); route.push('/') }}>
                                Sign Out
                            </MenubarItem>
                        </MenubarContent>
                    </div>
                    :
                    <div className="flex gap-4">
                        <Button onClick={() => { route.push('/auth/signin') }} className="rounded-full bg-transparent border hover:bg-white hover:text-black">Sign In</Button>
                        <Button onClick={() => { route.push('/auth/register') }} className="rounded-full bg-transparent border hover:bg-white hover:text-black">Sign Up</Button>
                    </div>
                }
            </MenubarMenu>
        </Menubar>
    )
}
export default Navbar;