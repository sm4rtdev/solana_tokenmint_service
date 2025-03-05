import { generate_token, validate_token } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('Authorization');
        if (!token || !token.startsWith("Bearer ")) {
            return new NextResponse(JSON.stringify({
                message: "Wrong Credentials",
                ok: false
            }))
        }
        else {
            const payload = validate_token(token.substring(7));
            const newToken = generate_token(payload.email!, payload.name!, payload.avatar!);
            return new NextResponse(JSON.stringify({ ok: payload.ok, message: payload.message, avatar: payload.avatar, name: payload.name, email: payload.email, token: newToken }))
        }
    }
    catch (error) {
        return new NextResponse(JSON.stringify({
            message: error,
            ok: false
        }))
    }
}