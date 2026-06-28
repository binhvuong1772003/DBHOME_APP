import axiosClient from '@/api/axiosClient';
export const getAppointmentByDay = async (
  shopSlug: string,
  params: { date: string }
) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/appointments/day`,
    { params }
  );
  console.log(`/api/shops/${shopSlug}/appointments/day`, { params });
  return res.data;
};
export const changeStatus = async (
  shopSlug: string,
  appointmentId: string,
  status: string
) => {
  const { data: res } = await axiosClient.put(
    `/api/shops/${shopSlug}/appointments/${appointmentId}`,
    { status }
  );
  return res.data;
};
