"use client";
import { useCallback, useMemo } from "react";
import { Asset, Location } from "@/types/returnApiTypes";
import { TreeList } from "@/types/treeTypes";

interface TreeListProps {
  locations: Location[];
  assets: Asset[];
}

export const useTreeList = ({ locations, assets }: TreeListProps) => {
  const returnComponentLocation = useCallback(
    (locationId: string) => {
      return assets.filter(
        (asset) => asset.sensorType && asset.locationId === locationId,
      );
    },
    [assets],
  );
  const returnComponentAssets = useCallback(
    (assetId: string) => {
      return assets.filter(
        (asset) => asset.sensorType && asset.parentId === assetId,
      );
    },
    [assets],
  );

  const returnSubAssets = useCallback(
    (assetId: string) => {
      return assets
        .filter((asset) => asset.parentId === assetId && !asset.sensorId)
        .map((asset) => {
          return {
            subAsset: asset,
            componentWithAssets: returnComponentAssets(asset.id),
          };
        });
    },
    [assets, returnComponentAssets],
  );

  const returnLocationAsset = useCallback(
    (idLocation: string) => {
      return assets
        .filter((asset) => asset.locationId === idLocation && !asset.sensorId)
        .map((asset) => {
          return {
            assetWithLocation: asset,
            subAssets: returnSubAssets(asset.id),
            componentWithAssets: returnComponentAssets(asset.id),
          };
        });
    },
    [assets, returnComponentAssets, returnSubAssets],
  );

  const memoizedTree = useMemo(() => {
    const cache: Record<string, JSX.Element> = {};
    const generateTree = (parentId: string | null): any => {
      if (cache[parentId || "root"]) {
        return cache[parentId || "root"];
      }

      const filteredLocations = locations.filter(
        (location) => location.parentId === parentId,
      );

      const result: any = filteredLocations.map((location) => {
        return {
          location: location,
          sublocations: generateTree(location.id),
          assetsWithLocation: returnLocationAsset(location.id),
          componentWithAssets: returnComponentLocation(location.id),
        };
      });

      cache[parentId || "root"] = result;
      return result;
    };

    return generateTree(null);
  }, [locations, returnComponentLocation, returnLocationAsset]);

  const isolatedAssets = useMemo(
    () => assets.filter((asset) => !asset.locationId && !asset.parentId),
    [assets],
  );

  const treeData: TreeList = useMemo(() => {
    return {
      locations: memoizedTree,
      isolatedAssets,
    };
  }, [memoizedTree, isolatedAssets]);

  return treeData;
};
