import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { hashSync } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        const supabase = await createClient();
        const { data: user } = await supabase.from("users").select().eq("email", email).single();
        if (user) {
            return new NextResponse(JSON.stringify({
                message: "Email already exists",
                ok: false
            }));
        }
        else {
            const hash = hashSync(password);
            const { error } = await supabase.from("users").insert({ name, email, password: hash });
            return new NextResponse(JSON.stringify({
                message: error?.message || "register success",
                ok: !error
            }))
        }
    }
    catch (error) {
        return new NextResponse(JSON.stringify({
            message: error,
            ok: false
        }));
    }
}