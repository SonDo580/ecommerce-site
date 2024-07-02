interface Shop {
  _id: string;
  name: string;
  email: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpResult {
  shop: Shop;
  tokens: Tokens;
}
