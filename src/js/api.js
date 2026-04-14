import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'https://684f0d7cf0c9c9848d29f4dc.mockapi.io/api/',
});

export const registerUserApi = userData => {
  return apiInstance.post('/users', userData);
};
