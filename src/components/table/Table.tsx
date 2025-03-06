'use client'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

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

    const onPrev = () => {
    if (page > 1) {
        setPage(prev => prev - 1);
    }
    }
    const onNext = () => {
        if (page < maxPage) {
            setPage(prev => prev + 1);
        }
    }
    const goTo = (num: number) => {
        setPage(num);
    }
    console.log("table",header, body)
    useEffect(() => {
        setMaxPage(Math.ceil(total/size));
    }, [total])
    return (
        <>
        <Table>
          <TableHeader>
            <TableRow>
                {header.map((item, index) => (<TableHead key={index} className="text-center">{item.value}</TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {body.map((row, index) => (
              <TableRow key={index}>
                {header.map((cell, index) => (<TableCell key={index} className="mx-auto text-center">{row[cell.key].value}</TableCell>))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="cursor-pointer" onClick={onPrev}/>
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
              <PaginationLink onClick={() => goTo(page)}>{page}</PaginationLink>
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
              <PaginationNext className="cursor-pointer" onClick={onNext}/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </>
    )
}

export default MyTable;