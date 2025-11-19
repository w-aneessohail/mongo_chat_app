import { useState } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async ({ url, method = "get", data = {}, params = {} }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      setResponse(res.data);
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data || err.message;

      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, fetchData };
};

export default useAxios;
