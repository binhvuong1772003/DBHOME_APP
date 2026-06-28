export interface ServiceOption {
  id: string;
  serviceId: string;
  name: string;
  isRequired: boolean;
  sortOrder: number;
  values?: OptionValue[];
}
export interface OptionValue {
  id: string;
  name: string;
  price: number;
  duration: number;
}
export interface Service {
  id: string;
  shopId: string;
  categoryId?: string;
  name: string;
  description?: string;
  basePrice?: number;
  durationMin: number;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  options?: ServiceOption[];
}
