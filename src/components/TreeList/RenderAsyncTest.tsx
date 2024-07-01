import { FilterButtons } from '@/components/FilterButtons/FilterButtons'

import { returnAssets, returnLocations } from '@/services/apiTractian'

import { RenderTest } from './RenderTest'

type Props = {
  id: string
}

export default async function RenderAsyncTest({ id }: Props) {
  console.time('begin teste')

  const locations = await returnLocations(id)
  const assets = await returnAssets(id)
  console.timeEnd('begin teste')

  return (
    <main className="flex flex-col w-full p-4 gap-4">
      <FilterButtons assets={assets} locations={locations} />
      <RenderTest locations={locations} assets={assets} />
    </main>
  )
}
