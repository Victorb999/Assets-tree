import { Asset } from "./returnApiTypes";
import { Location } from "./returnApiTypes";

export interface TreeList {
  isolatedAssets: Asset[];
  locations: LocationGroup[];
}

export interface LocationGroup {
  assetsWithLocation: AssetWithLocation[];
  componentWithAssets: Asset[];
  location: Location;
  sublocations: LocationGroup[];
}

export interface AssetWithLocation {
  assetWithLocation: Asset;
  componentWithAssets: Asset[];
  subAssets: SubAsset[];
}

export interface SubAsset {
  componentWithAssets: Asset[];
  subAsset: Asset;
}
