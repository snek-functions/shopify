import { defineService } from "@snek-at/function";

import ShopifyAdminApi from "./internal/shopify-admin-api";
import { ShopifyId } from "./internal/types";
import {
  ShopifyProductInput,
  UpdateShopifyProductInput,
} from "./internal/types";

export default defineService(
  {
    Query: {
      allProductId: async (id: ShopifyId) => {
        const shopifyAdminApi = new ShopifyAdminApi(
          id.storeUrl,
          id.accessToken
        );

        const products = await shopifyAdminApi.allProductId();

        return products;
      },
    },
    Mutation: {
      productCreate: (id: ShopifyId, product: ShopifyProductInput) => {
        const shopifyAdminApi = new ShopifyAdminApi(
          id.storeUrl,
          id.accessToken
        );
        shopifyAdminApi.createProduct(product);

        return "Product created";
      },
      deleteProduct: (id: ShopifyId, productId: string) => {
        const shopifyAdminApi = new ShopifyAdminApi(
          id.storeUrl,
          id.accessToken
        );
        shopifyAdminApi.deleteProductById(productId);

        return "Product deleted";
      },
      productUpdate: (id: ShopifyId, product: UpdateShopifyProductInput) => {
        const shopifyAdminApi = new ShopifyAdminApi(
          id.storeUrl,
          id.accessToken
        );
        shopifyAdminApi.updateProduct(product);

        return "Product updated";
      },
    },
  },
  {
    configureApp(app) {
      return app;
    },
  }
);
