import { createClient } from "@/utils/supabase/server";
import { v4 as uuid } from "uuid";


export async function POST(
    req: Request
) {
    const searchParams = new URL(req.url).searchParams;
    const folder = searchParams.get("path") || "avatar";
    const file = (await req.formData()).get('file')!;
    
    const supabase = await createClient();
    const {data: onlineFile, error} = await supabase.storage.from("sol-token-mint").upload(`${folder}/${uuid()}`, file)
    console.log("data", onlineFile, error);
    const { data: url } = supabase.storage.from("sol-token-mint").getPublicUrl(`${onlineFile?.path}`);
    return new Response(JSON.stringify({
        url: url?.publicUrl
    }))
}

export async function DELETE(
    req: Request
) {
    const searchParams = new URL(req.url).searchParams;
    const publicUrl = searchParams.get("publicUrl");
    if (!publicUrl) return new Response(JSON.stringify({
        ok: false,
        message: "empty url"
    }));
    const chunks = publicUrl.split("/");
    const path = chunks[chunks.length - 2] + "/" + chunks[chunks.length - 1];
    const supabase = await createClient();
    const {error} = await supabase.storage.from("sol-token-mint").remove([path]);
    return new Response(JSON.stringify({
        ok: !error,
        message: error?.message
    }))
}