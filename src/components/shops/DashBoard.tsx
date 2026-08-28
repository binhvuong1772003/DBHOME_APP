import { useShopDashBoard } from "@/hooks/dashboard/useDashboard";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { AppointmentStatusDropdown } from "@/components/common/AppointmentStatusDropdown";
export const DashBoard = () => {
  const {
    newIds,
    clearNew,
    handleAddService,
    handleConfirm,
    handleReject,
    appointments,
    isLoadingAppointments,
    isChanging,
    topCustomers,
    isLoadingTopCustomer,
    errorTopCustomer,
    countServices,
    isLoadingCountService,
    errorCountService,
    weeklyIncomeByDay,
    isLoadingWeeklyIncome,
    errorWeeklyIncome,
    weeklyTotal,
    weekRange,
    today,
    sortApointments,
    handleChangeStatus,
  } = useShopDashBoard();
  console.log(appointments);
  return (
    <div>
      <div className="grid grid-cols-3 gap-0 w-full">
        <div className="bg-popover p-5 border-r-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Khách hàng chi tiêu cao
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {topCustomers?.map((customer) => (
              <div
                key={
                  customer.id?.$oid ?? customer.id?.toString?.() ?? customer.id
                }
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-medium text-sm">
                    <img
                      src={customer.avatarUrl}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.totalSpent.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 border-r-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Doanh Thu Tuần
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-10">
            <div className="w-2/3">
              <p className="text-sm text-gray-500">{weekRange}</p>
              <p className="text-4xl font-bold text-gray-900">
                {weeklyTotal.toLocaleString("vi-VN")} VNĐ
              </p>
              <p className="text-sm text-green-600 font-semibold mt-1">
                14% Increase
              </p>
            </div>

            <div className="w-1/3 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyIncomeByDay}>
                  <XAxis dataKey="day" hide />
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString("vi-VN") + " VNĐ",
                      "Doanh thu",
                    ]}
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  />
                  <Bar
                    dataKey="income"
                    className="fill-accent-foreground"
                    radius={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Store Overview
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 text-base">
                Tổng dịch vụ của Shop
              </span>
              <span className="font-bold text-gray-900 text-lg">
                {countServices}
              </span>
            </div>

            <Button
              className="w-full bg-brand hover:bg-brand-hover text-background rounded-lg py-2 px-4 flex items-center justify-center gap-2 font-medium text-sm transition-colors"
              onClick={handleAddService}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Service
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-10 mt-10 mx-12">
        <Card className="col-span-2 !gap-4 !py-5 justify-between min-h-60 bg-gradient-to-r from-gradient-card-start via-gradient-card-mid to-gradient-card-end">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-background/85">
              Lịch hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-base text-background/60">
              {today?.fullDate
                ? new Date(today.fullDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : ""}
            </CardTitle>
            <CardDescription className="text-4xl font-bold text-background/85">
              {today?.income?.toLocaleString("vi-VN")} VNĐ
            </CardDescription>
          </CardContent>
          <Separator className="!h-[1.5px] bg-background/30" />
          <CardFooter className="grid grid-cols-4 gap-4 w-full text-center">
            <div>
              <div className="text-xs text-background/70">Sold</div>
              <div className="text-lg font-bold text-background">224</div>
            </div>
            <div>
              <div className="text-xs text-background/70">Returns</div>
              <div className="text-lg font-bold text-background">12</div>
            </div>
            <div>
              <div className="text-xs text-background/70">Picked</div>
              <div className="text-lg font-bold text-background">210</div>
            </div>
            <div>
              <div className="text-xs text-background/70">In Transit</div>
              <div className="text-lg font-bold text-background">112</div>
            </div>
          </CardFooter>
        </Card>
        <Card className="col-span-1 min-h-48 bg-gradient-to-r from-gradient-card-start via-gradient-card-mid to-gradient-card-end"></Card>
        <Card className="col-span-1 min-h-48 bg-gradient-to-r from-gradient-card-start via-gradient-card-mid to-gradient-card-end"></Card>
        <Card className="col-span-1 min-h-48 bg-gradient-to-r from-gradient-card-start via-gradient-card-mid to-gradient-card-end"></Card>
      </div>
      <div className="mt-10 mx-12">
        <Card className="overflow-hidden rounded-3xl shadow-sm border-foreground/8 gap-0">
          <CardHeader className="flex flex-row items-center justify-between !p-0 border-b border-foreground/30">
            <CardTitle className="text-lg font-bold px-6 mb-4">
              Lịch hẹn hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 max-h-[340px] overflow-y-auto overflow-x-hidden">
            {sortApointments.map((appointment, i) => {
              const isPending = appointment.status === "PENDING";
              const isNew = newIds.has(appointment.id);

              return (
                <div key={appointment.id}>
                  <div
                    className={`grid items-center px-8 py-5 gap-4 transition-colors border-1-[3px] [grid-template-columns:120px_2fr_2fr_1fr_100px] ${isPending ? "bg-brand-light border-brand" : "border-transparent"} ${isNew ? "animate-blink" : ""}`}
                  >
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{
                        color: isPending ? "var(--brand-dark)" : undefined,
                      }}
                    >
                      {appointment.startTime} - {appointment.endTime}
                    </span>

                    <div className="flex items-center gap-3">
                      <img
                        src={appointment.customer.avatarUrl}
                        alt="Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {appointment.customer.name}
                      </span>
                    </div>

                    <span className="text-sm text-muted-foreground truncate">
                      {appointment.services
                        .map((s) => s.serviceName)
                        .join(", ")}
                    </span>

                    <span className="text-sm font-semibold text-foreground">
                      {appointment.totalPrice?.toLocaleString("vi-VN")}đ
                    </span>

                    <div className="flex items-center justify-end gap-2">
                      {isPending ? (
                        <>
                          <Button
                            className="text-xs px-4 h-9 rounded-xl border border-foreground/15 bg-background text-muted-foreground hover:text-foreground hover:bg-brand-light transition-colors font-medium"
                            onClick={handleReject(appointment.id)}
                          >
                            Từ chối
                          </Button>
                          <Button
                            className="text-xs px-4 h-9 rounded-xl text-white font-semibold transition-colors hover:bg-brand/90 bg-brand"
                            onClick={handleConfirm(appointment.id)}
                          >
                            Xác nhận
                          </Button>
                        </>
                      ) : (
                        <AppointmentStatusDropdown
                          status={appointment.status}
                          disabled={isChanging}
                          onStatusChange={(status) =>
                            handleChangeStatus(appointment.id, status)
                          }
                        />
                      )}
                    </div>
                  </div>

                  {i < sortApointments.length - 1 && (
                    <Separator className="!h-[1px] bg-foreground/6 mx-8" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
