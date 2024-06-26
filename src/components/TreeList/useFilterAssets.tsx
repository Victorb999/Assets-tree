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
      /* 
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
      }) */
    },
    []
  );

  const findParentsLocations = useCallback(
    (locations: Location[], idsToShow: Set<string>) => {
      idsToShow.forEach((id) => {
        const obj = locations.find(
          (obj: Location) => obj.id === id || obj.parentId === id
        );

        if (obj?.parentId) {
          idsToShow.add(obj.parentId);
        }
        const objSon = assets.find((obj: Location) => obj.parentId === id);

        obj && idsToShow.add(obj?.id);
        if (objSon) {
          idsToShow.add(objSon.id);
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
      const assestsFound = assets.filter((asset) =>
        asset.name.toLowerCase().includes(value.toLowerCase())
      );

      console.log("assestsFound", assestsFound);

      const locationsFound = locations.filter((location) =>
        location.name.toLowerCase().includes(value.toLowerCase())
      );
      console.log("locationsFound", locationsFound);

      const idsToShow = new Set<string>();

      collectRelatedIds(assestsFound, locationsFound, idsToShow);

      console.log("idsToShow", idsToShow);

      findParentsAssets(assets, idsToShow);
      findParentsLocations(locations, idsToShow);

      console.log("locationIdsToShow2", idsToShow);

      const filteredAssets = assets.filter((asset) => idsToShow.has(asset.id));
      const filteredLocations = locations.filter((location) =>
        idsToShow.has(location.id)
      );
      setAssetsFiltered(filteredAssets);
      setLocationsFiltered(filteredLocations);

      /**
       * TODO
       * buscar TODOS filhos das locais e colocar na lista de locais
       * buscar TODOS filhos dos assets e colocar na lista de assets
       */
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
