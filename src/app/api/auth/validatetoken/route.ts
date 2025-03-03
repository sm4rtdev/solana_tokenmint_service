import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@/utils/supabase/server";
import { compareSync } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const SECRET_KEY = 'navy-secret';
        const supabase = await createClient();
        const token = req.headers.get('Authorization');
        if (!token) {
            return new NextResponse(JSON.stringify({
                message: "wrong credentials",
                ok: false
            }))
        }
        else {
            const payload = jwt.verify(token, SECRET_KEY) as { email: string, password: string };
            if (!payload) {
                return new Response(JSON.stringify({
                    message: "invalid token",
                    ok: false
                }))
            }
            else {
                const { data: user } = await supabase.from("users").select().eq("email", payload.email).single();
                const check = compareSync(payload.password, user?.password);
                if (check) {
                    const token = jwt.sign({ email: payload.email, password: payload.password }, SECRET_KEY, { expiresIn: '1d' });
                    return new Response(JSON.stringify({
                        message: "token verified",
                        token: token,
                        ok: true
                    }));
                } else {
                    return new Response(JSON.stringify({
                        message: "wrong credentials",
                        ok: false
                    }))
                }
            }
        }
    }
    catch (error) {
        return new NextResponse(JSON.stringify({
            message: error,
            ok: false
        }))
    }
}