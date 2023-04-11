export type ShopifyProductInput = {
  handle: string;
  title: string;
  descriptionHtml: string;
  metafields: {
    namespace: string;
    key: string;
    value: string;
    type: string;
  }[];
  productType: string;
  tags: string[];
  variants: {
    price: string;
    compareAtPrice: string;
    sku: string;
    taxable: boolean;
  };
  vendor: string;
};

export interface UpdateShopifyProductInput {
  id: string;
  handle?: string;
  title?: string;
  descriptionHtml?: string;
  metafields?: {
    namespace: string;
    key: string;
    value: string;
    type: string;
  }[];
  productType?: string;
  tags?: string[];
  variants?: {
    price: string;
    compareAtPrice: string;
    sku: string;
    taxable: boolean;
  };
  vendor?: string;
}

export interface ShopifyId {
  storeUrl: string;
  accessToken: string;
}
