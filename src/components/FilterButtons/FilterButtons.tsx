'use client'
import { Asset, Location } from '@/types/returnApiTypes'
import { filterByCriticalAtom, filterByEnergyAtom } from '@/store/store'
import { useAtom } from 'jotai'
import Critical from '@/assets/icons/warning.svg'
import Energy from '@/assets/icons/thunder.svg'
import Image from 'next/image'
import useFilterAssets from '@/components/TreeList/useFilterAssets'

interface FilterButtonsProps {
  assets: Asset[]
  locations: Location[]
}

export const FilterButtons = ({ assets, locations }: FilterButtonsProps) => {
  const [filterByEnergy, setFilterByEnergy] = useAtom(filterByEnergyAtom)
  const [filterByCritical, setFilterByCritical] = useAtom(filterByCriticalAtom)

  const {
    filterLocationByCritical,
    filterLocationBySensorType,
    filterLocationOrAssetPerName
  } = useFilterAssets({
    assets,
    locations
  })

  const handleFilterByEnergy = () => {
    setFilterByEnergy(!filterByEnergy)
    filterLocationBySensorType(!filterByEnergy)
  }

  const handleFilterByCritical = () => {
    setFilterByCritical(!filterByCritical)
    filterLocationByCritical(!filterByCritical)
  }

  return (
    <div className="flex gap-2 items-center justify-between border border-gray-700 p-2 rounded">
      <input
        className="p-2 text-gray-900 rounded bg-gray-200 w-[40%] md:w-[50dvw] "
        onChange={(e) => filterLocationOrAssetPerName(e)}
        placeholder="Buscar ativo ou local"
        type="text"
      />

      <div className="flex gap-2">
        <button
          className="flex gap-2 h-10 px-2
       items-center justify-center rounded border 
        border-gray-400"
          onClick={() => handleFilterByEnergy()}
          style={
            filterByEnergy
              ? { backgroundColor: 'rgb(29 78 216)', color: 'white' }
              : {}
          }
          title="energy"
        >
          <Image alt="energy" height={16} src={Energy} width={16} /> Sensor de
          energia
        </button>
        <button
          className="flex gap-2 h-10 px-2
      items-center justify-center rounded border 
       border-gray-400"
          onClick={() => handleFilterByCritical()}
          style={
            filterByCritical
              ? { backgroundColor: 'rgb(29 78 216)', color: 'white' }
              : {}
          }
          title="critical"
        >
          <Image
            alt="critical"
            height={16}
            src={Critical}
            style={filterByCritical ? { fill: '#fff' } : {}}
            width={16}
          />
          Critico
        </button>
      </div>
    </div>
  )
}
