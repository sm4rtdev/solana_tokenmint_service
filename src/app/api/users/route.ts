import { generate_token, validate_token } from "@/utils/jwt";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: Request
) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const size = parseInt(url.searchParams.get("size") || "10");
  const supabase = await createClient();
  const email = url.searchParams.get("email");
  console.log(email);
  if (email) {
    const { data: users } = await supabase.from("users").select().eq(`email`, email);
    return new Response(JSON.stringify(users![0]))
  } else {
    const { data: users } = await supabase.from("users").select().order("created_at", { ascending: false }).range(page * size - size, page * size - 1);
    return new Response(JSON.stringify(users))
  }
}

// export async function POST(
//   req: Request
// ) {

// }

export async function PUT(
  req: Request
) {
  const token = req.headers.get('Authorization');
  console.log(token);
  if (!token || !token.startsWith("Bearer ")) {
    return new Response(JSON.stringify({
      message: "Wrong Credentials",
      ok: false
    }))
  }
  const { email } = validate_token(token.substring(7));
  const { name, avatar } = await req.json();
  console.log(name, avatar);
  const supabase = await createClient();
  const { error } = await supabase.from("users").update({ name, avatar }).eq(`email`, email);
  return new Response(JSON.stringify({
    message: error?.message || "Updated",
    ok: !error,
    token: generate_token(email!, name, avatar)
  }))
}

export async function DELETE(
  req: Request
) {
  const { id, email } = await req.json();
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().or(`id.eq.${id},email.eq.${email}`)
  return new Response(error?.message || "Deleted")
}