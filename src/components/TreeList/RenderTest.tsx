'use client'
import { Asset, Location } from '@/types/returnApiTypes'
import { useTreeList } from './useTreeList'

import { assetsFilteredAtom, locationsFilteredAtom } from '@/store/store'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'

//import { TreeList2 } from './TreeList2'

const TreeList2 = dynamic(() => import('./TreeList2'), {
  loading: () => <p>Loading...</p>
})

type Props = {
  assets: Asset[]
  locations: Location[]
}
export const RenderTest = ({ assets, locations }: Props) => {
  const [locationsFiltered] = useAtom(locationsFilteredAtom)
  const [assetsFiltered] = useAtom(assetsFilteredAtom)

  const { isolatedAssets, locations: treeLocations } = useTreeList({
    assets: assetsFiltered,
    locations: locationsFiltered
  })

  return (
    <div>
      <TreeList2
        isolatedAssets={isolatedAssets}
        treeLocations={treeLocations}
      />
    </div>
  )
}
