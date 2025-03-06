import { validate_token } from "@/utils/jwt";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: Request
) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const size = parseInt(url.searchParams.get("size") || "10");
  const token = req.headers.get("Authorization");
  if (!token) {
    return new Response(JSON.stringify({
        message: "Authentication error",
        ok: false
    }) , {status: 403})
  }
  const { email:user } = validate_token(token.substring(7));
  if (user) {
    const supabase = await createClient();
    const tokens = (await supabase.from("tokens").select("name, created_at, url, address, symbol, description, decimals, supply").eq("user", user).order("created_at", { ascending: false}).range(page * size - size, page * size - 1)).data;
    return new Response(JSON.stringify(tokens))
  } else {
    return new Response(JSON.stringify({
        message: "Authentication error",
        ok: false
    }) , {status: 403})
  }
}