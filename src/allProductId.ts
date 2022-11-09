import {fn} from './factory'
import ShopifyAdminApi from './internal/shopifyAdminApi.js'
import {ShopifyId} from './types.js'

const allProductId = fn<ShopifyId, string[]>(
  async args => {
    const api = new ShopifyAdminApi(args.shop, args.accessToken)

    const handles = await api.allProductId()

    return handles
  },
  {
    name: 'allProductId'
  }
)

export default allProductId

// SPDX-License-Identifier: (EUPL-1.2)
// Copyright © 2019-2022 snek.at
