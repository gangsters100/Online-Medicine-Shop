# API Contract

This document defines the data structure that the frontend will use to interact with mock data (now) or the future Spring Boot backend (later).

## Medicine Object
```json
{
  "id": 1,
  "name": "Paracetamol",
  "brand": "Generic",
  "price": 10.00,
  "category": "Pain Relief",
  "prescriptionRequired": false,
  "description": "Used to treat mild to moderate pain.",
  "imageUrl": "/assets/products/paracetamol.jpg"
}
```

## Endpoints (Targeted for Spring Boot)
- `GET /api/medicines` - Fetch all products
- `GET /api/medicines/{id}` - Fetch single product
- `POST /api/auth/login` - Login user
- `POST /api/cart` - Save cart (local storage currently)
