# WooCommerce Integration Guide

This Solar DIY store is designed to integrate with WooCommerce. Below are the steps and API considerations for connecting this Next.js frontend to a WordPress/WooCommerce backend.

## Architecture Options

### Option 1: Headless WooCommerce (Recommended)
Run this Next.js app as the frontend and use WooCommerce's REST API or GraphQL (WooGraphQL) as the backend.

**Setup:**
1. Install WordPress + WooCommerce on your server
2. Enable REST API: WooCommerce REST API is enabled by default at `/wp-json/wc/v3/`
3. Generate API keys: WooCommerce → Settings → Advanced → REST API
4. Replace `/api/products` calls with WooCommerce REST API endpoints

**Endpoints:**
- `GET /wp-json/wc/v3/products` - List products
- `GET /wp-json/wc/v3/products/{id}` - Single product
- `POST /wp-json/wc/v3/products` - Create product (Admin)
- Cart & Checkout: Use WooCommerce's built-in checkout or WooCommerce Store API for headless cart

### Option 2: WooCommerce as Primary, Next.js for Incentives
Keep WooCommerce for store operations. Use this project's Canadian Incentives page and design as reference, or embed it in an iframe/subdomain.

### Option 3: Full Migration to WooCommerce Theme
Port the design to a custom WordPress/WooCommerce theme. The product schema, incentives data, and UI patterns can be reused.

## Product Schema Mapping

| This Store        | WooCommerce Equivalent        |
|-------------------|-------------------------------|
| `id`              | `id`                          |
| `name`            | `name`                        |
| `slug`            | `slug`                        |
| `description`     | `short_description`           |
| `longDescription` | `description`                 |
| `price` (cents)   | `price` (decimal)             |
| `images` (URLs)   | `images[]`                    |
| `category`        | `categories[]`                |
| `specifications`  | `meta_data` or `attributes`   |

## Cart & Checkout

- **Current:** Cart is stored in localStorage; checkout is demo-only
- **WooCommerce:** Use WooCommerce REST API for cart (`/wp-json/wc/store/v1/cart`) or redirect to WooCommerce checkout URL
- **Stripe:** WooCommerce supports Stripe plugin for payments

## Environment Variables

When integrating, add to `.env.local`:

```
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-store.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxx
```

## Recommended Plugins

- **WooCommerce** - Core store
- **WooCommerce Stripe Gateway** - Payments
- **JWT Authentication for WP REST API** - Secure API auth
- **WooGraphQL** - If using GraphQL instead of REST
