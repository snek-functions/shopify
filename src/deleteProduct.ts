import { fn } from "./factory"
import ShopifyAdminApi from "./internal/shopifyAdminApi.js"
import { ShopifyId } from "./types.js"

const deleteProduct = fn<{ productId: string } & ShopifyId, void>(
  async args => {

    const api = new ShopifyAdminApi(args.shop, args.accessToken)

    await api.deleteProductById(args.productId)

  },
  {
    name: "deleteProduct",
  }
)

export default deleteProduct

// SPDX-License-Identifier: (EUPL-1.2)
// Copyright © 2019-2022 snek.at
