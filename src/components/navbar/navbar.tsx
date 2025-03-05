'use client'

import { useEffect, useState } from "react";
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
import logo from "../../assert/image/logo-sixcool.webp";
import { useGlobalContext } from "@/context/global-context";

const Navbar = () => {
    const { user, login, logout } = useGlobalContext();
    const route = useRouter();
    const [token, setToken] = useState<any>();
    const [rightDiv, setRIghtDiv] = useState<any>();
    const TokenCheck = async (token: any) => {
        const reponse = await fetch('/api/auth/validate-token'
            , {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                }
            })
        const data = await reponse.json();
        if (!data.ok) {
            localStorage.removeItem('token');
            logout();
            setToken(null);
            route.push('/auth/signin', { scroll: true });
        }
        else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.email);
            setToken(data.token);
            login(data.name, data.avatar);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            logout();
            setToken(null);
            route.push('/auth/signin', { scroll: true });
            return;
        }
        else {
            TokenCheck(token);
        }
    }, [])

    useEffect(() => {
        setRIghtDiv(
            user.isLoggedIn ?
                <div>
                    <MenubarTrigger className=" relative">
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
                        <MenubarItem onClick={() => { localStorage.removeItem('token'); logout(); route.push('/auth/signin') }}>
                            Sign Out
                        </MenubarItem>
                    </MenubarContent>
                </div>
                :
                <div className="flex gap-4">
                    <Button onClick={() => { route.push('/auth/signin') }}>Sign In</Button>
                    <Button onClick={() => { route.push('/auth/register') }}>Sign Up</Button>
                </div>
        )
    }, [user.isLoggedIn])
    return (
        <Menubar className="flex justify-between py-4 items-center bg-[#a0a0a0] bg-opacity-50 rounded-full px-10 mb-10 h-20">
            <MenubarMenu>
                <Image src={logo} alt="logo" className="h-full w-fit cursor-pointer" onClick={() => token ? route.push("/") : ''} />
                {
                    rightDiv
                }
            </MenubarMenu>
        </Menubar>
    )
}
export default Navbar;