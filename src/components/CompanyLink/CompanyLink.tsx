"use client";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import Gold from "@/assets/icons/gold.svg";

interface CompanyLinkProps {
  company: {
    id: string;
    name: string;
  };
}
export const CompanyLink = ({ company }: CompanyLinkProps) => {
  const idSelected = usePathname().split("/")[2] ?? "";

  return (
    <Link
      className="flex gap-2 items-center p-2
     text-white rounded bg-blue-900 
     hover:bg-blue-800
     active:bg-blue-700"
      href={`/company/${company.id}`}
      id={company.id}
      key={company.id}
      style={
        idSelected === company.id
          ? { backgroundColor: "rgb(29 78 216 / var(--tw-bg-opacity))" }
          : {}
      }
    >
      <Image alt="gold  icon" height={14} src={Gold} width={14} />
      {company.name}
    </Link>
  );
};
