"use client";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import Image from "next/image";

import LocationImg from "@/assets/icons/location.svg";
import ComponentImg from "@/assets/icons/box.svg";
import AssetImg from "@/assets/icons/cube.svg";
import { Asset, Location } from "@/types/returnApiTypes";

interface TreeListProps {
  locations: Location[];
  assets: Asset[];
}

export const TreeList = ({ locations, assets }: TreeListProps) => {
  const [locationsFiltered, setLocationsFiltered] = useState(locations);
  const [assetsFiltered, setAssetsFiltered] = useState(assets);

  const renderAsset = useCallback((asset: Asset) => {
    return (
      <div key={asset.id}>
        <div className="flex gap-2 pl-4">
          <Image
            src={asset.sensorType ? ComponentImg : AssetImg}
            width={22}
            height={22}
            alt={asset.sensorType ? "component" : "asset"}
          />
          <h3>{asset.name}</h3>
        </div>
      </div>
    );
  }, []);

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
    );
  };

  const returnComponentLocation = useCallback(
    (locationId: string) => {
      return (
        <div>
          {assetsFiltered
            .filter(
              (asset) => asset.sensorType && asset.locationId === locationId,
            )
            .map((asset) => (
              <div key={asset.id}>
                <div className="flex gap-2 ml-8 border-l-2 border-gray-600">
                  {renderAsset(asset)}
                </div>
              </div>
            ))}
        </div>
      );
    },
    [assetsFiltered, renderAsset],
  );

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
      );
    },
    [assetsFiltered, renderAsset],
  );

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
      );
    },
    [assetsFiltered, renderAsset, returnComponentAssets],
  );

  const returnLocationAsset = useCallback(
    (idLocation: string) => {
      return (
        <div>
          {assetsFiltered
            .filter(
              (asset) => asset.locationId === idLocation && !asset.sensorId,
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
      );
    },
    [assetsFiltered, renderAsset, returnSubAssets, returnComponentAssets],
  );

  const memoizedTree = useMemo(() => {
    const cache: Record<string, JSX.Element> = {};
    const generateTree = (parentId: string | null): JSX.Element => {
      if (cache[parentId || "root"]) {
        return cache[parentId || "root"];
      }

      const locationsTree = locationsFiltered.filter(
        (location) => location.parentId === parentId,
      );

      const result = (
        <div>
          {locationsTree.map((location) => (
            <div
              key={location.id}
              className={
                location.parentId
                  ? "p-2 ml-4 border-l-2 border-gray-600"
                  : "pl-2"
              }
            >
              <div className="flex gap-2">
                <Image
                  src={LocationImg}
                  width={22}
                  height={22}
                  alt="location"
                />
                <h3>{location.name}</h3>
              </div>
              {generateTree(location.id)}
              {returnLocationAsset(location.id)}
              {returnComponentLocation(location.id)}
            </div>
          ))}
        </div>
      );

      cache[parentId || "root"] = result;
      return result;
    };

    return generateTree(null);
  }, [returnComponentLocation, returnLocationAsset]);

  const filterLocationOrAsset = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    //const filteredLocations = locations.filter((location) =>
    // location.name.toLowerCase().includes(value.toLowerCase()),
    //);
    if (value.length > 3) {
      const filteredAssets = assets.filter((asset) =>
        asset.name.toLowerCase().includes(value.toLowerCase()),
      );
      console.log(filteredAssets);
      //setLocationsFiltered(filteredLocations);
      setAssetsFiltered(filteredAssets);
    } else {
      setAssetsFiltered(assets);
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Buscar ativo ou local"
        className="w-[25%] md:w-[40dvw] text-gray-900"
        onChange={(e) => filterLocationOrAsset(e)}
      />
      <div className="p-4 rounded min-h-[80dvh] bg-gray-400 w-[25%] md:w-[40dvw]">
        {memoizedTree}
        {returnIsolatedAssets()}
      </div>
    </div>
  );
};
