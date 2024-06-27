//import { TreeList } from "@/components/TreeList/TreeList";
import { FilterButtons } from "@/components/FilterButtons/FilterButtons";
import { TreeList2 } from "@/components/TreeList/TreeList2";

import { returnAssets, returnLocations } from "@/services/apiTractian";
import { Suspense } from "react";

interface PageProps {
  params: { id: string };
}

export default async function CustomersPage({ params }: PageProps) {
  const locations = await returnLocations(params.id);
  const assets = await returnAssets(params.id);

  return (
    <main className="flex w-full px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <TreeList2 locations={locations} assets={assets} />
      </Suspense>
      <FilterButtons />
    </main>
  );
}
