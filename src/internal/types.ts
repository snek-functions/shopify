export type ShopifyProductInput = {
    handle: string
    title: string
    descriptionHtml: string
    metafields: {
      namespace: string
      key: string
      value: string
      valueType: string
    }[]
    productType: string
    tags: string[]
    variants: {
      price: string
      compareAtPrice: string
      sku: string
      taxable: boolean
    }
    vendor: string
  }

export type UpdateShopifyProductInput = {
    id: string
} & Partial<ShopifyProductInput>