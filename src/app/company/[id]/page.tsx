import { TreeList } from "@/components/TreeList/TreeList";
import { returnAssets, returnLocations } from "@/services/apiTractian";
import { Suspense } from "react";

interface PageProps {
  params: { id: string };
}

export default async function CustomersPage({ params }: PageProps) {
  const locations = await returnLocations(params.id);
  const assets = await returnAssets(params.id);

  return (
    <main className="flex min-h-screen flex-col w-full px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <TreeList locations={locations} assets={assets} />
      </Suspense>
    </main>
  );
}
