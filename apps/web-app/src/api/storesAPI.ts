import { apiClient } from "./client";
import { API_STORES_BY_CATEGORY } from "./endpoints";


export const fetchStoresByCategory = async (categoryId: number): Promise<any> => {
  const response = await apiClient.get(API_STORES_BY_CATEGORY(categoryId));
  return response.data;
  
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
