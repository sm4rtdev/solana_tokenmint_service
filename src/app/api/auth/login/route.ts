import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { compareSync, hashSync } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const SECRET_KEY = "navy-secret";
        const { email, password } = await req.json();
        const { data: user } = await supabase.from("users").select().eq("email", email).single();
        if (!user) {
            return new NextResponse(JSON.stringify({
                message: "User not found. Please sign in and try again",
                ok: false
            }));
        }
        const check = compareSync(password, user?.password);
        if (check) {
            const token = jwt.sign({ email: email, password: password }, SECRET_KEY, { expiresIn: '1d' });
            return new NextResponse(JSON.stringify({
                message: "You have successfully signed in.",
                token: token,
                ok: true
            }));
        } else {
            return new NextResponse(JSON.stringify({
                message: "wrong credentials",
                ok: false
            }))
        }
    }
    catch (error) {
        return new NextResponse(JSON.stringify({
            message: error,
            ok: false
        }))
    }
}