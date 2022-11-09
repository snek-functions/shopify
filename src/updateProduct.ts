import { fn } from "./factory"
import { UpdateShopifyProductInput } from "./internal/types.js"
import ShopifyAdminApi from "./internal/shopifyAdminApi.js"
import { ShopifyId } from "./types.js";

const updateProduct = fn<
  { product: string; } & ShopifyId,
  void
>(
  async args => {

    console.log("updateProduct", args)

    const api = new ShopifyAdminApi(args.shop, args.accessToken)

    const product = JSON.parse(args.product) as UpdateShopifyProductInput

    console.log(`update product ${product.id}`)

    await api.updateProduct(product)

  },
  {
    name: "updateProduct",
  }
)

export default updateProduct

// SPDX-License-Identifier: (EUPL-1.2)
// Copyright © 2019-2022 snek.at
