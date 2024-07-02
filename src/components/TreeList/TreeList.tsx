'use client'
import { useCallback, useEffect, useMemo } from 'react'

import Image from 'next/image'
import LocationImg from '@/assets/icons/location.svg'

import { Asset, Location } from '@/types/returnApiTypes'
import { AssetWithLocation, LocationGroup, SubAsset } from '@/types/treeTypes'
import { useTreeList } from './useTreeList'

import { AssetItem } from '@/components/AssetItem/AssetItem'

interface TreeListProps {
  assetsFiltered: Asset[]
  locationsFiltered: Location[]
}

export default function TreeList({
  assetsFiltered,
  locationsFiltered
}: TreeListProps) {
  const { isolatedAssets, locations: treeLocations } = useTreeList({
    assets: assetsFiltered,
    locations: locationsFiltered
  })

  useEffect(() => {
    console.log('renderizaçao', assetsFiltered.length)
  }, [assetsFiltered])

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
        <>
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
        </>
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

  if (treeLocations.length === 0)
    return (
      <div
        className="flex flex-col p-4 gap-4
      rounded min-h-[80dvh] w-[40%] md:w-[50dvw] border border-gray-700"
      >
        <h1 className="text-2xl">Ops...</h1>
        <span>
          Não foi encontrado nenhum ativo ou local. Tente mudar o filtro ou
          pesquisar novamente.
        </span>
      </div>
    )

  return (
    <main
      className="flex flex-col p-4 gap-4
    rounded min-h-[80dvh] w-[40%] md:w-[50dvw] border border-gray-700"
    >
      <div className="flex flex-col">
        <div>
          <pre>{memoizedRenderTree(treeLocations)}</pre>
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
