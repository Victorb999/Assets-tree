import { ChangeEvent, useState } from "react";
import { Asset, Location } from "@/types/returnApiTypes";

interface FilterProps {
  locations: Location[];
  assets: Asset[];
}

const useFilterAssets = ({ locations, assets }: FilterProps) => {
  const [locationsFiltered, setLocationsFiltered] =
    useState<Location[]>(locations);
  const [assetsFiltered, setAssetsFiltered] = useState<Asset[]>(assets);

  const getRelatedIds = (assets: Asset[], idsToShow: Set<string>) => {
    assets.forEach((asset) => {
      idsToShow.add(asset.id);
      if (asset.parentId) {
        idsToShow.add(asset.parentId);
      }
      if (asset.locationId) {
        idsToShow.add(asset.locationId);
      }
    });
  };

  const getRelatedLocationIds = (
    locations: Location[],
    idsToShow: Set<string>,
  ) => {
    locations.forEach((location) => {
      if (location.parentId) {
        idsToShow.add(location.parentId);
      }
    });
  };

  const filterAssets = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(lowerCaseValue),
    );
  };

  const filterLocations = (idsToShow: Set<string>) => {
    return locations.filter((location) => idsToShow.has(location.id));
  };

  const filterLocationOrAsset = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 3) {
      const idsToShow = new Set<string>();

      const filteredAssets = filterAssets(value);
      getRelatedIds(filteredAssets, idsToShow);

      const relatedAssets = assets.filter((asset) => idsToShow.has(asset.id));
      getRelatedIds(relatedAssets, idsToShow);

      const relatedLocations = locations.filter((location) =>
        idsToShow.has(location.id),
      );
      getRelatedLocationIds(relatedLocations, idsToShow);

      const filteredLocationsToShow = filterLocations(idsToShow);
      const finalFilteredLocations = locations.filter((location) =>
        idsToShow.has(location.id),
      );

      setAssetsFiltered(relatedAssets);
      setLocationsFiltered(finalFilteredLocations);

      console.log("filteredAssets", filteredAssets);
      console.log("idsToShow", Array.from(idsToShow));
      console.log("filteredAssetsToShow", relatedAssets);
      console.log("filteredLocationsToShow", filteredLocationsToShow);
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
