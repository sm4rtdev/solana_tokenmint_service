'use client'

import MyTable from "@/components/table/Table";
import { getMyTokens } from "@/utils/api";
import { useEffect, useState } from "react";

export default function MyTokens() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(Math.ceil(1/size));

  useEffect(() => {
    getMyTokens(page, size).then(tokens => setTokens(tokens));
  }, [page, size]);
  
  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)]">
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
          key: "symbol",
          value: "Symbol"
        },{
          key: "description",
          value: "Description"
        },{
          key: "decimals",
          value: "Decimals"
        },{
          key: "supply",
          value: "Supply"
        },{
          key: "created_at",
          value: "Created_at"
        }]} body={tokens.map(token =>({
          name: {
            value: token.name
          },
          address: {
            value: <a target="_blank" href={`https://explorer.solana.com/address/${token.address}?cluster=devnet`}>{token.address.substring(0, 8) + "..." + token.address.substring(token.address.length - 8)}</a>
          },
          symbol: {
            value: token.symbol
          },
          url: {
            value: <img src={token.url} className="size-10 rounded-full aspect-square"/>
          },
          description: {
            value: token.description
          },
          decimals: {
            value: token.decimals
          },
          supply: {
            value: token.supply
          },
          created_at: {
            value: new Date(token.created_at).toLocaleDateString()
          }
        }))} page={page} setPage={setPage} size={size} setSize={setSize} total={total} />
      </div>
    </div>
  );
}
