import { validate_token } from "@/utils/jwt";
import { createClient } from "@/utils/supabase/server";


export async function GET(
  req: Request
) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const size = parseInt(url.searchParams.get("size") || "10");
  const user = url.searchParams.get("user");
  const net = url.searchParams.get("devnet");
  
  let tokens: any[] | null = []
  const supabase = await createClient();
  if (user) {
    tokens = (await supabase.from("tokens" + (net !== null ? "_devnet" : "")).select("name, created_at, url, address, symbol, description, decimals, supply").eq("user", user).order("created_at", { ascending: false}).range(page * size - size, page * size - 1)).data;
  } else {
    tokens = (await supabase.from("tokens" + (net !== null ? "_devnet" : "")).select("name, created_at, url, address, symbol, description, decimals, supply").order("created_at", { ascending: false}).range(page * size - size, page * size - 1)).data;
  }
  return new Response(JSON.stringify(tokens))
}

export async function POST(
  req: Request
) {
  const access_token = req.headers.get("Authorization");
  if (!access_token) {
    return new Response(JSON.stringify({
        message: "Authentication error",
        ok: false
    }) , {status: 403})
  }
  const url = new URL(req.url);
  const net = url.searchParams.get("devnet");
  const { email:user } = validate_token(access_token.substring(7));
  const token = await req.json();
  const supabase = await createClient();
  const {error} = await supabase.from("tokens" + (net !== null ? "_devnet" : "")).insert({
    ...token,
    user
  })
  return new Response(JSON.stringify({
    ok: !error,
    message: error?.message
  }))
}