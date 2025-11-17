"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteUnit } from "@/actions/properties";
import type { Unit } from "@/lib/db/schema/properties";

interface UnitsTableProps {
  units: Unit[];
  propertyId: string;
}

export function UnitsTable({ units, propertyId }: UnitsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this unit?")) {
      return;
    }

    setDeletingId(id);
    const result = await deleteUnit(id);
    setDeletingId(null);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "occupied":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "vacant":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "maintenance":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "reserved":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Unit Number</TableHead>
          <TableHead>Bedrooms</TableHead>
          <TableHead>Bathrooms</TableHead>
          <TableHead>Sq Ft</TableHead>
          <TableHead>Rent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.unitNumber}</TableCell>
            <TableCell>{unit.bedrooms}</TableCell>
            <TableCell>{unit.bathrooms}</TableCell>
            <TableCell>
              {unit.squareFeet
                ? `${Number(unit.squareFeet).toLocaleString()} sq ft`
                : "—"}
            </TableCell>
            <TableCell>
              {unit.monthlyRent
                ? `$${Number(unit.monthlyRent).toLocaleString()}/mo`
                : "—"}
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={getStatusColor(unit.status)}>
                {unit.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === unit.id}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/properties/${propertyId}/units/${unit.id}/edit`}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(unit.id)}
                    disabled={deletingId === unit.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
