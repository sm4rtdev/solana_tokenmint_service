'use client'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type HeaderItem = {
    key: string,
    value: ReactNode,
    // parentProps: any[]
}
type BodyRow = {
    [key: string]: {
        value: ReactNode,
        // parentProps: any[]
    }
}

const MyTable = ({
    page, 
    setPage, 
    size, 
    setSize, 
    header,
    body, 
    total
  }:{
    page: number,
    setPage: Dispatch<SetStateAction<number>>,
    size: number,
    setSize: Dispatch<SetStateAction<number>>,
    header: HeaderItem[],
    body: BodyRow[],
    total: number
  }) => {
    const [maxPage, setMaxPage] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const onPrev = () => {
      if (page > 1) {
        const params = new URLSearchParams(searchParams);
        params.set("page", `${Number(params.get("page") || 1) - 1}`);
        router.replace(`${pathname}?${params.toString()}`)
      }
    }
    const onNext = () => {
        if (page < maxPage) {
          const params = new URLSearchParams(searchParams);
          params.set("page", `${Number(params.get("page") || 1) + 1}`);
          router.replace(`${pathname}?${params.toString()}`)
        }
    }
    const goTo = (num: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${num}`);
      router.replace(`${pathname}?${params.toString()}`)
    }

    const onSize = (size: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('size', `${size}`);
      router.replace(`${pathname}?${params.toString()}`)
    }
    
    useEffect(() => {
        setMaxPage(Math.ceil(total/size));
    }, [total, size])
    return (
        <div className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow className="border-[#fff6] border-double !border-b-[3px]">
                {header.map((item, index) => (<TableHead key={index} className="text-center">{item.value}</TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {body.map((row, index) => (
              <TableRow key={index} className="hover:bg-[#fff2] border-[#fff3]">
                {header.map((cell, index) => (<TableCell key={index} className="mx-auto text-center">{row[cell.key].value}</TableCell>))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={onPrev} />
              </PaginationItem>

              {page > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => goTo(1)}>1</PaginationLink>
                </PaginationItem>
              )}
              {page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {page > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => goTo(page - 1)}>{page - 1}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink className="bg-[#fff4]" onClick={() => goTo(page)}>{page}</PaginationLink>
              </PaginationItem>
              {page < maxPage && (
                <PaginationItem>
                  <PaginationLink onClick={() => goTo(page + 1)}>{page + 1}</PaginationLink>
                </PaginationItem>
              )}
              {page < maxPage - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {page < maxPage - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => goTo(maxPage)}>{maxPage}</PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext onClick={onNext}/>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Select value={`${size}`} onValueChange={onSize}>
            <SelectTrigger className="w-[96px]">
              <SelectValue placeholder="size" />
            </SelectTrigger>
            <SelectContent className="w-[74px]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
    )
}

export default MyTable;