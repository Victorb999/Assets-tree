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

  const filterAssets = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(lowerCaseValue),
    );
  };

  const collectRelatedIds = (
    filteredAssets: Asset[],
    idsToShow: Set<string>,
    locationsIdsToShow: Set<string>,
  ) => {
    filteredAssets.forEach((asset) => {
      idsToShow.add(asset.id);
      if (asset.parentId) {
        idsToShow.add(asset.parentId);
      }
      if (asset.locationId) {
        locationsIdsToShow.add(asset.locationId);
      }
    });
  };

  const filterLocationOrAsset = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 3) {
      const assetIdsToShow = new Set<string>();
      const locationIdsToShow = new Set<string>();

      // Filtra os assets que correspondem ao valor da pesquisa
      const filteredAssets = filterAssets(value);
      collectRelatedIds(filteredAssets, assetIdsToShow, locationIdsToShow);

      // Filtra os assets relacionados
      const relatedAssets = assets.filter((asset) =>
        assetIdsToShow.has(asset.id),
      );
      collectRelatedIds(relatedAssets, assetIdsToShow, locationIdsToShow);

      // Filtra as localizações relacionadas
      const relatedLocations = locations.filter((location) =>
        locationIdsToShow.has(location.id),
      );
      relatedLocations.forEach((location) => {
        if (location.parentId) {
          locationIdsToShow.add(location.parentId);
        }
      });

      // Atualiza os estados de filtragem
      setAssetsFiltered(relatedAssets);
      setLocationsFiltered(
        locations.filter((location) => locationIdsToShow.has(location.id)),
      );
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
