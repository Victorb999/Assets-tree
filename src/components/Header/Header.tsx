import { returnCompanies } from "@/services/apiTractian";

import { CompanyLink } from "../CompanyLink/CompanyLink";
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
          <CompanyLink company={company} key={company.id} />
        ))}
      </div>
    </header>
  );
};
