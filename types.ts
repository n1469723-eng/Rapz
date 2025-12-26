
export enum UserRole {
  BUSINESS = 'BUSINESS',
  COURIER = 'COURIER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  businessName: string;
  origin: Location;
  destination: Location;
  value: number;
  distance: number; // in km
  description: string;
  status: OrderStatus;
  createdAt: number;
  courierId?: string;
  estimatedTime?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}
