'use client'

import MyTable from "@/components/table/Table";
import { useGlobalContext } from "@/context/global-context";
import { getMyTokens, getMyTokensTotalNumber } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyTokens() {
  const { net } = useGlobalContext();
  const [tokens, setTokens] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [total, setTotal] = useState<any>(0);
  const searchParams = useSearchParams();

  useEffect(() => {
      fetchData();
    }, [net]);
  
    const fetchData = (p = page, s = size) => {
      if (p > 0 && s > 0 && net) {
        getMyTokens(p, s, net === "devnet").then(tokens => tokens && setTokens(tokens));
        getMyTokensTotalNumber(net === "devnet").then(number => setTotal(number));
      }
    }
  
    useEffect(() => {
      const params = new URLSearchParams(searchParams);
      const page = Number(params.get('page') || 1);
      const size = Number(params.get('size') || 5);
      setPage(page)
      setSize(size)
      fetchData(page, size);
    },[searchParams])

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)]">
      <div>
        <MyTable header={[{
          key: "url",
          value: "#"
        }, {
          key: "name",
          value: "Name"
        }, {
          key: "address",
          value: "Address"
        }, {
          key: "symbol",
          value: "Symbol"
        }, {
          key: "description",
          value: "Description"
        }, {
          key: "decimals",
          value: "Decimals"
        }, {
          key: "supply",
          value: "Supply"
        }, {
          key: "created_at",
          value: "Created_at"
        }]} body={tokens.map(token => ({
          name: {
            value: token.name
          },
          address: {
            value: <a target="_blank" className="underline text-[#00a6f4]" href={`https://solscan.io/token/${token.address}${net === "devnet" ? "?cluster=devnet" : ""}`}>{token.address.substring(0, 8) + "..." + token.address.substring(token.address.length - 8)}</a>
          },
          symbol: {
            value: token.symbol
          },
          url: {
            value: <img src={token.url} className="size-10 rounded-full aspect-square" />
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
