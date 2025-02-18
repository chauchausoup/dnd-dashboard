import React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  Table as TanStackTable,
} from "@tanstack/react-table";

interface Spell {
  index:string;
  name: string;
  level: number;
  url: string;
  // eslint-disable-next-line
  [key: string]: any;
}

interface DashboardTableContentProps {
  columns: ColumnDef<Spell>[];
  table: TanStackTable<Spell>;
  loading: {
    allSpells: boolean;
    spellDetails: boolean;
  };
}

export const DashboardTableContent: React.FC<
  DashboardTableContentProps
> = ({ columns, table, loading }) => {
  return (
    <Table>
      <TableCaption>A list of D&D 5e spells.</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center"
            >
              No spells found.
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {loading.spellDetails &&
                  !row.original.details ? (
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
