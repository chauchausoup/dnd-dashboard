import { ColumnDef } from "@tanstack/react-table";
import { truncateText } from "@/lib/utils";

import { Spell, SpellDetail } from "@/db";

interface SpellWithDetails extends Spell {
    details?: SpellDetail;
}

export const DashboardTableColumn = (): ColumnDef<SpellWithDetails>[] => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "level",
        header: "Level",
      },
      {
        id: "description",
        header: "Description",
        cell: ({ row }) =>
          truncateText(row.original.details?.desc?.join("\n") || "No description", 90),
      },
      {
        id: "casting_time",
        header: "Casting Time",
        cell: ({ row }) => truncateText(row.original.details?.casting_time || "N/A", 20),
      },
      {
        id: "range",
        header: "Range",
        cell: ({ row }) => truncateText(row.original.details?.range || "N/A", 20),
      },
      {
        id: "components",
        header: "Components",
        cell: ({ row }) =>
          truncateText(row.original.details?.components?.join(", ") || "N/A", 30),
      },
      {
        id: "ritual",
        header: "Ritual",
        cell: ({ row }) => (row.original.details?.ritual ? "Yes" : "No"),
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => truncateText(row.original.details?.duration || "N/A", 20),
      },
      {
        id: "concentration",
        header: "Concentration",
        cell: ({ row }) => (row.original.details?.concentration ? "Yes" : "No"),
      },
      {
        id: "school",
        header: "School",
        cell: ({ row }) =>
          truncateText(row.original.details?.school?.name || "N/A", 20),
      },
      {
        id: "classes",
        header: "Classes",
        cell: ({ row }) =>
          truncateText(
            row.original.details?.classes?.map((cls) => cls.name).join(", ") || "N/A",
            40
          ),
      },
]