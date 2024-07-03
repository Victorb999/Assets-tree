'use client'
import { Asset, Location } from '@/types/returnApiTypes'
import { LocationGroup, TreeList } from '@/types/treeTypes'
import { useCallback, useMemo } from 'react'

interface TreeListProps {
  assets: Asset[]
  locations: Location[]
}

export const useTreeList = ({ assets, locations }: TreeListProps) => {
  const returnComponentLocation = useCallback(
    (locationId: string) => {
      return assets.filter(
        (asset) => asset.sensorType && asset.locationId === locationId
      )
    },
    [assets]
  )
  const returnComponentAssets = useCallback(
    (assetId: string) => {
      return assets.filter(
        (asset) => asset.sensorType && asset.parentId === assetId
      )
    },
    [assets]
  )

  const returnSubAssets = useCallback(
    (assetId: string) => {
      return assets
        .filter((asset) => asset.parentId === assetId && !asset.sensorId)
        .map((asset) => {
          return {
            componentWithAssets: returnComponentAssets(asset.id),
            subAsset: asset
          }
        })
    },
    [assets, returnComponentAssets]
  )

  const returnLocationAsset = useCallback(
    (idLocation: string) => {
      return assets
        .filter((asset) => asset.locationId === idLocation && !asset.sensorId)
        .map((asset) => {
          return {
            assetWithLocation: asset,
            componentWithAssets: returnComponentAssets(asset.id),
            subAssets: returnSubAssets(asset.id)
          }
        })
    },
    [assets, returnComponentAssets, returnSubAssets]
  )

  const memoizedTree = useMemo(() => {
    const cache: Record<string, LocationGroup[]> = {}
    const generateTree = (parentId: string | null): any => {
      if (cache[parentId || 'root']) {
        return cache[parentId || 'root']
      }

      const filteredLocations = locations.filter(
        (location) => location.parentId === parentId
      )

      const result: LocationGroup[] = filteredLocations.map((location) => {
        return {
          assetsWithLocation: returnLocationAsset(location.id),
          componentWithAssets: returnComponentLocation(location.id),
          location: location,
          sublocations: generateTree(location.id)
        }
      })

      cache[parentId || 'root'] = result
      return result
    }

    return generateTree(null)
  }, [locations, returnComponentLocation, returnLocationAsset])

  const isolatedAssets = useMemo(
    () => assets.filter((asset) => !asset.locationId && !asset.parentId),
    [assets]
  )

  const treeData: TreeList = useMemo(() => {
    return {
      isolatedAssets,
      locations: memoizedTree
    }
  }, [memoizedTree, isolatedAssets])

  return treeData
}
