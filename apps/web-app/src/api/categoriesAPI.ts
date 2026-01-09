import { apiClient } from "./client";
import { API_CATEGORIES } from "./endpoints";


// Step 1: Send OTP API Call
export const fetchCategories = async (): Promise<any> => {
  const response = await apiClient.get(API_CATEGORIES);
  console.log("Fetched categories:", response.data);
  return response.data;
  // return [
  //   {
  //     id: 1,
  //     title: "Order Grocery",
  //     emoji: "🛒",
  //     description: "Browse nearby stores",
  //     color: "from-green-500/20 to-emerald-600/20",
  //   },
  //   {
  //     id: 2,
  //     title: "Order Medicines",
  //     emoji: "💊",
  //     description: "Get medicines delivered",
  //     color: "from-indigo-500/20 to-purple-600/20",
  //   },
  //   {
  //     id: 3,
  //     title: "Order Food",
  //     emoji: "🍕",
  //     description: "Food delivery from restaurants",
  //     color: "from-orange-500/20 to-red-600/20",
  //   },
  // ];
};

