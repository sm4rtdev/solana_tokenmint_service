import { createClient } from "@/utils/supabase/server";


export async function GET(
  req: Request
) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const size = parseInt(url.searchParams.get("size") || "10");
  const user = url.searchParams.get("user");
  let users = null
  const supabase = await createClient();
  if (user) {
    users = (await supabase.from("tokens").select().eq("user", user).order("created_at", { ascending: false}).range(page * size - size, page * size - 1)).data;
  } else {
    users = (await supabase.from("tokens").select().order("created_at", { ascending: false}).range(page * size - size, page * size - 1)).data;
  }
  return new Response(JSON.stringify(users))
}

export async function POST(
  req: Request
) {
  const token = await req.json();
  const supabase = await createClient();
  const {error} = await supabase.from("tokens").insert({
    ...token
  })
  return new Response(error?.message || "saved")
}