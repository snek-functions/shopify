import {fn} from './factory'
import ShopifyAdminApi from './internal/shopifyAdminApi.js'
import {ShopifyId} from './types.js'

const validateSecret = fn<ShopifyId, boolean>(
  async args => {
    const api = new ShopifyAdminApi(args.shop, args.accessToken)

    await api.validateSecret()

    return true
  },
  {
    name: 'validateSecret'
  }
)

export default validateSecret

// SPDX-License-Identifier: (EUPL-1.2)
// Copyright © 2019-2022 snek.at
