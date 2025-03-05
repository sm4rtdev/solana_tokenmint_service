import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your jwt secret key";

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

export const validate_token = (token: string) => {
    try {
        const { exp, email, name, avatar } = jwt.verify(token, SECRET_KEY) as { exp: number, email: string, name: string, avatar: string };
        if (exp * 1000 <= Date.now()) {
            return {
                ok: false,
                message: "expired"
            }
        }
        return {
            ok: true,
            email,
            name,
            avatar
        }
    } catch (e) {
        console.log("error in paring jwt", e)
        return {
            ok: false,
            message: e
        }
    }

}

export const generate_token = (email: string, name: string, avatar: string | null): string => {
    return jwt.sign({ email, name, avatar }, SECRET_KEY, { expiresIn: '1d' });
}