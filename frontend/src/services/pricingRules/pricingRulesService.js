import axios from "axios";

const API_URL = "http://localhost:3000/api/admin/pricing-rules";

export const getPricingRules = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const updatePricingRule = async (id, data, token) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};