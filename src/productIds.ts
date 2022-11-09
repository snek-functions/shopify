import { fn } from "./factory"
import ShopifyAdminApi from "./internal/shopifyAdminApi.js"
import { ShopifyId } from "./types.js";

const productIds = fn<ShopifyId , string[]>(
  async args => {

    const api = new ShopifyAdminApi(args.shop, args.accessToken)

    const handles = await api.productIds()

    return handles
  },
  {
    name: "productIds",
  }
)

export default productIds

// SPDX-License-Identifier: (EUPL-1.2)
// Copyright © 2019-2022 snek.at
