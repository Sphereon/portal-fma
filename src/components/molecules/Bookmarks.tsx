import { useUserPreferences } from '../../providers/UserPreferences'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Table from '../atoms/Table'
import { Logger } from '@oceanprotocol/lib'
import Price from '../atoms/Price'
import Tooltip from '../atoms/Tooltip'
import AssetTitle from './AssetListTitle'
import { retrieveDDOListByDIDs } from '../../utils/aquarius'
import { getAssetsBestPrices, AssetListPrices } from '../../utils/subgraph'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { useCancelToken } from '../../hooks/useCancelToken'
import { CancelToken } from 'axios'
import Container from '../atoms/Container'

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: AssetListPrices) {
      const { attributes } = row.ddo.findServiceByType('metadata')
      return <AssetTitle title={attributes.main.name} ddo={row.ddo} />
    },
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Datatoken Symbol',
    selector: function getAssetRow(row: AssetListPrices) {
      return (
        <Tooltip content={row.ddo.dataTokenInfo.name}>
          {row.ddo.dataTokenInfo.symbol}
        </Tooltip>
      )
    },
    maxWidth: '10rem'
  },
  {
    name: 'Price',
    selector: function getAssetRow(row: AssetListPrices) {
      return <Price price={row.price} small />
    },
    right: true
  }
]

export default function Bookmarks(): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { bookmarks } = useUserPreferences()

  const [pinned, setPinned] = useState<AssetListPrices[]>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const { chainIds } = useUserPreferences()
  const newCancelToken = useCancelToken()

  const getAssetsBookmarked = useCallback(
    async (
      bookmarks: string[],
      chainIds: number[],
      cancelToken: CancelToken
    ) => {
      try {
        const result = await retrieveDDOListByDIDs(
          bookmarks,
          chainIds,
          cancelToken
        )
        return result
      } catch (error) {
        Logger.error(error.message)
      }
    },
    []
  )

  useEffect(() => {
    if (!appConfig?.metadataCacheUri || bookmarks === []) return

    async function init() {
      if (!bookmarks?.length) {
        setPinned([])
        return
      }

      setIsLoading(true)

      try {
        const resultPinned = await getAssetsBookmarked(
          bookmarks,
          chainIds,
          newCancelToken()
        )
        const pinnedAssets: AssetListPrices[] = await getAssetsBestPrices(
          resultPinned
        )
        setPinned(pinnedAssets)
      } catch (error) {
        Logger.error(error.message)
      }

      setIsLoading(false)
    }
    init()
  }, [
    appConfig?.metadataCacheUri,
    bookmarks,
    chainIds,
    getAssetsBookmarked,
    newCancelToken
  ])

  return (
    <Container>
      <Table
        columns={columns}
        data={pinned}
        isLoading={isLoading}
        emptyMessage="You can bookmark your favorite data services to pin them here."
        noTableHead
      />
    </Container>
  )
}
