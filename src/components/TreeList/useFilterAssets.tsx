import { Asset, Location } from '@/types/returnApiTypes'
import { ChangeEvent, useCallback, useEffect } from 'react'
import {
  assetsFilteredAtom,
  filterByCriticalAtom,
  filterByEnergyAtom,
  locationsFilteredAtom
} from '@/store/store'
import { useAtom } from 'jotai'

interface FilterProps {
  assets: Asset[]
  locations: Location[]
}

const useFilterAssets = ({ assets, locations }: FilterProps) => {
  /* const [locationsFiltered, setLocationsFiltered] =
    useState<Location[]>(locations); */
  // const [assetsFiltered, setAssetsFiltered] = useState<Asset[]>(assets);
  const [locationsFiltered, setLocationsFiltered] = useAtom(
    locationsFilteredAtom
  )
  const [assetsFiltered, setAssetsFiltered] = useAtom(assetsFilteredAtom)

  useEffect(() => {
    setAssetsFiltered(assets)
    setLocationsFiltered(locations)
  }, [assets, locations, setAssetsFiltered, setLocationsFiltered])

  useEffect(() => {
    console.log('aqui', assetsFiltered)
  }, [assetsFiltered, locationsFiltered])

  const [filterByCritical, setFilterByCritical] = useAtom(filterByCriticalAtom)
  const [filterByEnergy, setFilterByEnergy] = useAtom(filterByEnergyAtom)

  const filterAssets = (value: string) => {
    const lowerCaseValue = value.toLowerCase()
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(lowerCaseValue)
    )
  }

  const filterLocations = (value: string) => {
    const lowerCaseValue = value.toLowerCase()
    return locations.filter((location) =>
      location.name.toLowerCase().includes(lowerCaseValue)
    )
  }

  const collectRelatedIds = useCallback(
    (
      filteredAssets: Asset[],
      filteredLocations: Location[],
      idsToShow: Set<string>
    ) => {
      filteredAssets.forEach((asset) => {
        idsToShow.add(asset.id)
        if (asset.parentId) idsToShow.add(asset.parentId)
        if (asset.locationId) idsToShow.add(asset.locationId)
      })

      filteredLocations.forEach((location) => {
        idsToShow.add(location.id)
        if (location.parentId) idsToShow.add(location.parentId)
      })
    },
    []
  )

  const findParentsAssets = useCallback(
    (idsToShow: Set<string>) => {
      let foundNewIds = false

      assets.forEach((asset) => {
        if (
          idsToShow.has(asset.id) ||
          idsToShow.has(asset.parentId || '') ||
          idsToShow.has(asset.locationId || '')
        ) {
          if (!idsToShow.has(asset.id)) {
            idsToShow.add(asset.id)
            foundNewIds = true
          }
          if (asset.parentId && !idsToShow.has(asset.parentId)) {
            idsToShow.add(asset.parentId)
            foundNewIds = true
          }
          if (asset.locationId && !idsToShow.has(asset.locationId)) {
            idsToShow.add(asset.locationId)
            foundNewIds = true
          }
        }
      })

      locations.forEach((location) => {
        if (
          idsToShow.has(location.id) ||
          idsToShow.has(location.parentId || '')
        ) {
          if (!idsToShow.has(location.id)) {
            idsToShow.add(location.id)
            foundNewIds = true
          }
          if (location.parentId && !idsToShow.has(location.parentId)) {
            idsToShow.add(location.parentId)
            foundNewIds = true
          }
        }
      })

      return foundNewIds
    },
    [assets, locations]
  )

  const findParentsAssetsButNotBrothers = useCallback(
    (idsToShow: Set<string>) => {
      let foundNewIds = false

      assets.forEach((asset) => {
        if (idsToShow.has(asset.id)) {
          if (!idsToShow.has(asset.id)) {
            idsToShow.add(asset.id)
            foundNewIds = true
          }
          if (asset.parentId && !idsToShow.has(asset.parentId)) {
            idsToShow.add(asset.parentId)
            foundNewIds = true
          }
          if (asset.locationId && !idsToShow.has(asset.locationId)) {
            idsToShow.add(asset.locationId)
            foundNewIds = true
          }
        }
      })

      locations.forEach((location) => {
        if (idsToShow.has(location.id)) {
          if (!idsToShow.has(location.id)) {
            idsToShow.add(location.id)
            foundNewIds = true
          }
          if (location.parentId && !idsToShow.has(location.parentId)) {
            idsToShow.add(location.parentId)
            foundNewIds = true
          }
        }
      })

      return foundNewIds
    },
    [assets, locations]
  )

  const filterLocationOrAssetPerName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (value.length > 3) {
        const filteredAssets = filterAssets(value)
        const filteredLocations = filterLocations(value)

        const idsToShow = new Set<string>()
        collectRelatedIds(filteredAssets, filteredLocations, idsToShow)

        let foundNewIds
        do {
          foundNewIds = findParentsAssets(idsToShow)
        } while (foundNewIds)

        const finalFilteredAssets = assets.filter((asset) =>
          idsToShow.has(asset.id)
        )
        const finalFilteredLocations = locations.filter((location) =>
          idsToShow.has(location.id)
        )

        setAssetsFiltered(finalFilteredAssets)
        setLocationsFiltered(finalFilteredLocations)
      } else {
        setAssetsFiltered(assets)
        setLocationsFiltered(locations)
      }
    },
    [
      assets,
      collectRelatedIds,
      filterAssets,
      filterLocations,
      findParentsAssets,
      locations,
      setAssetsFiltered,
      setLocationsFiltered
    ]
  )

  const filterLocationBySensorType = useCallback(
    (filterByEnergy: boolean) => {
      if (filterByEnergy) {
        const idsToShow = new Set<string>()
        const filteredAssets = assetsFiltered.filter(
          (asset) => asset.sensorType === `energy`
        )
        collectRelatedIds(filteredAssets, [], idsToShow)

        let foundNewIds
        do {
          foundNewIds = findParentsAssetsButNotBrothers(idsToShow)
        } while (foundNewIds)

        const finalFilteredAssets = assets.filter((asset) =>
          idsToShow.has(asset.id)
        )
        const finalFilteredLocations = locations.filter((location) =>
          idsToShow.has(location.id)
        )

        setAssetsFiltered(finalFilteredAssets)
        setLocationsFiltered(finalFilteredLocations)
      } else {
        setFilterByCritical(false)
        setAssetsFiltered(assets)
        setLocationsFiltered(locations)
      }
    },
    [
      assetsFiltered,
      collectRelatedIds,
      assets,
      locations,
      setAssetsFiltered,
      setLocationsFiltered,
      findParentsAssetsButNotBrothers,
      setFilterByCritical
    ]
  )

  const filterLocationByCritical = useCallback(
    (filterByCritical: boolean) => {
      if (filterByCritical) {
        const idsToShow = new Set<string>()
        const filteredAssets = assetsFiltered.filter(
          (asset) => asset.status === `alert`
        )
        collectRelatedIds(filteredAssets, [], idsToShow)

        let foundNewIds
        do {
          foundNewIds = findParentsAssetsButNotBrothers(idsToShow)
        } while (foundNewIds)

        const finalFilteredAssets = assets.filter((asset) =>
          idsToShow.has(asset.id)
        )
        const finalFilteredLocations = locations.filter((location) =>
          idsToShow.has(location.id)
        )

        setAssetsFiltered(finalFilteredAssets)
        setLocationsFiltered(finalFilteredLocations)
        // TODO : improve this code
      } else {
        setFilterByEnergy(false)
        setAssetsFiltered(assets)
        setLocationsFiltered(locations)
      }
    },
    [
      assetsFiltered,
      collectRelatedIds,
      assets,
      locations,
      setAssetsFiltered,
      setLocationsFiltered,
      findParentsAssetsButNotBrothers,
      setFilterByEnergy
    ]
  )

  return {
    assetsFiltered,
    filterLocationByCritical,
    filterLocationBySensorType,
    filterLocationOrAssetPerName,
    locationsFiltered
  }
}

export default useFilterAssets
