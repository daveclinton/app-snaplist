import { Env } from '@env';

export interface MarketplaceConfig {
  id: number;
  name: string;
  slug: string;
  icon_url: string;
  oauth_url: string;
  token_url: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string;
  is_supported: boolean;
  is_linked: boolean;
}
export const SUPPORTED_MARKETPLACES: MarketplaceConfig[] = [
  {
    id: 1,
    name: 'eBay',
    slug: 'ebay',
    icon_url:
      'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/042013/ebay_logo.png?itok=QLz1bS2p',
    oauth_url: 'https://auth.ebay.com/oauth2/authorize',
    token_url: 'https://api.ebay.com/identity/v1/oauth2/token',
    client_id: Env.EBAY_CLIENT_ID || '',
    client_secret: Env.EBAY_CLIENT_SECRET || '',
    redirect_uri: `${Env.APP_URL}/api/marketplace/callback/ebay`,
    scope:
      'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory',
    is_supported: true,
    is_linked: false,
  },
  {
    id: 2,
    name: 'Facebook',
    slug: 'facebook',
    icon_url:
      'https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook2_colored_svg-1024.png',
    oauth_url: 'https://www.facebook.com/v12.0/dialog/oauth',
    token_url: 'https://graph.facebook.com/v12.0/oauth/access_token',
    client_id: process.env.FACEBOOK_CLIENT_ID || '',
    client_secret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirect_uri: `${process.env.APP_URL}/api/marketplace/callback/facebook`,
    scope: 'marketplace_management',
    is_supported: true,
    is_linked: false,
  },
  {
    id: 3,
    name: 'Etsy',
    slug: 'etsy',
    icon_url:
      'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/122010/etsy-thumb.png?itok=gGyYsxrn',
    oauth_url: 'https://www.facebook.com/v12.0/dialog/oauth',
    token_url: 'https://graph.facebook.com/v12.0/oauth/access_token',
    client_id: process.env.FACEBOOK_CLIENT_ID || '',
    client_secret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirect_uri: `${process.env.APP_URL}/api/marketplace/callback/facebook`,
    scope: 'marketplace_management',
    is_supported: false,
    is_linked: false,
  },
  {
    id: 4,
    name: 'Mercari',
    slug: 'mercari',
    icon_url:
      'https://play-lh.googleusercontent.com/R9i7khccBAs17Ht2olOHBoHhwfBTnwjqpskDGWXrhe-NBVrcXjZp_aatSqs6mK8iarQ',
    oauth_url: 'https://www.facebook.com/v12.0/dialog/oauth',
    token_url: 'https://graph.facebook.com/v12.0/oauth/access_token',
    client_id: process.env.FACEBOOK_CLIENT_ID || '',
    client_secret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirect_uri: `${process.env.APP_URL}/api/marketplace/callback/facebook`,
    scope: 'marketplace_management',
    is_supported: true,
    is_linked: false,
  },
  {
    id: 5,
    name: 'Amazon',
    slug: 'amazon',
    icon_url:
      'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/092011/a_com_w_logo_rgb.png?itok=-L2qiQ5-',
    oauth_url: 'https://www.facebook.com/v12.0/dialog/oauth',
    token_url: 'https://graph.facebook.com/v12.0/oauth/access_token',
    client_id: process.env.FACEBOOK_CLIENT_ID || '',
    client_secret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirect_uri: `${process.env.APP_URL}/api/marketplace/callback/facebook`,
    scope: 'marketplace_management',
    is_supported: false,
    is_linked: false,
  },
];
