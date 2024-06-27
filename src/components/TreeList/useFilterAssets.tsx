import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Asset, Location } from "@/types/returnApiTypes";
import {
  assetsFilteredAtom,
  filterByCriticalAtom,
  filterByEnergyAtom,
  locationsFilteredAtom,
} from "@/store/store";
import { useAtom } from "jotai";

interface FilterProps {
  locations: Location[];
  assets: Asset[];
}

const useFilterAssets = ({ locations, assets }: FilterProps) => {
  /* const [locationsFiltered, setLocationsFiltered] =
    useState<Location[]>(locations); */
  // const [assetsFiltered, setAssetsFiltered] = useState<Asset[]>(assets);
  const [locationsFiltered, setLocationsFiltered] = useAtom(
    locationsFilteredAtom
  );
  const [assetsFiltered, setAssetsFiltered] = useAtom(assetsFilteredAtom);

  useEffect(() => {
    setAssetsFiltered(assets);
    setLocationsFiltered(locations);
  }, [assets, locations, setAssetsFiltered, setLocationsFiltered]);

  const [filterByCritical] = useAtom(filterByCriticalAtom);
  const [filterByEnergy] = useAtom(filterByEnergyAtom);

  useEffect(() => {
    /*if (filterByCritical) {
      setAssetsFiltered((prev) =>
        prev.filter((asset) => asset.status === `alert`)
      );
    } else if (filterByEnergy) {
      setAssetsFiltered((prev) =>
        prev.filter((asset) => asset.sensorType === `energy`)
      );
    }*/
    //filterLocationBySensorType();
    // TODO resolve this to work properly
  }, [filterByCritical, filterByEnergy, setAssetsFiltered]);

  const filterAssets = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(lowerCaseValue)
    );
  };

  const filterLocations = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    return locations.filter((location) =>
      location.name.toLowerCase().includes(lowerCaseValue)
    );
  };

  const collectRelatedIds = useCallback(
    (
      filteredAssets: Asset[],
      filteredLocations: Location[],
      idsToShow: Set<string>
    ) => {
      filteredAssets.forEach((asset) => {
        idsToShow.add(asset.id);
        if (asset.parentId) idsToShow.add(asset.parentId);
        if (asset.locationId) idsToShow.add(asset.locationId);
      });

      filteredLocations.forEach((location) => {
        idsToShow.add(location.id);
        if (location.parentId) idsToShow.add(location.parentId);
      });
    },
    []
  );

  const findParentsAssets = useCallback(
    (idsToShow: Set<string>) => {
      let foundNewIds = false;

      assets.forEach((asset) => {
        if (
          idsToShow.has(asset.id) ||
          idsToShow.has(asset.parentId || "") ||
          idsToShow.has(asset.locationId || "")
        ) {
          if (!idsToShow.has(asset.id)) {
            idsToShow.add(asset.id);
            foundNewIds = true;
          }
          if (asset.parentId && !idsToShow.has(asset.parentId)) {
            idsToShow.add(asset.parentId);
            foundNewIds = true;
          }
          if (asset.locationId && !idsToShow.has(asset.locationId)) {
            idsToShow.add(asset.locationId);
            foundNewIds = true;
          }
        }
      });

      locations.forEach((location) => {
        if (
          idsToShow.has(location.id) ||
          idsToShow.has(location.parentId || "")
        ) {
          if (!idsToShow.has(location.id)) {
            idsToShow.add(location.id);
            foundNewIds = true;
          }
          if (location.parentId && !idsToShow.has(location.parentId)) {
            idsToShow.add(location.parentId);
            foundNewIds = true;
          }
        }
      });

      return foundNewIds;
    },
    [assets, locations]
  );

  const filterLocationsAndAssets = useCallback(
    (filteredAssets: Asset[], filteredLocations: Location[]) => {
      const idsToShow = new Set<string>();
      collectRelatedIds(filteredAssets, filteredLocations, idsToShow);

      let foundNewIds;
      do {
        foundNewIds = findParentsAssets(idsToShow);
      } while (foundNewIds);

      const finalFilteredAssets = assets.filter((asset) =>
        idsToShow.has(asset.id)
      );
      const finalFilteredLocations = locations.filter((location) =>
        idsToShow.has(location.id)
      );

      setAssetsFiltered(finalFilteredAssets);
      setLocationsFiltered(finalFilteredLocations);
    },
    [
      assets,
      collectRelatedIds,
      findParentsAssets,
      locations,
      setAssetsFiltered,
      setLocationsFiltered,
    ]
  );

  const filterLocationOrAssetPerName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value.length > 3) {
        const filteredAssets = filterAssets(value);
        const filteredLocations = filterLocations(value);

        filterLocationsAndAssets(filteredAssets, filteredLocations);
      } else {
        setAssetsFiltered(assets);
        setLocationsFiltered(locations);
      }
    },
    []
  );

  const filterLocationBySensorType = useCallback(
    (filterByEnergy: boolean) => {
      if (filterByEnergy) {
        const idsToShow = new Set<string>();
        const filteredAssets = assets.filter(
          (asset) => asset.sensorType === `energy`
        );
        collectRelatedIds(filteredAssets, [], idsToShow);

        const finalFilteredAssets = assets.filter((asset) =>
          idsToShow.has(asset.id)
        );
        collectRelatedIds(finalFilteredAssets, [], idsToShow);

        const filteredLocations = locations.filter((location) =>
          idsToShow.has(location.id)
        );
        collectRelatedIds([], filteredLocations, idsToShow);

        const finalFilteredLocations = locations.filter((location) =>
          idsToShow.has(location.id)
        );

        setAssetsFiltered(finalFilteredAssets);
        setLocationsFiltered(finalFilteredLocations);
      } else {
        setAssetsFiltered(assets);
        setLocationsFiltered(locations);
      }
    },
    [setAssetsFiltered]
  );

  const filterLocationByCritical = useCallback(
    (filterByCritical: boolean) => {
      if (filterByCritical) {
        const idsToShow = new Set<string>();
        const filteredAssets = assets.filter(
          (asset) => asset.status === `alert`
        );
        collectRelatedIds(filteredAssets, [], idsToShow);

        const finalFilteredAssets = assets.filter((asset) =>
          idsToShow.has(asset.id)
        );
        collectRelatedIds(finalFilteredAssets, [], idsToShow);

        const filteredLocations = locations.filter((location) =>
          idsToShow.has(location.id)
        );
        collectRelatedIds([], filteredLocations, idsToShow);

        const finalFilteredLocations = locations.filter((location) =>
          idsToShow.has(location.id)
        );

        // TODO : improve this code

        setAssetsFiltered(finalFilteredAssets);
        setLocationsFiltered(finalFilteredLocations);
      } else {
        setAssetsFiltered(assets);
        setLocationsFiltered(locations);
      }
    },
    [setAssetsFiltered]
  );

  return {
    locationsFiltered,
    assetsFiltered,
    filterLocationOrAssetPerName,
    filterLocationBySensorType,
    filterLocationByCritical,
  };
};

export default useFilterAssets;
