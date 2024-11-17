import axios from 'axios';
export const client = axios.create({
  // baseURL: 'https://markeplace-listing.onrender.com/api/v1/',
  baseURL: 'https://8e29-41-212-41-122.ngrok-free.app/api/v1',
});
