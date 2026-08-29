import { useStaffList } from "@/features/shop/admin/appointment/hooks/useStaffList";
import { useTimeSlot } from "@/features/shop/admin/appointment/hooks/useTimeSlot";
import { useGetAppointment } from "@/features/shop/admin/appointment/hooks/useGetAppointment";
import { statusColors } from "@/constants/statusColor";
const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export function Scheduler() {
  const {
    staff,
    isLoading: staffLoading,
    apiError: staffError,
  } = useStaffList();
  const { timeSlots, isLoading: timeSlotLoading } = useTimeSlot();
  const {
    appointments,
    preAppointments,
    error,
    isLoading,
    date,
    setDate,
    refetch: fetchAppointments,
  } = useGetAppointment();
  console.log(appointments);
  console.log(staff);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-auto max-h-[640px]">
      <div
        className="grid min-w-max"
        style={{ gridTemplateColumns: `72px repeat(${staff.length}, 220px)` }}
      >
        {/* header row */}
        <div className="sticky top-0 z-[3] bg-card border-b border-[#e2d9c7] border-r border-[#e2d9c7] p-2.5 px-3 flex items-center gap-2" />
        {staff.map((member, index) => (
          <div
            key={member.id}
            className="sticky top-0 z-[2] bg-card border-b border-[#e2d9c7] border-r border-[#e2d9c7] p-2.5 px-3 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
              {member?.nickname?.charAt(0)}
            </span>
            <span className="text-[13px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {member?.nickname}
            </span>
          </div>
        ))}
        <div
          className={`col-[1] row-[2/span_${timeSlots.length}] grid border-r border-[#e2d9c7]`}
          style={{ gridTemplateRows: `repeat(${timeSlots.length}, 16px)` }}
        >
          {timeSlots.map((time) => (
            <div
              key={time}
              className="row-span-2 border-b border-[#e2d9c7] text-right pr-2.5 pt-0.5 text-[11px] text-[#767065] tabular-nums"
            >
              {time}
            </div>
          ))}
        </div>
        {/* <div
            className="col-[1] my-0.5 mx-1 p-1.5 px-2 rounded-md border bg-[#eaf3ec] border-[#bbd8c6] text-[#24513a] text-[11.5px] leading-[1.35] overflow-hidden cursor-pointer"
            style={{ gridRow: "1 / 3" }}
          >
            <span className="font-bold tabular-nums block">8:00 - 9:00 AM</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
              Michael Johnson | +1-200-300-1037
            </span>
          </div> */}
        {staff.map((member, index) => (
          <div key={member.id}>
            <div
              className={`relative grid row-[2/span_${timeSlots.length}] border-r border-[#e2d9c7]`}
              style={{
                gridColumn: index + 2,

                gridTemplateRows: `repeat(${timeSlots.length}, 32px)`,
              }}
            >
              {Array.from({ length: timeSlots.length }).map((_, i) => (
                <div key={i} className="border-b border-[#e2d9c7]" />
              ))}
              {appointments
                .filter((appointment) => appointment.staffId === member.userId)
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`my-0.5 mx-1 p-2 rounded-lg border text-xs leading-tight overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-center ${
                      statusColors[appointment.status] ??
                      "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                    style={{
                      gridRow: `${appointment.gridRowStart} / ${appointment.gridRowEnd}`,
                      gridColumn: 1,
                    }}
                  >
                    <span className="font-semibold tabular-nums">
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis mt-0.5 opacity-90">
                      {appointment.customer.name}
                    </span>
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis mt-0.5 opacity-90">
                      {appointment.services
                        .map((service: any) => service.serviceName)
                        .join(", ")}
                    </span>
                    {appointment.customer.phone && (
                      <span className="text-[10px] opacity-70 mt-0.5">
                        {appointment.customer.phone}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
