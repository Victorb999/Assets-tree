'use client'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import Image from 'next/image'

import { Asset, Location } from '@/types/returnApiTypes'
import AssetImg from '@/assets/icons/cube.svg'
import ComponentImg from '@/assets/icons/box.svg'
import LocationImg from '@/assets/icons/location.svg'
import useFilterAssets from './useFilterAssets'

interface TreeListProps {
  assets: Asset[]
  locations: Location[]
}

export const TreeList = ({ assets, locations }: TreeListProps) => {
  const { assetsFiltered, filterLocationOrAssetPerName, locationsFiltered } =
    useFilterAssets({ assets, locations })

  /*   console.log(locationsFiltered);
  console.log(assetsFiltered);
 */
  const renderAsset = useCallback((asset: Asset) => {
    return (
      <div key={asset.id}>
        <div className="flex gap-2 pl-4">
          <Image
            alt={asset.sensorType ? 'component' : 'asset'}
            height={22}
            src={asset.sensorType ? ComponentImg : AssetImg}
            title={`id: ${asset.id} / parentId: ${asset.parentId} / locationId: ${asset.locationId}`}
            width={22}
          />
          <h3>{asset.name}</h3>
        </div>
      </div>
    )
  }, [])

  const returnIsolatedAssets = () => {
    return (
      <div>
        {assetsFiltered
          .filter((asset) => !asset.locationId && !asset.parentId)
          .map((asset) => (
            <div key={asset.id}>
              <div className="flex gap-2 p-2">{renderAsset(asset)}</div>
            </div>
          ))}
      </div>
    )
  }

  const returnComponentLocation = useCallback(
    (locationId: string) => {
      return (
        <div>
          {assetsFiltered
            .filter(
              (asset) => asset.sensorType && asset.locationId === locationId
            )
            .map((asset) => (
              <div key={asset.id}>
                <div className="flex gap-2 ml-8 border-l-2 border-gray-600">
                  {renderAsset(asset)}
                </div>
              </div>
            ))}
        </div>
      )
    },
    [assetsFiltered, renderAsset]
  )

  const returnComponentAssets = useCallback(
    (assetId: string) => {
      return (
        <div>
          {assetsFiltered
            .filter((asset) => asset.sensorType && asset.parentId === assetId)
            .map((asset) => (
              <div key={asset.id}>
                <div className="flex gap-2 ml-8 border-l-2 border-gray-600">
                  {renderAsset(asset)}
                </div>
              </div>
            ))}
        </div>
      )
    },
    [assetsFiltered, renderAsset]
  )

  const returnSubAssets = useCallback(
    (assetId: string) => {
      return (
        <div>
          {assetsFiltered
            .filter((asset) => asset.parentId === assetId && !asset.sensorId)
            .map((asset) => (
              <div key={asset.id}>
                <div className="flex gap-2 ml-8 border-l-2 border-gray-600">
                  {renderAsset(asset)}
                </div>
                <div className="ml-12">{returnComponentAssets(asset.id)}</div>
              </div>
            ))}
        </div>
      )
    },
    [assetsFiltered, renderAsset, returnComponentAssets]
  )

  const returnLocationAsset = useCallback(
    (idLocation: string) => {
      return (
        <div>
          {assetsFiltered
            .filter(
              (asset) => asset.locationId === idLocation && !asset.sensorId
            )
            .map((asset) => (
              <div key={asset.id}>
                <div className="ml-4 border-l-2 border-gray-600">
                  {renderAsset(asset)}
                </div>
                {returnSubAssets(asset.id)}
                {returnComponentAssets(asset.id)}
              </div>
            ))}
        </div>
      )
    },
    [assetsFiltered, renderAsset, returnSubAssets, returnComponentAssets]
  )

  const memoizedTree = useMemo(() => {
    const cache: Record<string, JSX.Element> = {}
    const generateTree = (parentId: string | null): JSX.Element => {
      if (cache[parentId || 'root']) {
        return cache[parentId || 'root']
      }

      const locationsTree = locationsFiltered.filter(
        (location) => location.parentId === parentId
      )

      const result = (
        <div>
          {locationsTree.map((location) => (
            <div
              className={
                location.parentId
                  ? 'p-2 ml-4 border-l-2 border-gray-600'
                  : 'pl-2'
              }
              key={location.id}
            >
              <div className="flex gap-2">
                <Image
                  alt="location"
                  height={22}
                  src={LocationImg}
                  title={`id: ${location.id} - 
                  parentId: ${location.parentId} `}
                  width={22}
                />
                <h3>{location.name}</h3>
              </div>
              {generateTree(location.id)}
              {returnLocationAsset(location.id)}
              {returnComponentLocation(location.id)}
            </div>
          ))}
        </div>
      )

      cache[parentId || 'root'] = result
      return result
    }

    return generateTree(null)
  }, [returnComponentLocation, returnLocationAsset, locationsFiltered])

  return (
    <div className="flex flex-col">
      <input
        className="w-[25%] md:w-[40dvw] text-gray-900"
        onChange={(e) => filterLocationOrAssetPerName(e)}
        placeholder="Buscar ativo ou local"
        type="text"
      />
      <div className="p-4 rounded min-h-[80dvh] bg-gray-400 w-[25%] md:w-[40dvw]">
        {memoizedTree}
        {returnIsolatedAssets()}
      </div>
    </div>
  )
}
