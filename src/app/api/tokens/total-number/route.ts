

import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const supabase = await createClient();
    const url = new URL(req.url);
    const net = url.searchParams.get("devnet");
    const { count: totalCount, error } = (await supabase.from("tokens" + (net !== null ? "_devnet" : "")).select('*', { count: 'exact'}))
    return new Response(JSON.stringify(totalCount), {
        status: error ? 500 : 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });

}