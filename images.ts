import {CATAPI_KEY} from './credentials';

const LIMIT = 5;

const getEndpoint = (page: number) =>
  `https://api.thecatapi.com/v1/images/search?limit=${LIMIT}&page=${page}&api_key=${CATAPI_KEY}`;

export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export async function fetchImages(page: number = 0): Promise<CatImage[]> {
  const response = await fetch(getEndpoint(page));
  const data = await response.json();

  return data;
}
