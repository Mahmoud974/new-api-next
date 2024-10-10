import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Définition des URLs selon l'environnement
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://product-cart-plum.vercel.app/api"; // Remplace par l'URL de production

const fetchElements = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

const postElement = async (data) => {
  const response = await axios.post(`${API_URL}/post`, data);
  console.log(response);
  return response.data;
};

export const useTemplate = () => {
  return useQuery({
    queryKey: ["get-template"],
    queryFn: () => fetchElements(`${API_URL}/conv`),
  });
};

export const usePostTemplate = () => {
  const queryClient = useQueryClient(); // Pour invalider ou rafraîchir les données après le POST

  return useMutation({
    mutationFn: postElement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-template"] });
    },
  });
};
