import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCategories } from "../src/api/categoriesAPI";

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["fetchCategories"],
    queryFn: () => fetchCategories(),
  });
};