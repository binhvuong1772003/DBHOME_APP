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

export interface ServiceCategory {
  id: string;
  shopId?: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  serviceCount?: number;
}

export interface ServiceCategoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sort?: "RECENT" | "NAME_ASC" | "NAME_DESC" | "ORDER_ASC";
}

export interface ServiceCategoryListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ServiceCategoryListResponse {
  items: ServiceCategory[];
  meta: ServiceCategoryListMeta;
}

export interface Service {
  id: string;
  shopId: string;
  categoryId?: string;
  category?: ServiceCategory | null;
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
  categoryId?: string;
  description?: string;
  basePrice?: number;
  durationMin: number;
  sortOrder: number;
  isActive: boolean;
  imageUrl?: string;
  options: {
    id?: string;
    name: string;
    isRequired: boolean;
    sortOrder: number;
    values: {
      id?: string;
      name: string;
      price: number;
      duration?: number;
    }[];
  }[];
}
