export interface Choice {
  _id: string;
  name: string;
  price: number;
}

export interface Option {
  _id: string;
  title: string;
  choices: Choice[];
  isMultiple: boolean;
  required: boolean;
}

export interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  options: Option[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  plats: Dish[];
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  _id: string;
  discount: number;
  startDate: string;
  plats: Dish[];
  endDate: string;
  createdAt: string;
  updatedAt: string;
}