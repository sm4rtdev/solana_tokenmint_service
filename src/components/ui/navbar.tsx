'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./button";
import logo from "../../assert/image/logo1.png";

const Navbar = () => {
    const route = useRouter();
    const [token, setToken] = useState<any>();
    const TokenCheck = async (token: any) => {
        if (!token) {
            route.push('/auth/signin');
            return;
        }
        else {
            const reponse = await fetch('/api/users?token'
                , {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer'+ token,
                    }
                })
            const data = await reponse.json();
            if (!data.ok) {
                localStorage.removeItem('token');
                route.push('/auth/signin');
            }
            else {
                localStorage.setItem('token', data.token);
                route.push('/');
            }
            return;
        }
    }
    useEffect(() => {
        setToken(localStorage.getItem('token'));
        TokenCheck(token);
    }, [])
    return (
        <div className="flex justify-between py-4 items-center bg-[#a0a0a0] bg-opacity-50 rounded-full px-10 mb-10">
            <Image src={logo} alt="logo" className="size-16 cursor-pointer" onClick={() => route.push("/")} />
            {
                token? <>   </>
                :
                <div className="flex gap-4">
                    <Button onClick={() => route.push('/auth/signin')}>Sign In</Button>
                    <Button onClick={() => route.push('/auth/register')}>Sign Up</Button>
                </div>}
        </div>
    )
}
export default Navbar;