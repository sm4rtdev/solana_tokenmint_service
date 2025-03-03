'use client'

import MyTable from "@/components/table/Table";
import { Button } from "@/components/ui/button";
import { getTokenList } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Home() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(Math.ceil(1/size));

  useEffect(() => {
    getTokenList(page, size).then(tokens => setTokens(tokens));
  }, [page, size]);
  
  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)]">
      <div>
        <Button><a href="/create" className="underline-none">Create Token</a></Button>
      </div>
      <div>
        <MyTable header={[{
          key: "url",
          value: "#"
        },{
          key: "name",
          value: "Name"
        },{
          key: "address",
          value: "Address"
        },{
          key: "user",
          value: "User"
        }]} body={tokens.map(token =>({
          name: {
            value: token.name
          },
          address: {
            value: token.address
          },
          user: {
            value: token.user
          },
          url: {
            value: <img src={token.url} className="size-10 rounded-full aspect-square"/>
          }
        }))} page={page} setPage={setPage} size={size} setSize={setSize} total={total} />
      </div>
    </div>
  );
}
