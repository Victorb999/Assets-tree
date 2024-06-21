import { returnCompanies } from "@/services/apiTractian";

import Gold from "@/assets/icons/gold.svg";
import Image from "next/image";
import Link from "next/link";

export const Header = async () => {
  const companies = await returnCompanies();

  return (
    <header className="p-4 w-full flex justify-between">
      <h1 className="text-3xl font-bold text-blue-900">
        <Link href="/">Assets Tree</Link>
      </h1>

      <div className="flex gap-4 ">
        {companies.map((company: { id: string; name: string }) => (
          <Link
            href={`/companies/${company.id}`}
            className="flex gap-2 items-center p-2
             text-white rounded bg-blue-900 
             hover:bg-blue-800
             active:bg-blue-700"
            id={company.id}
            key={company.id}
          >
            <Image src={Gold} width={14} height={14} alt="gold  icon" />
            {company.name}
          </Link>
        ))}
      </div>
    </header>
  );
};
