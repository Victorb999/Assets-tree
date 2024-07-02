'use client'
import { assetSelectedAtom } from '@/store/store'
import { useAtom } from 'jotai'

import DefaultImg from '@/assets/img/default-img.svg'
import DotGreen from '@/assets/icons/dot-green-mini.svg'
import DotRed from '@/assets/icons/dot-red-mini.svg'
import Energy from '@/assets/icons/thunder-mini.svg'
import Image from 'next/image'
import Receptor from '@/assets/icons/router.svg'
import Sensor from '@/assets/icons/sensor.svg'

export const AssetDetails = () => {
  const [assetSelected] = useAtom(assetSelectedAtom)

  if (!assetSelected) return <></>
  return (
    <section
      className="flex flex-col p-4 gap-4
    rounded min-h-[80dvh] w-[40%] md:w-[50dvw] border border-gray-700"
    >
      <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
        <h1 className="text-2xl">{assetSelected.name}</h1>
        {assetSelected.status === 'alert' ? (
          <Image alt="dot red" height={12} src={DotRed} width={12} />
        ) : (
          <Image alt="dot green" height={12} src={DotGreen} width={12} />
        )}
        {assetSelected.sensorType && assetSelected.sensorType === 'energy' && (
          <Image alt="energy" height={12} src={Energy} width={12} />
        )}
      </div>
      <div className="flex flex-col gap-4  xl:flex-row ">
        <Image alt="default img" height={226} src={DefaultImg} width={336} />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold">Sensor</h2>
            <div className="border-b border-gray-700 pb-2">
              <Image alt="" height={22} src={Sensor} width={22} />
              <span className="text-gray-500">{assetSelected.sensorId}</span>
            </div>
          </div>
          <div>
            <h2 className="font-bold">Receptor</h2>
            <div className="flex gap-4">
              <Image alt="" height={22} src={Receptor} width={22} />
              <span className="text-gray-500">{assetSelected.gatewayId}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
