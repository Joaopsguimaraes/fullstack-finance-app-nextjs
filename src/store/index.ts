import { create } from 'zustand'
import { transactionsSlice } from './transactions-store'
import { createSelectors } from './create-selectors'
import type { StoreType } from '@/@types/store-type'

const useRootStore = create<StoreType>()((...args) => ({
  ...transactionsSlice(...args),
}))

const useStore = createSelectors(useRootStore)

export { useStore }
