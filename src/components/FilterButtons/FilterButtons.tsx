"use client";
import Energy from "@/assets/icons/thunder.svg";
import Critical from "@/assets/icons/warning.svg";
import { filterByCriticalAtom, filterByEnergyAtom } from "@/store/store";
import { useAtom } from "jotai";
import Image from "next/image";

export const FilterButtons = () => {
  const [filterByEnergy, setFilterByEnergy] = useAtom(filterByEnergyAtom);
  const [filterByCritical, setFilterByCritical] = useAtom(filterByCriticalAtom);

  return (
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
        onClick={() => setFilterByEnergy(!filterByEnergy)}
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
        onClick={() => setFilterByCritical(!filterByCritical)}
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
  );
};
