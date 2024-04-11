import axios from 'axios';
const SendResquestWithToken = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
SendResquestWithToken.interceptors.request.use((req) => {
  if (localStorage.getItem('user')) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).access_token
      }`;
  }
  return req;
});
const SendResquestWithoutToken = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
