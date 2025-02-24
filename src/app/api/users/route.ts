import { createClient } from "@/utils/supabase/server";
import { compareSync, hashSync } from "bcryptjs";
import { error } from "console";

export async function GET(
  req: Request
) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const size = parseInt(url.searchParams.get("size") || "10");
  const supabase = await createClient();
  const id = url.searchParams.get("id");
  const email = url.searchParams.get("email");
  if (id) {
    const { data: users } = await supabase.from("users").select().or(`id.eq.${id},email.eq.${email}`);
    return new Response(JSON.stringify(users![0]))
  } else {
    const { data: users } = await supabase.from("users").select().order("created_at", { ascending: false}).range(page * size - size, page * size - 1);
    return new Response(JSON.stringify(users))
  }
}

export async function POST(
  req: Request
) {
  const url = new URL(req.url);
  const login = url.searchParams.get("login");
  const register = url.searchParams.get("register");
  const reset = url.searchParams.get("reset");
  const supabase = await createClient();
  const {name, email, avatar, password, oldPassword} = await req.json();
  if (login != null) {
    const {data: user} = await supabase.from("users").select().eq("email", email).single();
    const check = compareSync(password, user?.password)
    if (check) {
      return new Response(JSON.stringify({
        message: "login success",
        ok: true
      }));
    } else {
      return new Response(JSON.stringify({
        message: "wrong credentials",
        ok: false
      }))
    }
  }
  if (register != null) {
    const hash = hashSync(password);
    const {error} = await supabase.from("users").insert({name, email, avatar, password: hash});
    return new Response(JSON.stringify({
      message: error?.message || "register success",
      ok: !error
    }))
  }
  if (reset != null) {
    const {data: user} = await supabase.from("users").select().eq("email", email).single();
    const check = compareSync(oldPassword, user?.password)
    if (check) {
      const hash = hashSync(password);
      const {error} = await supabase.from("users").update({password: hash}).eq("email", email);
      return new Response(JSON.stringify({
        message: error?.message || "update success",
        ok: !error
      }))
    } else {
      return new Response(JSON.stringify({
        message: "wrong credentials",
        ok: false
      }))
    }
  }
}

export async function PUT(
  req: Request
) {
  const {id, name, email, avatar} = await req.json();
  const supabase = await createClient();
  const {error} = await supabase.from("users").update({name, avatar}).or(`id.eq.${id},email.eq.${email}`);
  return new Response(error?.message || "Updated")
}

export async function DELETE(
  req:Request
) {
  const {id, email} = await req.json();
  const supabase = await createClient();
  const {error} = await supabase.from("users").delete().or(`id.eq.${id},email.eq.${email}`)
  return new Response(error?.message || "Deleted")
}