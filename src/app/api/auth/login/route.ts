import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { compareSync } from "bcryptjs";
import { generate_token } from "@/utils/jwt";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { email, password } = await req.json();
        const { data: user } = await supabase.from("users").select().eq("email", email).single();
        if (!user) {
            return new NextResponse(JSON.stringify({
                message: "user not found",
                ok: false
            }));
        }
        const check = compareSync(password, user?.password);
        if (check) {
            const token = generate_token(email, user.name, user.avatar);
            return new NextResponse(JSON.stringify({
                message: "login success",
                token: token,
                name: user.name,
                avatar: user.avatar,
                ok: true
            }));
        } else {
            return new NextResponse(JSON.stringify({
                message: "Wrong Credentials",
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