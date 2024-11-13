import axios from 'axios';
export const client = axios.create({
  baseURL: 'https://markeplace-listing.onrender.com/api/v1/',
});
