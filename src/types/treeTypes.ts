import { Location } from "./returnApiTypes";
import { Asset } from "./returnApiTypes";

export interface TreeList {
  locations: LocationGroup[];
  isolatedAssets: Asset[];
}

export interface LocationGroup {
  location: Location;
  sublocations: LocationGroup[];
  assetsWithLocation: AssetWithLocation[];
  componentWithAssets: Asset[];
}

export interface AssetWithLocation {
  assetWithLocation: Asset;
  subAssets: SubAsset[];
  componentWithAssets: Asset[];
}

export interface SubAsset {
  subAsset: Asset;
  componentWithAssets: Asset[];
}
