interface Shop {
  _id: string;
  name: string;
  email: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpResponse {
  shop: Shop;
  tokens: Tokens;
}
