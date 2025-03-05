import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { hashSync, compareSync } from "bcryptjs";
import { generate_token, validate_token } from "../validate-token/route";

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('Authorization');
        if (!token || !token.startsWith("Bearer ")) {
            return new NextResponse(JSON.stringify({
                message: "Wrong Credentials",
                ok: false
            }))
        }
        const { email, name, avatar } = validate_token(token.substring(7));
        const { password, oldPassword } = await req.json();
        const supabase = await createClient();
        const { data: user } = await supabase.from("users").select().eq("email", email).single();
        const check = compareSync(oldPassword, user?.password)
        if (check) {
            const hash = hashSync(password);
            const { error } = await supabase.from("users").update({ password: hash }).eq("email", email);
            return new NextResponse(JSON.stringify({
                message: error?.message || "update success",
                token: !error ? generate_token(email!, name!, avatar!) : undefined,
                ok: !error
            }))
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