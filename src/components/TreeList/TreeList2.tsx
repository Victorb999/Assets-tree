'use client'
import { Suspense, useCallback, useDeferredValue, useMemo } from 'react'
import AssetImg from '@/assets/icons/cube.svg'
import ComponentImg from '@/assets/icons/box.svg'
import DotGreen from '@/assets/icons/dot-green-mini.svg'
import DotRed from '@/assets/icons/dot-red-mini.svg'
import Energy from '@/assets/icons/thunder-mini.svg'
import Image from 'next/image'
import LocationImg from '@/assets/icons/location.svg'

import { Asset } from '@/types/returnApiTypes'
import { AssetWithLocation, LocationGroup, SubAsset } from '@/types/treeTypes'
import { useTreeList } from './useTreeList'

import { assetsFilteredAtom, locationsFilteredAtom } from '@/store/store'
import { useAtom } from 'jotai'
import { RenderTree } from './RenderTree'

export const TreeList2 = () => {
  console.time('begin tree2')

  const [locationsFiltered] = useAtom(locationsFilteredAtom)
  const [assetsFiltered] = useAtom(assetsFilteredAtom)

  const { isolatedAssets, locations: treeLocations } = useTreeList({
    assets: assetsFiltered,
    locations: locationsFiltered
  })

  const renderAsset = useCallback((asset: Asset) => {
    return (
      <div
        className={asset.sensorType ? 'flex gap-2 ml-8' : 'flex gap-2 ml-4'}
        key={asset.id}
      >
        <Image
          alt={asset.sensorType ? 'component' : 'asset'}
          height={22}
          src={asset.sensorType ? ComponentImg : AssetImg}
          width={22}
        />
        <h3 className="flex gap-2">
          {asset.name}
          {asset.status &&
            (asset.status === 'alert' ? (
              <Image alt="dot red" height={12} src={DotRed} width={12} />
            ) : (
              <Image alt="dot green" height={12} src={DotGreen} width={12} />
            ))}
          {asset.sensorType && asset.sensorType === 'energy' && (
            <Image alt="energy" height={12} src={Energy} width={12} />
          )}
        </h3>
      </div>
    )
  }, [])

  const renderAssets = useCallback(
    (assets: Asset[]) => {
      return (
        <div>
          {assets.map((asset) => (
            <div className="flex gap-2 ml-4" key={asset.id}>
              {renderAsset(asset)}
            </div>
          ))}
        </div>
      )
    },
    [renderAsset]
  )

  const renderSubAssets = useCallback(
    (assets: SubAsset[]) => {
      return (
        <div>
          {assets.map((asset) => (
            <div className="flex flex-col ml-4" key={asset.subAsset.id}>
              {renderAsset(asset.subAsset)}
              {renderAssets(asset.componentWithAssets)}
            </div>
          ))}
        </div>
      )
    },
    [renderAsset, renderAssets]
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
              {renderAsset(asset.assetWithLocation)}
              {renderSubAssets(asset.subAssets)}
              {renderAssets(asset.componentWithAssets)}
            </div>
          ))}
        </div>
      )
    },
    [renderAsset, renderAssets, renderSubAssets]
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

  console.timeEnd('begin tree2')
  return (
    <div
      className="flex flex-col p-4 gap-4
    rounded min-h-[80dvh] bg-gray-600 w-[40%] md:w-[50dvw] "
    >
      <div className="flex flex-col">
        <RenderTree
          location={treeLocations}
          renderAssets={renderAssets}
          renderAssetsWithLocation={renderAssetsWithLocation}
        />
        <div>
          {isolatedAssets.map((asset) => (
            <div className="flex gap-2 p-2" key={asset.id}>
              {renderAsset(asset)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
