import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { hashSync, compareSync } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, password, oldPassword } = await req.json();
        const supabase = await createClient();
        const { data: user } = await supabase.from("users").select().eq("email", email).single();
        const check = compareSync(oldPassword, user?.password)
        if (check) {
            const hash = hashSync(password);
            const { error } = await supabase.from("users").update({ password: hash }).eq("email", email);
            return new NextResponse(JSON.stringify({
                message: error?.message || "update success",
                ok: !error
            }))
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