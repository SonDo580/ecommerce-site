import { ObjectId } from "mongoose";

interface Shop {
  _id: string | ObjectId;
  name: string;
  email: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  shop: Shop;
  tokens: Tokens;
}
