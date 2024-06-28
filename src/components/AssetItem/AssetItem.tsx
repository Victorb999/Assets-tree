'use client'
import { Asset } from '@/types/returnApiTypes'
import { useMemo } from 'react'

import ComponentImg from '@/assets/icons/cube.svg'
import AssetImg from '@/assets/icons/box.png'
import AssetSelectedImg from '@/assets/icons/box-white.png'
import DotGreen from '@/assets/icons/dot-green-mini.svg'
import DotRed from '@/assets/icons/dot-red-mini.svg'
import Energy from '@/assets/icons/thunder-mini.svg'
import Image from 'next/image'
import { assetSelectedAtom } from '@/store/store'
import { useAtom } from 'jotai'

interface AssetItemProps {
  asset: Asset
}
export const AssetItem = ({ asset }: AssetItemProps) => {
  const [assetSelected, setAssetSelected] = useAtom(assetSelectedAtom)
  const handleSelectedAsset = () => {
    if (asset.sensorType) {
      if (asset.id === assetSelected?.id) {
        setAssetSelected(null)
      } else setAssetSelected(asset)
    }
  }

  const renderAsset = useMemo(() => {
    const classNameAsset =
      !asset.locationId && !asset.parentId
        ? 'cursor-default'
        : asset.sensorType
        ? 'ml-8 cursor-pointer hover:bg-gray-500'
        : 'ml-4 cursor-default'

    const classeAssetSelected =
      asset.id === assetSelected?.id ? 'bg-blue-500 text-white svgSelected' : ''

    return (
      <div
        className={`${classNameAsset} flex gap-2 rounded 
        p-1 ${classeAssetSelected}`}
        key={asset.id}
        onClick={() => handleSelectedAsset()}
      >
        <Image
          alt={asset.sensorType ? 'asset' : 'component'}
          height={22}
          src={
            asset.sensorType
              ? asset.id === assetSelected?.id
                ? AssetSelectedImg
                : AssetImg
              : ComponentImg
          }
          width={22}
        />
        <h3 className="flex gap-2">
          {asset.name}
          {asset.status &&
            (asset.status === 'alert' ? (
              <Image alt="dot red" height={12} src={DotRed} width={12} />
            ) : (
              <Image alt="dot green" height={12} src={DotGreen} width={12} />
            ))}
          {asset.sensorType && asset.sensorType === 'energy' && (
            <Image alt="energy" height={12} src={Energy} width={12} />
          )}
        </h3>
      </div>
    )
  }, [assetSelected])

  return <>{renderAsset}</>
}
