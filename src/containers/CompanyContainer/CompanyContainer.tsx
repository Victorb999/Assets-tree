'use client'
import { Asset, Location } from '@/types/returnApiTypes'
import { AssetDetails } from '@/components/AssetDetails/AssetDetails'
import { FilterButtons } from '@/components//FilterButtons/FilterButtons'
import { Loading } from '@/components/Loading/Loading'
import {
  assetsFilteredAtom,
  loadingTreeAtom,
  locationsFilteredAtom
} from '@/store/store'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const TreeList = dynamic(() => import('@/components/TreeList/TreeList'), {
  loading: () => <Loading msg="Isso pode demorar um pouco" />
})

type Props = {
  assets: Asset[]
  locations: Location[]
}
export default function CompanyContainer({ assets, locations }: Props) {
  const [assetsFiltered, setAssetsFiltered] = useAtom(assetsFilteredAtom)
  const [locationsFiltered, setLocationsFiltered] = useAtom(
    locationsFilteredAtom
  )
  const [loadingTree, setLoadingTree] = useAtom(loadingTreeAtom)

  useEffect(() => {
    setLoadingTree(false)
    setAssetsFiltered(assets)
    setLocationsFiltered(locations)
  }, [
    assets,
    locations,
    setAssetsFiltered,
    setLocationsFiltered,
    setLoadingTree
  ])

  if (loadingTree) return <Loading msg="Carregando os ativos e localizações" />

  return (
    <div className="flex flex-col w-full p-4 gap-4">
      {assets.length > 0 && locations.length > 0 && (
        <>
          <FilterButtons assets={assets} locations={locations} />
          <div className="flex gap-2">
            <TreeList
              assetsFiltered={assetsFiltered}
              locationsFiltered={locationsFiltered}
            />
            <AssetDetails />
          </div>
        </>
      )}
    </div>
  )
}
