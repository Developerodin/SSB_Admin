

import axios from 'axios';

export const Base_url = 'https://api.stepsstamp.com/v1/';
// export const Base_url = 'http://localhost:3001/v1/';
// export const Base_url = 'https://stepsstamp-backend-v2.onrender.com/v1/';

// Helper function to handle API requests
export const apiRequest = async (url, method, data = {}) => {
  try {
    const response = await axios({
      url,
      method,
      baseURL: Base_url,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    });
    console.log("api req res==>",response.data)
    return response.data;
  } catch (error) {
    console.log(`Error in ${method.toUpperCase()} ${url}:`, error.response?.data || error.message);
    // throw error.response?.data || error.message;
  }
};