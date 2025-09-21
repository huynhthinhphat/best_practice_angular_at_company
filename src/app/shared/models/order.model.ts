export interface Order {
  id?: string;
  userId?: string;
  username?: string;
  address?: string;
  phoneNumber?: string;
  quantity?: number;
  totalPrice?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
