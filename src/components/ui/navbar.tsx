'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./button";
import logo from "../../assert/image/logo1.png";

const Navbar = () => {
    const route  = useRouter();
    return (
        <div className="flex justify-between py-4 items-center bg-[#a0a0a0] bg-opacity-50 rounded-full px-10 mb-10">
            <Image src={logo} alt="logo" className="size-16" onClick={() => route.push("/")}/>
            <div className="flex gap-4">
                <Button onClick={() => route.push('/signin')}>Sign In</Button>
                <Button onClick={() => route.push('/register')}>Sign Up</Button>
            </div>
        </div>
    )
}
export default Navbar;