# API Contract — MediCare Plus (India)

This document defines the data structure that the frontend uses to interact with mock data (now) or the future Spring Boot backend (later), adapted for the Indian pharmaceutical market (CDSCO & Drugs & Cosmetics Act).

## Medicine Object
```json
{
  "id": 1,
  "name": "Dolo 650mg Tablets",
  "brand": "Micro Labs",
  "price": 30.50,
  "originalPrice": 34.00,
  "category": "Fever & Pain Relief",
  "prescriptionRequired": false,
  "isScheduleH": false,
  "isScheduleH1": false,
  "isAyurvedic": false,
  "description": "India's trusted fever and mild-to-moderate pain reliever. Contains Paracetamol IP 650mg.",
  "dosage": "Strip of 15 Tablets",
  "imageUrl": "data:image/svg+xml;utf8,...",
  "stockQuantity": 450,
  "rating": 4.9,
  "reviewsCount": 1420
}
```

### Indian Market Attributes
- `price`: Retail price in Indian Rupees (₹).
- `originalPrice`: Maximum Retail Price (MRP) in Indian Rupees (₹).
- `isScheduleH` / `isScheduleH1`: Regulatory flags indicating mandatory prescription from a Registered Medical Practitioner (RMP).
- `isAyurvedic`: Indicates 100% Ayurvedic / herbal formulation (e.g. Dabur, Himalaya).

## Endpoints (Targeted for Spring Boot)
- `GET /api/medicines` - Fetch products. Supported query parameters: `category`, `query`, `productType` (`all`, `otc`, `rx`), `inStockOnly` (`true`/`false`), `sortBy` (`recommended`, `name-asc`, `price-asc`, `price-desc`), and `featuredOnly` (`true`/`false`).
- `GET /api/medicines/{id}` - Fetch single product
- `GET /api/categories` - Fetch all healthcare categories
- `POST /api/prescription/upload` - Upload doctor's prescription file
- `POST /api/auth/login` - Login user
- `POST /api/cart` - Save cart (local storage currently)

## Catalog field conventions
- `category` is the display category name and is matched case-insensitively.
- `brand`, `name`, `description`, and `dosage` are searchable text fields.
- `prescriptionRequired` is the source of truth for the `rx` and `otc` product type filters.
- `inStock` indicates current availability; when omitted, `stockQuantity > 0` is used if a quantity is supplied.
- Prices are numeric values in the shop's configured currency and are sorted numerically.
