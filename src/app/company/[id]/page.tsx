import { FilterButtons } from '@/components/FilterButtons/FilterButtons'
import { TreeList2 } from '@/components/TreeList/TreeList2'

import { Suspense } from 'react'
import { returnAssets, returnLocations } from '@/services/apiTractian'
import { AssetDetails } from '@/components/AssetDetails/AssetDetails'

interface PageProps {
  params: { id: string }
}

export default async function CustomersPage({ params }: PageProps) {
  const locations = await returnLocations(params.id)
  const assets = await returnAssets(params.id)

  return (
    <main className="flex flex-col w-full p-4 gap-4">
      <FilterButtons assets={assets} locations={locations} />
      <div className="flex gap-2">
        <Suspense
          fallback={
            <div className="w-full text-yellow-500 font-bold">Loading...</div>
          }
        >
          <TreeList2 />
        </Suspense>
        <AssetDetails />
      </div>
    </main>
  )
}
