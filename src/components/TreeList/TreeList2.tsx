"use client";
import { useCallback } from "react";
import Image from "next/image";
import LocationImg from "@/assets/icons/location.svg";
import ComponentImg from "@/assets/icons/box.svg";
import AssetImg from "@/assets/icons/cube.svg";
import { useTreeList } from "./useTreeList";
import { Asset, Location } from "@/types/returnApiTypes";
import { LocationGroup, AssetWithLocation, SubAsset } from "@/types/treeTypes";
import useFilterAssets from "./useFilterAssets";

interface TreeListProps {
  locations: Location[];
  assets: Asset[];
}

export const TreeList2 = ({ locations, assets }: TreeListProps) => {
  console.time("begin tree2");
  const { locationsFiltered, assetsFiltered, filterLocationOrAsset } =
    useFilterAssets({ locations, assets });

  const { locations: treeLocations, isolatedAssets } = useTreeList({
    locations: locationsFiltered,
    assets: assetsFiltered,
  });

  const renderAsset = useCallback((asset: Asset) => {
    return (
      <div
        key={asset.id}
        className={asset.sensorType ? "flex gap-2 ml-8" : "flex gap-2 ml-4"}
      >
        <Image
          src={asset.sensorType ? ComponentImg : AssetImg}
          width={22}
          height={22}
          alt={asset.sensorType ? "component" : "asset"}
        />
        <h3>{asset.name}</h3>
      </div>
    );
  }, []);

  const renderAssets = useCallback(
    (assets: Asset[]) => {
      return (
        <div>
          {assets.map((asset) => (
            <div key={asset.id} className="flex gap-2 ml-4">
              {renderAsset(asset)}
            </div>
          ))}
        </div>
      );
    },
    [renderAsset]
  );

  const renderSubAssets = useCallback(
    (assets: SubAsset[]) => {
      return (
        <div>
          {assets.map((asset) => (
            <div key={asset.subAsset.id} className="flex flex-col ml-4">
              {renderAsset(asset.subAsset)}
              {renderAssets(asset.componentWithAssets)}
            </div>
          ))}
        </div>
      );
    },
    [renderAsset, renderAssets]
  );

  const renderAssetsWithLocation = useCallback(
    (assets: AssetWithLocation[]) => {
      return (
        <div>
          {assets.map((asset) => (
            <div
              key={asset.assetWithLocation.id}
              className="flex flex-col ml-4"
            >
              {renderAsset(asset.assetWithLocation)}
              {renderSubAssets(asset.subAssets)}
              {renderAssets(asset.componentWithAssets)}
            </div>
          ))}
        </div>
      );
    },
    [renderAsset, renderAssets, renderSubAssets]
  );

  const renderTree = useCallback(
    (location: LocationGroup[]) => {
      return (
        <div>
          {location.map((location) => (
            <div key={location.location.id}>
              <div className="flex flex-col ml-2">
                <div className="flex gap-2 ">
                  <Image
                    src={LocationImg}
                    width={22}
                    height={22}
                    alt="location"
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
      );
    },
    [renderAssets, renderAssetsWithLocation]
  );
  console.timeEnd("begin tree2");
  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Buscar ativo ou local"
        className="w-[25%] md:w-[40dvw] text-gray-900"
        onChange={(e) => filterLocationOrAsset(e)}
      />
      <div className="p-4 rounded h-min-[80dvh] bg-gray-200 w-[25%] md:w-[40dvw] ">
        {renderTree(treeLocations)}
        <div>
          {isolatedAssets.map((asset) => (
            <div key={asset.id} className="flex gap-2 p-2">
              {renderAsset(asset)}
            </div>
          ))}
        </div>
        <pre>{/*JSON.stringify(treeList, null, 2)*/}</pre>
      </div>
    </div>
  );
};
