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
        <Menubar className="flex justify-between py-4 items-center bg-[#a0a0a0] bg-opacity-50 rounded-full px-10 mb-10 h-20">
            <MenubarMenu>
                <Image src={logo} alt="logo" className="h-full w-fit cursor-pointer" onClick={() => route.push("/", {scroll:true})} />
                <div className="flex items-center justify-center gap-4">
                    <span className="hover:bg-gray-100 p-2 rounded-md cursor-pointer" onClick={() => route.push("/tokens", {scroll:true})}>My Tokens</span>
                    <span className="hover:bg-gray-100 p-2 rounded-md cursor-pointer" onClick={() => route.push("/create", {scroll:true})}>Create Token</span>
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
                        <MenubarContent className=" absolute -right-14">
                            <MenubarItem onClick={() => route.push('/profile')}>
                                Profile
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={() => { route.push('/change') }}>
                                Change Password
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={() => { localStorage.removeItem('token'); setUser(null); route.push('/auth/signin') }}>
                                Sign Out
                            </MenubarItem>
                        </MenubarContent>
                    </div>
                    :
                    <div className="flex gap-4">
                        <Button onClick={() => { route.push('/auth/signin') }}>Sign In</Button>
                        <Button onClick={() => { route.push('/auth/register') }}>Sign Up</Button>
                    </div>
                }
            </MenubarMenu>
        </Menubar>
    )
}
export default Navbar;