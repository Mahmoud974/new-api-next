import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Définition des URLs selon l'environnement
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://section-interactive-comments.netlify.app/api";

const fetchElements = async (url: string) => {
  const response = await axios.get(url);
  console.log("Fetched comments:", response.data); // Ajoutez ce log
  return response.data;
};

const postElement = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/post`, data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const useTemplate = () => {
  return useQuery({
    queryKey: ["get-template"],

    queryFn: () => fetchElements(`${API_URL}/conv`),
  });
};

export const usePostTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postElement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-template"] });
    },
  });
};
