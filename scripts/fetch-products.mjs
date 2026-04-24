#!/usr/bin/env node
/**
 * AliExpress Affiliate API → data/products.ts
 *
 * Usage:
 *   ALIEXPRESS_APP_KEY=xxx ALIEXPRESS_APP_SECRET=yyy node scripts/fetch-products.mjs
 *
 * Optional env vars:
 *   NEXT_PUBLIC_ALIEXPRESS_TRACKING_ID  – your affiliate tracking id
 *   ALIEXPRESS_SHIP_TO                  – target country code (default: US)
 *   ALIEXPRESS_PAGE_SIZE                – products per category (max 50, default 50)
 *   ALIEXPRESS_PAGES                    – pages per category (default 2 = up to 100 products per cat)
 *   ALIEXPRESS_MIN_RATING               – minimum rating 0-5 (default 4.5)
 *   ALIEXPRESS_MIN_ORDERS               – minimum order count (default 500)
 */

import crypto from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Config ──────────────────────────────────────────────────────────────────

const APP_KEY    = process.env.ALIEXPRESS_APP_KEY;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;
const TRACKING   = process.env.NEXT_PUBLIC_ALIEXPRESS_TRACKING_ID || '';
const SHIP_TO    = process.env.ALIEXPRESS_SHIP_TO    || 'US';
const PAGE_SIZE  = Number(process.env.ALIEXPRESS_PAGE_SIZE) || 50;
const PAGES      = Number(process.env.ALIEXPRESS_PAGES)     || 2;
const MIN_RATING = Number(process.env.ALIEXPRESS_MIN_RATING)  || 4.5;
const MIN_ORDERS = Number(process.env.ALIEXPRESS_MIN_ORDERS)  || 500;

const API_URL = 'https://api-sg.aliexpress.com/sync';

if (!APP_KEY || !APP_SECRET) {
  console.error('\n❌  Missing env vars. Run with:\n');
  console.error('   ALIEXPRESS_APP_KEY=xxx ALIEXPRESS_APP_SECRET=yyy node scripts/fetch-products.mjs\n');
  process.exit(1);
}

// ── Signing ──────────────────────────────────────────────────────────────────

function sign(params) {
  const keys = Object.keys(params).sort();
  let str = APP_SECRET;
  for (const k of keys) str += k + String(params[k]);
  str += APP_SECRET;
  return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
}

async function callApi(method, params = {}) {
  const base = {
    method,
    app_key:     APP_KEY,
    timestamp:   Date.now().toString(),
    sign_method: 'md5',
    ...params,
  };
  base.sign = sign(base);

  const qs  = new URLSearchParams(base).toString();
  const res = await fetch(`${API_URL}?${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

// ── Category mapping: AliExpress ID → our slug ───────────────────────────────

const ALI_CATEGORY_TO_SLUG = {
  44:        'electronics',   // Consumer Electronics
  509:       'electronics',   // Phones & Telecoms
  7:         'electronics',   // Computer & Office
  1503:      'home-kitchen',  // Home & Garden
  13:        'home-kitchen',  // Home Improvement
  3042:      'beauty',        // Beauty & Health
  66:        'beauty',        // Hair & Beauty
  3:         'fashion',       // Apparel
  36:        'fashion',       // Jewelry & Accessories
  100003070: 'fashion',       // Bags & Luggage
  18:        'fitness',       // Sports & Entertainment
  100006513: 'fitness',       // Outdoor & Adventure
  26:        'toys-hobbies',  // Toys & Hobbies
  1080:      'toys-hobbies',  // Board Games & Cards
};

// Categories to query
const FETCH_TARGETS = [
  { slug: 'electronics',  categoryIds: [44, 509, 7],         keywords: ['wireless earbuds','smart watch','portable charger'] },
  { slug: 'home-kitchen', categoryIds: [1503, 13],           keywords: ['led strip lights','electric scrubber','kitchen gadget'] },
  { slug: 'beauty',       categoryIds: [3042, 66],           keywords: ['facial cleansing brush','hair straightener','nail lamp'] },
  { slug: 'fashion',      categoryIds: [3, 36, 100003070],   keywords: ['leather crossbody bag','minimalist watch','sunglasses'] },
  { slug: 'fitness',      categoryIds: [18, 100006513],      keywords: ['resistance bands','yoga mat','camping lantern'] },
  { slug: 'toys-hobbies', categoryIds: [26, 1080],           keywords: ['magnetic building blocks','rc car','puzzle'] },
];

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchHotProducts(categoryIds, page) {
  const raw = await callApi('aliexpress.affiliate.hotproduct.query', {
    category_ids:      categoryIds.join(','),
    target_currency:   'USD',
    target_language:   'EN',
    ship_to_country:   SHIP_TO,
    tracking_id:       TRACKING,
    page_no:           String(page),
    page_size:         String(PAGE_SIZE),
    sort:              'LAST_VOLUME_DESC',
    fields: [
      'product_id','product_title','target_sale_price','target_sale_price_currency',
      'target_original_price','target_original_price_currency','evaluate_rate',
      'review_count','lastest_volume','product_detail_url','product_main_image_url',
      'product_small_image_urls','first_level_category_id','first_level_category_name',
      'second_level_category_name','promotion_link','logistics_cost','commission_rate',
      'discount','shop_id',
    ].join(','),
  });

  const resp = raw?.aliexpress_affiliate_hotproduct_query_response?.resp_result;
  if (resp?.resp_code !== 200) {
    console.warn(`  ⚠ API returned code ${resp?.resp_code}: ${resp?.resp_msg}`);
    return [];
  }
  return resp.result?.products?.product ?? [];
}

async function fetchByKeyword(keyword, categorySlug) {
  const raw = await callApi('aliexpress.affiliate.product.query', {
    keywords:         keyword,
    target_currency:  'USD',
    target_language:  'EN',
    ship_to_country:  SHIP_TO,
    tracking_id:      TRACKING,
    page_no:          '1',
    page_size:        '20',
    sort:             'LAST_VOLUME_DESC',
    fields: [
      'product_id','product_title','target_sale_price','target_sale_price_currency',
      'target_original_price','evaluate_rate','review_count','lastest_volume',
      'product_detail_url','product_main_image_url','product_small_image_urls',
      'first_level_category_id','first_level_category_name','second_level_category_name',
      'promotion_link','logistics_cost','commission_rate','discount',
    ].join(','),
  });

  const resp = raw?.aliexpress_affiliate_product_query_response?.resp_result;
  if (resp?.resp_code !== 200) return [];
  return resp.result?.products?.product ?? [];
}

// ── Conversion ───────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70);
}

function shortTitle(title) {
  if (title.length <= 65) return title;
  // Cut at last space before 65 chars
  const cut = title.slice(0, 65);
  const last = cut.lastIndexOf(' ');
  return (last > 30 ? cut.slice(0, last) : cut).trim();
}

function parseRating(evaluateRate) {
  if (!evaluateRate) return 4.5;
  const pct = parseFloat(String(evaluateRate).replace('%', ''));
  return Math.round((pct / 100) * 5 * 10) / 10;
}

function parsePrice(val) {
  return Math.round(parseFloat(String(val || '0')) * 100) / 100;
}

function resolveCategory(apiProduct, defaultSlug) {
  return ALI_CATEGORY_TO_SLUG[apiProduct.first_level_category_id] ?? defaultSlug;
}

function isFreeShipping(apiProduct) {
  const cost = parseFloat(String(apiProduct.logistics_cost || '0'));
  return cost === 0;
}

function convertProduct(apiProduct, defaultSlug) {
  const title  = String(apiProduct.product_title || '').trim();
  const price  = parsePrice(apiProduct.target_sale_price ?? apiProduct.sale_price);
  const origPx = parsePrice(apiProduct.target_original_price ?? apiProduct.original_price);
  const productId = String(apiProduct.product_id);
  const slug   = slugify(shortTitle(title)) || `product-${productId}`;

  const smallImages = apiProduct.product_small_image_urls?.string ?? [];
  const images = [
    apiProduct.product_main_image_url,
    ...(Array.isArray(smallImages) ? smallImages : [smallImages]),
  ].filter(Boolean).slice(0, 4);

  const rating     = parseRating(apiProduct.evaluate_rate);
  const reviewCount = parseInt(String(apiProduct.review_count || '0'), 10);
  const orders     = parseInt(String(apiProduct.lastest_volume || '0'), 10);

  return {
    id:           `p-ali-${productId}`,
    slug,
    title,
    shortTitle:   shortTitle(title),
    description:  title,
    bullets:      [],
    price,
    originalPrice: origPx > price ? origPx : Math.round(price * 1.6 * 100) / 100,
    currency:     apiProduct.target_sale_price_currency ?? 'USD',
    rating,
    reviewCount,
    ordersCount:  orders,
    image:        images[0] ?? '',
    images,
    category:     resolveCategory(apiProduct, defaultSlug),
    tags:         [apiProduct.second_level_category_name].filter(Boolean),
    aliexpressUrl: apiProduct.promotion_link ?? apiProduct.product_detail_url ?? '',
    featured:     false,
    trending:     orders > 10000,
    brand:        '',
    shippingFrom: 'China',
    freeShipping: isFreeShipping(apiProduct),
  };
}

function meetsThreshold(p) {
  return p.rating >= MIN_RATING && p.ordersCount >= MIN_ORDERS && p.price > 0 && p.image;
}

// ── TypeScript output ─────────────────────────────────────────────────────────

function productToTs(p) {
  const j = (v) => JSON.stringify(v);
  return `  {
    id: ${j(p.id)},
    slug: ${j(p.slug)},
    title: ${j(p.title)},
    shortTitle: ${j(p.shortTitle)},
    description: ${j(p.description)},
    bullets: [],
    price: ${p.price},
    originalPrice: ${p.originalPrice},
    currency: ${j(p.currency)},
    rating: ${p.rating},
    reviewCount: ${p.reviewCount},
    ordersCount: ${p.ordersCount},
    image: ${j(p.image)},
    images: ${JSON.stringify(p.images)},
    category: ${j(p.category)},
    tags: ${JSON.stringify(p.tags)},
    aliexpressUrl: ${j(p.aliexpressUrl)},
    featured: false,
    trending: ${p.trending},
    brand: "",
    shippingFrom: "China",
    freeShipping: ${p.freeShipping},
  }`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 BestSellingWeb — AliExpress product fetcher\n');
  console.log(`Settings: min rating ${MIN_RATING} | min orders ${MIN_ORDERS} | ${PAGES} pages × ${PAGE_SIZE}/page per category\n`);

  const allRaw   = new Map();  // product_id → converted product
  const seenSlugs = new Set();

  for (const target of FETCH_TARGETS) {
    console.log(`📦 Category: ${target.slug} (IDs: ${target.categoryIds.join(', ')})`);

    // Hot products (multiple pages)
    for (let page = 1; page <= PAGES; page++) {
      process.stdout.write(`   hot page ${page}…`);
      try {
        const items = await fetchHotProducts(target.categoryIds, page);
        let added = 0;
        for (const item of items) {
          if (!allRaw.has(item.product_id)) {
            allRaw.set(item.product_id, convertProduct(item, target.slug));
            added++;
          }
        }
        console.log(` ✓ ${items.length} items (${added} new)`);
      } catch (e) {
        console.log(` ✗ ${e.message}`);
      }
      await sleep(600);
    }

    // Keyword search
    for (const kw of target.keywords) {
      process.stdout.write(`   keyword "${kw}"…`);
      try {
        const items = await fetchByKeyword(kw, target.slug);
        let added = 0;
        for (const item of items) {
          if (!allRaw.has(item.product_id)) {
            allRaw.set(item.product_id, convertProduct(item, target.slug));
            added++;
          }
        }
        console.log(` ✓ ${items.length} items (${added} new)`);
      } catch (e) {
        console.log(` ✗ ${e.message}`);
      }
      await sleep(400);
    }
  }

  // Filter and deduplicate slugs
  const products = [];
  for (const p of allRaw.values()) {
    if (!meetsThreshold(p)) continue;
    // Ensure slug uniqueness
    let slug = p.slug;
    if (seenSlugs.has(slug)) slug = `${slug}-${p.id.replace('p-ali-', '')}`;
    seenSlugs.add(slug);
    products.push({ ...p, slug });
  }

  console.log(`\n✅ Total after filtering: ${products.length} products (from ${allRaw.size} fetched)\n`);

  if (products.length === 0) {
    console.warn('⚠ No products passed the filter. Try lowering MIN_RATING or MIN_ORDERS.');
    process.exit(0);
  }

  // Read current products.ts to preserve the Category type + CATEGORIES array
  const currentFile = readFileSync(join(ROOT, 'data/products.ts'), 'utf8');
  const categoriesBlock = currentFile.match(
    /export const CATEGORIES[\s\S]*?^];/m,
  )?.[0] ?? '';

  // Build new file
  const typeBlock = currentFile.match(/export type Category[\s\S]*?^};/m)?.[0] ?? '';
  const productTypeBlock = currentFile.match(/export type Product[\s\S]*?^};/m)?.[0] ?? '';

  const newFile = `${typeBlock}

${productTypeBlock}

${categoriesBlock}

export const PRODUCTS: Product[] = [
${products.map(productToTs).join(',\n')}
];
`;

  writeFileSync(join(ROOT, 'data/products.ts'), newFile, 'utf8');
  console.log(`📝 Wrote ${products.length} products to data/products.ts`);
  console.log('   Run "npm run build" to verify, then commit and push.\n');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});
