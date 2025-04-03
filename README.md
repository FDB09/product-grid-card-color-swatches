### Shopify Theme - Color Swatches for Collection Product Cards


## Overview

This feature adds color swatches to product cards in Shopify collections, allowing users to preview product variants directly from the collection page. The implementation dynamically assigns images or colors based on Shopify's Color metaobject or variant images.


## Features

Displays variant color swatches on product cards.

Uses Shopify's Color metaobject for hex values or custom images.

Defaults to buttons if no image or color is available.

Improves user experience by allowing variant selection at the collection level.


## File Structure

.
├── assets
│   ├── card-product-variant-selection-custom.js
│   └── component-card-variant-swatch-custom.css
├── config
│   └── settings_schema.json
├── layout
│   └── theme.liquid
└── snippets
    ├── card-product.liquid
    └── card-variant-swatch-custom.liquid

