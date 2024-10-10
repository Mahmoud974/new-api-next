import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://interactive-comments-section-pink-rho.vercel.app/api";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postElement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-template"] });
    },

    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });
};
