import { ShopifyProductInput, UpdateShopifyProductInput } from "./types.js";

class ShopifyGraphqlClient {
  private shop: string;
  private accessToken: string;

  constructor(shop: string, accessToken: string) {
    this.shop = shop;
    this.accessToken = accessToken;
  }

  async query<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<{ data: T; errors: any[] }> {
    const response = await fetch(
      `https://${this.shop}/admin/api/2022-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.accessToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

    const json = await response.json();

    if (json.errors) {
      if (json.errors[0].message === "Throttled") {
        // wait 5 seconds and try again

        await new Promise((resolve) => setTimeout(resolve, 5000));

        return this.query(query, variables);
      }

      if (!Array.isArray(json.errors)) {
        return {
          data: json.data,
          errors: [new Error(json.errors)],
        };
      }
    }

    return {
      data: json.data,
      errors: json.errors || [],
    };
  }
}

class ShopifyAdminApi {
  private client: ShopifyGraphqlClient;

  constructor(shop: string, accessToken: string) {
    this.client = new ShopifyGraphqlClient(shop, accessToken);
  }

  async allProductId(cursor?: string): Promise<string[]> {
    const query = `query {
      products(first: 250, after: ${cursor ? `"${cursor}"` : null}) {
        edges {
          node {
            id
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }`;

    const response = await this.client.query<{
      products: {
        edges: {
          node: {
            id: string;
          };
          cursor: string;
        }[];
        pageInfo: {
          hasNextPage: boolean;
        };
      };
    }>(query);

    console.log("errors", response.errors);

    console.log("data", response.data.products.edges);

    const data = response.data;

    // check if there are more pages

    if (data.products.pageInfo.hasNextPage) {
      console.log(
        "cursor",
        data.products.edges[data.products.edges.length - 1].cursor
      );

      const moreIds = await this.allProductId(
        data.products.edges[data.products.edges.length - 1].cursor
      );

      return [...data.products.edges.map((edge) => edge.node.id), ...moreIds];
    }

    return data.products.edges.map((edge) => edge.node.id);
  }

  async getProduct(id: string): Promise<{
    id: string;
    metafields: {
      edges: {
        node: {
          id: string;
          key: string;
          value: string;
          namespace: string;
        };
      }[];
    };
  }> {
    console.log(`id`, id);

    const query = `query {
      product(id: "${id}") {
        id
        metafields(first: 250) {
          edges {
            node {
              id
              key
              value
              namespace
            }
  
          }
        }
      }
    }`;

    const response = await this.client.query<{
      product: {
        id: string;
        metafields: {
          edges: {
            node: {
              id: string;
              key: string;
              value: string;
              namespace: string;
            };
          }[];
        };
      };
    }>(query);

    console.log(`response`, response);

    const data = response.data;

    return data.product;
  }

  async getProductIdByHandle(handle: string): Promise<string> {
    const query = `query {
      productByHandle(handle: "${handle}") {
        id
      }
    }`;

    const response = await this.client.query<{
      productByHandle: {
        id: string;
      } | null;
    }>(query);

    console.log(response);

    const data = response.data;

    if (data.productByHandle === null) {
      throw new Error(`Product with handle ${handle} not found`);
    }

    return data.productByHandle.id;
  }

  async deleteProductById(id: string): Promise<void> {
    const query = `mutation {
      productDelete(id: "${id}") {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }`;

    const response = await this.client.query<{ productDelete: any }>(query);

    const data = response.data;

    if (data.productDelete.userErrors.length > 0) {
      throw new Error(data.productDelete.userErrors[0].message);
    }
  }

  async createProduct(product: ShopifyProductInput): Promise<string> {
    const queryWithArgs = `mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
      
   }`;

    console.log(`product`, product);

    const response = await this.client.query<{
      productCreate: {
        product: {
          id: string;
        };
        userErrors: any[];
      };
    }>(queryWithArgs, {
      input: product,
    });

    console.log(response);

    const data = response.data;

    if (data.productCreate.userErrors.length > 0) {
      throw new Error(data.productCreate.userErrors[0].message);
    }

    return data.productCreate.product.id;
  }

  async updateProduct(product: UpdateShopifyProductInput): Promise<void> {
    console.log(`product`, product);

    const productInfo = await this.getProduct(product.id);

    console.log(`productInfo`, productInfo.metafields.edges);

    // Add metafields ids to the input

    const metafields = productInfo.metafields.edges.map((edge) => edge.node);

    const metafieldsInput = product.metafields?.map((metafield) => {
      const existingMetafield = metafields.find(
        (m) => m.key === metafield.key && m.namespace === metafield.namespace
      );

      return {
        ...metafield,
        id: existingMetafield?.id,
      };
    });

    product.metafields = metafieldsInput;

    console.log(`product`, product);

    const queryWithArgs = `mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
      
   }`;

    const response = await this.client.query<{
      productUpdate: {
        product: {
          id: string;
        };
        userErrors: any[];
      };
    }>(queryWithArgs, {
      input: product,
    });

    const data = response.data;

    console.log(`response`, response);

    if (data.productUpdate.userErrors.length > 0) {
      console.log(
        `data.productUpdate.userErrors`,
        data.productUpdate.userErrors[0]
      );
      throw new Error(data.productUpdate.userErrors[0].message);
    }
  }
}

export default ShopifyAdminApi;
