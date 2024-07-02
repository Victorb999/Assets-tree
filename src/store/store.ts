import { Asset, Location } from './../types/returnApiTypes'
import { atom } from 'jotai'

export const filterByCriticalAtom = atom(false)
export const filterByEnergyAtom = atom(false)

export const loadingTreeAtom = atom(true)

export const assetsFilteredAtom = atom<Asset[]>([])
export const locationsFilteredAtom = atom<Location[]>([])

export const assetSelectedAtom = atom<Asset | null>(null)
