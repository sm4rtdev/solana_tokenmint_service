import { createClient } from "@/utils/supabase/server";
import { validate_token } from "@/utils/jwt";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const net = url.searchParams.get("devnet");
    const token = req.headers.get("Authorization");
    if (!token) {
        return new Response(JSON.stringify({
            message: "Authentication error",
            ok: false
        }), { status: 403 })
    }
    const { email: user } = validate_token(token.substring(7));
    if (user) {
        const supabase = await createClient();
        const { count: totalCount } = (await supabase.from("tokens" + (net !== null ? "_devnet" : "")).select('*', { count: 'exact'}).eq("user", user));
        return new Response(JSON.stringify(totalCount))
    } else {
        return new Response(JSON.stringify({
            message: "Authentication error",
            ok: false
        }), { status: 403 })
    }
}