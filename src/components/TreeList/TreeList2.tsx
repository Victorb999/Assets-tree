'use client'
import { useCallback, useMemo } from 'react'

import Image from 'next/image'
import LocationImg from '@/assets/icons/location.svg'

import { Asset } from '@/types/returnApiTypes'
import { AssetWithLocation, LocationGroup, SubAsset } from '@/types/treeTypes'
import { useTreeList } from './useTreeList'

import { assetsFilteredAtom, locationsFilteredAtom } from '@/store/store'
import { useAtom } from 'jotai'

import { AssetItem } from '@/components/AssetItem/AssetItem'

export const TreeList2 = () => {
  console.time('begin tree2')

  const [locationsFiltered] = useAtom(locationsFilteredAtom)
  const [assetsFiltered] = useAtom(assetsFilteredAtom)

  const { isolatedAssets, locations: treeLocations } = useTreeList({
    assets: assetsFiltered,
    locations: locationsFiltered
  })

  const renderAssets = useCallback((assets: Asset[]) => {
    return (
      <div>
        {assets.map((asset) => (
          <div className="flex gap-2 ml-4" key={asset.id}>
            <AssetItem asset={asset} />
          </div>
        ))}
      </div>
    )
  }, [])

  const renderSubAssets = useCallback(
    (assets: SubAsset[]) => {
      return (
        <div>
          {assets.map((asset) => (
            <div className="flex flex-col ml-4" key={asset.subAsset.id}>
              <AssetItem asset={asset.subAsset} />
              {renderAssets(asset.componentWithAssets)}
            </div>
          ))}
        </div>
      )
    },
    [renderAssets]
  )

  const renderAssetsWithLocation = useCallback(
    (assets: AssetWithLocation[]) => {
      return (
        <div>
          {assets.map((asset) => (
            <div
              className="flex flex-col ml-4"
              key={asset.assetWithLocation.id}
            >
              <AssetItem asset={asset.assetWithLocation} />
              {renderSubAssets(asset.subAssets)}
              {renderAssets(asset.componentWithAssets)}
            </div>
          ))}
        </div>
      )
    },
    [renderAssets, renderSubAssets]
  )

  const memoizedRenderTree = useMemo(() => {
    const renderTree = (location: LocationGroup[]) => {
      return (
        <div>
          {location.map((location) => (
            <div key={location.location.id}>
              <div className="flex flex-col ml-2">
                <div className="flex gap-2">
                  <Image
                    alt="location"
                    height={22}
                    src={LocationImg}
                    width={22}
                  />
                  <h3>{location.location.name}</h3>
                </div>
                {renderTree(location.sublocations)}
                {renderAssetsWithLocation(location.assetsWithLocation)}
                {renderAssets(location.componentWithAssets)}
              </div>
            </div>
          ))}
        </div>
      )
    }
    return renderTree
  }, [renderAssets, renderAssetsWithLocation])

  // TODO :
  // LOADINGS e msg de nenhum asset
  // performace
  // tela inicial
  // Fechar combo
  // video

  console.timeEnd('begin tree2')
  return (
    <main
      className="flex flex-col p-4 gap-4
    rounded min-h-[80dvh] w-[40%] md:w-[50dvw] border border-gray-700"
    >
      <div className="flex flex-col">
        {memoizedRenderTree(treeLocations)}
        <div>
          {isolatedAssets.map((asset) => (
            <div className="flex gap-2 p-2" key={asset.id}>
              <AssetItem asset={asset} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
