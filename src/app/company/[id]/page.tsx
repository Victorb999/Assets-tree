//import { TreeList } from "@/components/TreeList/TreeList";
import { FilterButtons } from "@/components/FilterButtons/FilterButtons";
import { TreeList2 } from "@/components/TreeList/TreeList2";

import { Suspense } from "react";
import { returnAssets, returnLocations } from "@/services/apiTractian";

interface PageProps {
  params: { id: string };
}

export default async function CustomersPage({ params }: PageProps) {
  const locations = await returnLocations(params.id);
  const assets = await returnAssets(params.id);

  return (
    <main className="flex flex-col w-full px-4">
      <FilterButtons assets={assets} locations={locations} />
      <Suspense fallback={<div>Loading...</div>}>
        <TreeList2 assets={assets} locations={locations} />
      </Suspense>
    </main>
  );
}
