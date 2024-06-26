import { ChangeEvent, useCallback, useState } from "react";
import { Asset, Location } from "@/types/returnApiTypes";

interface FilterProps {
  locations: Location[];
  assets: Asset[];
}

const useFilterAssets = ({ locations, assets }: FilterProps) => {
  const [locationsFiltered, setLocationsFiltered] =
    useState<Location[]>(locations);
  const [assetsFiltered, setAssetsFiltered] = useState<Asset[]>(assets);

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

  const findParentsAssets = useCallback(
    (assets: Asset[], locations: Location[], idsToShow: Set<string>) => {
      assets.forEach((asset) => {
        if (
          idsToShow.has(asset.id) ||
          idsToShow.has(asset?.parentId ?? "") ||
          idsToShow.has(asset?.locationId ?? "")
        ) {
          idsToShow.add(asset.id);
          if (asset.parentId) {
            idsToShow.add(asset.parentId);
          }
          if (asset.locationId) {
            idsToShow.add(asset.locationId);
          }
        }
      });

      locations.forEach((location) => {
        if (
          idsToShow.has(location.id) ||
          idsToShow.has(location?.parentId ?? "")
        ) {
          idsToShow.add(location.id);
          if (location.parentId) {
            idsToShow.add(location.parentId);
          }
        }
      });
    },
    []
  );

  const collectRelatedIds = (
    filteredAsset: Asset[],
    filteredLocation: Location[],
    idsToShow: Set<string>
  ) => {
    filteredAsset.forEach((asset: any) => {
      idsToShow.add(asset.id);
      if (asset.parentId) {
        idsToShow.add(asset.parentId);
      }
      if (asset.locationId) {
        idsToShow.add(asset.locationId);
      }
    });

    filteredLocation.forEach((location: Location) => {
      idsToShow.add(location.id);
      if (location.parentId) {
        idsToShow.add(location.parentId);
      }
    });
  };

  const filterLocationOrAsset = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 3) {
      const assestsFound = filterAssets(value);

      console.log("assestsFound", assestsFound);

      const locationsFound = filterLocations(value);
      console.log("locationsFound", locationsFound);

      const idsToShow = new Set<string>();

      collectRelatedIds(assestsFound, locationsFound, idsToShow);

      console.log("idsToShow", idsToShow);

      // location, asset, component
      for (let index = 0; index < 3; index++) {
        findParentsAssets(assets, locations, idsToShow);
      }

      console.log("idsToShow3", idsToShow);

      const filteredAssets = assets.filter((asset) => idsToShow.has(asset.id));
      const filteredLocations = locations.filter((location) =>
        idsToShow.has(location.id)
      );
      setAssetsFiltered(filteredAssets);
      setLocationsFiltered(filteredLocations);
    } else {
      setAssetsFiltered(assets);
      setLocationsFiltered(locations);
    }
  };

  return {
    locationsFiltered,
    assetsFiltered,
    filterLocationOrAsset,
  };
};

export default useFilterAssets;
