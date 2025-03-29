import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "./ui/button";

function CustomTable({data}) {
  return (
    <div className="overflow-x-auto p-4">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Commandes</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium"> {item.order_name}</TableCell>
                <TableCell>Idriss Moula</TableCell>
                <TableCell>Grant thornton</TableCell>
                <TableCell>
                  <span className="inline-block bg-orange-50 border-2 border-orange-400 text-orange-400 rounded-full px-3 py-1 text-sm font-medium">
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>2</TableCell>
                <TableCell>{item.created_at}</TableCell>
                <TableCell><Button className={'bg-blue-300'}>Voir</Button></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default CustomTable;
