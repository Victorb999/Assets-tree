"use client";
import Link from "next/link";
import Image from "next/image";

import Gold from "@/assets/icons/gold.svg";
import { usePathname } from "next/navigation";

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
      href={`/company/${company.id}`}
      className="flex gap-2 items-center p-2
     text-white rounded bg-blue-900 
     hover:bg-blue-800
     active:bg-blue-700"
      id={company.id}
      key={company.id}
      style={
        idSelected === company.id
          ? { backgroundColor: "rgb(29 78 216 / var(--tw-bg-opacity))" }
          : {}
      }
    >
      <Image src={Gold} width={14} height={14} alt="gold  icon" />
      {company.name}
    </Link>
  );
};
