export type User = {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  phone: string;
  role: string;
};

export type Favorite = {
  id: number;
  userId: number;
  productId: number;
};
