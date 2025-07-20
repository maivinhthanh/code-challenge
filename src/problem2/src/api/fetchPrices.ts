import axios from 'axios';
import { type TokenPrice } from '../types';

export async function fetchPrices(): Promise<TokenPrice[]> {
  const response = await axios.get('https://interview.switcheo.com/prices.json');
  return response.data;
}
