export interface Order {
  id?: string;
  userId?: string;
  address?: string;
  phoneNumber?: string;
  totalPrice?: number;
  status?: 'pending' | 'shipped' | 'delivered' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}
