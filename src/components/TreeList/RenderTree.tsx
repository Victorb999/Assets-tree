import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import LocationImg from '@/assets/icons/location.svg'
import { Asset } from '@/types/returnApiTypes'
import { LocationGroup, AssetWithLocation } from '@/types/treeTypes'

interface RenderTreeProps {
  location: LocationGroup[]
  renderAssets: (assets: Asset[]) => JSX.Element
  renderAssetsWithLocation: (assets: AssetWithLocation[]) => JSX.Element
}

export const RenderTree = ({
  location,
  renderAssets,
  renderAssetsWithLocation
}: RenderTreeProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const memoizedRenderTree = useCallback(
    (location: LocationGroup[]) => {
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
                {memoizedRenderTree(location.sublocations)}
                {renderAssetsWithLocation(location.assetsWithLocation)}
                {renderAssets(location.componentWithAssets)}
              </div>
            </div>
          ))}
        </div>
      )
    },
    [renderAssets, renderAssetsWithLocation]
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Simulate loading delay

    return () => clearTimeout(timeoutId)
  }, [location])

  return isLoading ? (
    <div className="text-center">Loading...</div>
  ) : (
    <div>{memoizedRenderTree(location)}</div>
  )
}
