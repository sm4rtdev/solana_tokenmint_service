'use client'

import { useRouter } from "next/navigation";
import { Button } from "./button";

const Navbar = () => {
    const route  = useRouter();
    return (
        <div className="flex justify-between">
            <img src="" alt="logo"/>
            <div className="flex gap-4">
                <Button onClick={() => route.push('/signin')}>Sign In</Button>
                <Button onClick={() => route.push('/register')}>Sign Up</Button>
            </div>
        </div>
    )
}
export default Navbar;