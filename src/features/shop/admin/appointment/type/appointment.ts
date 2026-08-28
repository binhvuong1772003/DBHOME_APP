import type { AppointmentStatus } from "../constants/appointmentStatus";

export interface AppointmentOptionValue {
  id: string;
  priceAtBooking: number;
  optionValue: {
    id: string;
    name: string;
    duration?: number | null;
    option: {
      id: string;
      name: string;
    };
  };
}

export interface AppointmentService {
  id: string;
  serviceId: string;
  serviceName: string;
  priceAtBooking: number;
  durationMin: number;
  selectedValues: AppointmentOptionValue[];
}

export interface AppointmentAddon {
  id: string;
  priceAtBooking: number;
  addon: {
    id: string;
    name: string;
    duration?: number | null;
  };
}

export interface AppointmentPackageAddon {
  id: string;
  extraPrice: number;
  addon: {
    id: string;
    name: string;
    duration?: number | null;
  };
}

export interface AppointmentPackage {
  id: string;
  priceAtBooking: number;
  package: {
    id: string;
    name: string;
    description?: string | null;
    durationMin?: number | null;
    items: {
      id: string;
      service: {
        id: string;
        name: string;
      };
      optionValue?: {
        id: string;
        name: string;
        option: {
          id: string;
          name: string;
        };
      } | null;
    }[];
  };
  addons: AppointmentPackageAddon[];
}

export interface Appointment {
  id: string;
  staffId: string;
  customer: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  services: AppointmentService[];
  packages: AppointmentPackage[];
  addons: AppointmentAddon[];
  status: AppointmentStatus;
  date: string;
  startTime: string;
  endTime: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  note?: string | null;
  internalNote?: string | null;
  gridRowStart: number;
  gridRowEnd: number;
  isNew?: boolean;
}
