import axios from 'axios';

const KEY = '52917262-bfaf5bd23aa54a80b60e2fad9';
const BASE_URL = 'https://pixabay.com/api/';

export default async function fetchImages(value, page, limit = 15) {
  const params = new URLSearchParams({
    key: KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: limit,
    page: page,
  });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}
