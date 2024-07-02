import { Suspense } from 'react'
import { returnAssets, returnLocations } from '@/services/apiTractian'
import CompanyContainer from '@/containers/CompanyContainer/CompanyContainer'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const [locations, assets] = await Promise.all([
    returnLocations(params.id),
    returnAssets(params.id)
  ])

  return (
    <main className="flex flex-col w-full p-4 gap-4">
      <Suspense fallback={<div>Loading ...</div>}>
        <CompanyContainer assets={assets} locations={locations} />
      </Suspense>
    </main>
  )
}
