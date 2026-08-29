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

export interface ServiceListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  category?: string;
  sort?: "RECENT" | "NAME_ASC" | "NAME_DESC" | "PRICE_ASC" | "PRICE_DESC" | "DURATION_ASC" | "DURATION_DESC";
}
export interface ServiceListMeta { total: number; page: number; limit: number; totalPages: number; counts: { all: number; active: number; inactive: number; categories: number } }
export interface ServiceListResponse { items: Service[]; meta: ServiceListMeta }

export interface CreateServiceInput {
  name: string;
  category?: string;
  description?: string;
  basePrice?: number;
  durationMin: number;
  sortOrder: number;
  isActive: boolean;
  imageUrl?: string;
  options: {
    name: string;
    isRequired: boolean;
    sortOrder: number;
    values: {
      name: string;
      price: number;
      duration?: number;
    }[];
  }[];
}
