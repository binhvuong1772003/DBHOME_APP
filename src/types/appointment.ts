export interface Appointment {
  id: string;
  customer: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  isNew?: boolean;
}
