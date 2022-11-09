import {makeFn} from '@snek-at/functions'

export const url = process.env.IS_OFFLINE
  ? process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-4070.githubpreview.dev/graphql`
    : 'http://localhost:4070/graphql'
  : process.env.ENDPOINT_URL_SHOPIFY ||
    process.env.GATSBY_ENDPOINT_URL_SHOPIFY ||
    ''

export const fn = makeFn({
  url
})
