import { fn } from "./factory"
import { ShopifyProductInput } from "./internal/types.js"
import ShopifyAdminApi from "./internal/shopifyAdminApi.js"
import { ShopifyId } from "./types.js"

const createProduct = fn<
  { product: string } & ShopifyId,
  string
>(
  async args => {
    const api = new ShopifyAdminApi(args.shop, args.accessToken)

    const product = JSON.parse(args.product) as ShopifyProductInput

    const id = await api.createProduct(product)

    return id
  },
  {
    name: "createProduct",
  }
)

export default createProduct

// SPDX-License-Identifier: (EUPL-1.2)
// Copyright © 2019-2022 snek.at
