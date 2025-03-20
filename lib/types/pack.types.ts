export interface PackItem {
  name: string;
  quantity: number;
  _id?: string;
}

export interface PackAddOn {
  name: string;
  price: number;
  _id?: string;
}

export interface Pack {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  items: PackItem[];
  addOns: PackAddOn[];
  popularity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}