"use client";
import Energy from "@/assets/icons/thunder.svg";
import Critical from "@/assets/icons/warning.svg";
import { filterByCriticalAtom, filterByEnergyAtom } from "@/store/store";
import { useAtom } from "jotai";
import Image from "next/image";
import { Asset, Location } from "@/types/returnApiTypes";
import useFilterAssets from "@/components/TreeList/useFilterAssets";

interface FilterButtonsProps {
  locations: Location[];
  assets: Asset[];
}

export const FilterButtons = ({ locations, assets }: FilterButtonsProps) => {
  const [filterByEnergy, setFilterByEnergy] = useAtom(filterByEnergyAtom);
  const [filterByCritical, setFilterByCritical] = useAtom(filterByCriticalAtom);

  const {
    filterLocationOrAssetPerName,
    filterLocationBySensorType,
    filterLocationByCritical,
  } = useFilterAssets({
    locations,
    assets,
  });

  const handleFilterByEnergy = () => {
    setFilterByEnergy(!filterByEnergy);
    filterLocationBySensorType(!filterByEnergy);
  };

  const handleFilterByCritical = () => {
    setFilterByCritical(!filterByCritical);
    filterLocationByCritical(!filterByCritical);
  };

  return (
    <div className="flex gap-2 items-center justify-between">
      <input
        type="text"
        placeholder="Buscar ativo ou local"
        className="p-2 w-full text-gray-900 rounded bg-gray-200 w-[40%] md:w-[50dvw] "
        onChange={(e) => filterLocationOrAssetPerName(e)}
      />

      <div className="flex gap-2">
        <button
          className="flex gap-2 h-10 px-2
       items-center justify-center rounded border 
        border-gray-400"
          title="energy"
          style={
            filterByEnergy
              ? { backgroundColor: "rgb(29 78 216)", color: "white" }
              : {}
          }
          onClick={() => handleFilterByEnergy()}
        >
          <Image src={Energy} alt="energy" width={16} height={16} /> Sensor de
          energia
        </button>
        <button
          className="flex gap-2 h-10 px-2
      items-center justify-center rounded border 
       border-gray-400"
          title="critical"
          style={
            filterByCritical
              ? { backgroundColor: "rgb(29 78 216)", color: "white" }
              : {}
          }
          onClick={() => handleFilterByCritical()}
        >
          <Image
            src={Critical}
            alt="critical"
            width={16}
            height={16}
            style={filterByCritical ? { fill: "#fff" } : {}}
          />
          Critico
        </button>
      </div>
    </div>
  );
};
