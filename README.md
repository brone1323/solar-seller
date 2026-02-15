# Solar DIY Webstore

A modern, impressive webstore for solar equipment with admin panel, cart, checkout, and Canadian solar incentives by location.

## Features

- **Homepage** – Hero, featured products, feature highlights
- **Product Catalog** – Grid with images, specs, categories
- **Product Detail Pages** – Full descriptions, specifications, add to cart
- **Admin Panel** – Add/edit products, specifications, images
- **Shopping Cart** – Persistent (localStorage), quantity controls
- **Checkout** – PayPal checkout integration
- **Canadian Solar Incentives** – By province/location with filters
- **WooCommerce Ready** – See [WOOCOMMERCE_INTEGRATION.md](./WOOCOMMERCE_INTEGRATION.md)

## Theme

Blue and green solar-inspired palette:
- **Sky/Ocean** (#0ea5e9, #0284c7) – Primary accents
- **Leaf/Forest** (#22c55e, #16a34a) – Success, eco
- **Dark** (#0f172a, #0c4a6e) – Backgrounds

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## PayPal Setup

1. Create a `.env.local` file (copy from `.env.example`)
2. Get your credentials from [developer.paypal.com](https://developer.paypal.com)
3. Add `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
4. Use sandbox credentials for testing; set `PAYPAL_MODE=live` for production

## Admin

Visit `/admin` to add equipment, specifications, descriptions, and images. You can:
- **Upload images** – Choose files (JPEG, PNG, WebP, GIF, max 4MB) – stored in Vercel Blob
- **Or paste URLs** – External image links still work

**Image uploads:** Add Blob storage in your Vercel project (Storage tab) to enable uploads. The `BLOB_READ_WRITE_TOKEN` is set automatically.

## WooCommerce Integration

See [WOOCOMMERCE_INTEGRATION.md](./WOOCOMMERCE_INTEGRATION.md) for connecting to WordPress/WooCommerce, product schema mapping, and cart/checkout options.
