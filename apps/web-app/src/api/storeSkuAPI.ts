import { apiClient } from "./client";
import { API_STORE_SKUS_BY_STORE_ID } from "./endpoints";


export const fetchStoreSkusByStoreId = async (storeId: number): Promise<any> => {
  const response = await apiClient.get(API_STORE_SKUS_BY_STORE_ID(storeId));
  return response.data;
  return [
    
    {
      "name": "Fresh Mart",
      "category": 1,
      "description": "Fresh Veggies",
      "address": "Sector 47",
      "city": "Gurugram",
      "state": "Haryana",
      "pincode": "122001",
      "phone": "8860023136",
      "email": "user@example.com",
      "latitude": 0,
      "longitude": 0,
      "opening_time": "string",
      "closing_time": "string",
      "is_active": true,
      "id": 1,
      "created_at": "2025-12-28T17:34:32.912455",
      "updated_at": "2025-12-28T17:34:32.912458"
    },
    {
      "name": "Fresh Mart",
      "category": 1,
      "description": "Fresh Veggies",
      "address": "Sector 47",
      "city": "Gurugram",
      "state": "Haryana",
      "pincode": "122001",
      "phone": "8860023136",
      "email": "user1@example.com",
      "latitude": 0,
      "longitude": 0,
      "opening_time": "string",
      "closing_time": "string",
      "is_active": true,
      "id": 2,
      "created_at": "2025-12-28T17:54:33.584309",
      "updated_at": "2025-12-28T17:54:33.584311"
    }
    

  ]

};


// const stores = [
//     {
//       id: 1,
//       name: "Fresh Mart",
//       category: "Supermarket",
//       rating: 4.5,
//       distance: "0.3 km",
//       image: "🛒",
//       popular: ["Milk", "Bread", "Eggs"],
//     },
//     {
//       id: 2,
//       name: "Green Valley Organics",
//       category: "Organic Store",
//       rating: 4.8,
//       distance: "0.7 km",
//       image: "🥬",
//       popular: ["Organic Veggies", "Fruits", "Grains"],
//     },
//     {
//       id: 3,
//       name: "QuickStop Grocery",
//       category: "Convenience Store",
//       rating: 4.3,
//       distance: "0.2 km",
//       image: "🏪",
//       popular: ["Snacks", "Drinks", "Daily Essentials"],
//     },
//     {
//       id: 4,
//       name: "Pizza Palace",
//       category: "Restaurant",
//       rating: 4.6,
//       distance: "0.5 km",
//       image: "🍕",
//       popular: ["Pizza", "Burgers", "Pasta"],
//     },
//   ];
