import { useShopDashBoard } from '@/hooks/useDashBoard';
import mimoAvt from '@/assets/mimoAvt.png';
import defaultBackground from '@/assets/defaultbackground.jpg';
import { useGetAppointment } from '@/hooks/useGetAppointment';
import { useChangeAppointmentStatus } from '@/hooks/useChangeAppointmentStatus';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
export const DashBoard = () => {
  const { shop } = useShopDashBoard();
  const { appointments, preAppointments, refetch } = useGetAppointment();
  const [viewedAppointments, setViewedAppointments] = useState<Set<string>>(
    new Set()
  );
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };
  const { changeAppointmentStatus, isLoading } = useChangeAppointmentStatus();
  const handleStatusChange = async (
    appointmentId: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'IN_PROGRESS' | 'DONE' | 'NO_SHOW'
  ) => {
    try {
      await changeAppointmentStatus(appointmentId, status);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };
  console.log('test', appointments?.[0]?.customer.avatarUrl);

  const handleAppointmentHover = (appointmentId: string) => {
    setViewedAppointments((prev) => new Set(prev).add(appointmentId));
  };
  const formatLocation = (district?: string, city?: string) => {
    const shortDistrict = district
      ?.replace('Quận ', 'Q')
      .replace('Huyện ', 'H');
    const shortCity = city?.replace('Thành phố ', '').replace('Tỉnh ', '');
    return [shortDistrict, shortCity].filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-none">
        {/* Cover */}
        <div className="w-full h-[160px] overflow-hidden rounded-t-lg">
          <img
            src={shop?.coverUrl || defaultBackground}
            alt="Shop cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultBackground;
            }}
          />
        </div>

        {/* Avatar + Info + Buttons cùng hàng */}
        <div className="flex items-end justify-between px-6 py-4 gap-4">
          <div className="flex items-end gap-4">
            {/* Avatar đè lên cover bằng negative margin */}
            <img
              src={shop?.logoUrl || mimoAvt}
              alt="Shop logo"
              className=" w-24 h-24 object-cover border-4 border-white rounded-xl shadow-md -mt-16 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = mimoAvt;
              }}
            />
            <div className="pb-1">
              <h2 className="text-2xl font-bold">{shop?.name}</h2>
              <div className="flex flex-wrap gap-3 mt-1">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {formatLocation(shop?.district, shop?.city)}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-green-600" />
                  {shop?.openTime} - {shop?.closeTime}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline">Chỉnh sửa</Button>
            <Button>+ Lịch hẹn</Button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription className="text-xl font-semibold text-foreground">
                  Lịch hẹn hôm nay
                </CardDescription>
                <Link
                  to="/appointments"
                  className="text-base text-green-600 cursor-pointer"
                >
                  Xem tất cả →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="justify-center px-12 space-y-4">
              {appointments.map((appointment) => (
                <Card
                  className="p-3 flex items-center gap-3 flex-row w-full relative"
                  onMouseEnter={() => handleAppointmentHover(appointment.id)}
                >
                  {appointment?.isNew &&
                    !viewedAppointments.has(appointment.id) && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  <Avatar>
                    <AvatarImage
                      src={appointment?.customer.avatarUrl || undefined}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <AvatarFallback className="bg-purple-500 text-white font-medium text-sm">
                      {appointment?.customer.name
                        .split(' ')
                        .map((word: string) => word[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-x-4">
                    <span>{appointment?.customer.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {appointment.startTime} - {appointment.endTime} -{' '}
                      {formatDate(appointment.date)}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                          appointment?.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : appointment?.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {appointment.status === 'CONFIRMED' && (
                          <div>Đã xác nhận</div>
                        )}
                        {appointment.status === 'CANCELLED' && (
                          <div>Đã hủy</div>
                        )}
                        {appointment.status === 'PENDING' && (
                          <div>Đang chờ</div>
                        )}
                        {appointment.status === 'DONE' && <div>Đã xong</div>}
                        {appointment.status === 'IN_PROGRESS' && (
                          <div>Đang làm</div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          handleStatusChange(appointment.id, 'CONFIRMED');
                        }}
                        disabled={isLoading}
                      >
                        Chấp Nhận
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleStatusChange(appointment.id, 'CANCELLED');
                        }}
                        disabled={isLoading}
                      >
                        Huỷ bỏ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleStatusChange(appointment.id, 'IN_PROGRESS');
                        }}
                        disabled={isLoading}
                      >
                        Đang làm
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleStatusChange(appointment.id, 'DONE');
                        }}
                        disabled={isLoading}
                      >
                        Đã xong
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-grow-2 grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="space-y-0.5">
            <CardHeader>
              <CardDescription className="text-base text-foreground">
                Lịch hẹn hôm nay
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                {appointments.length}
              </CardTitle>
              <CardDescription
                className={`text-base text-foreground ${appointments.length - preAppointments.length > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                + {appointments.length - preAppointments.length} so với hôm qua
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="space-y-0.5">
            <CardHeader>
              <CardDescription className="text-base text-foreground">
                Lịch hẹn hôm nay
              </CardDescription>
              <CardTitle className="text-3xl font-bold">8</CardTitle>
              <CardDescription className="text-base text-foreground">
                {appointments.length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="space-y-0.5">
            <CardHeader>
              <CardDescription className="text-base text-foreground">
                Lịch hẹn hôm nay
              </CardDescription>
              <CardTitle className="text-3xl font-bold">8</CardTitle>
              <CardDescription className="text-base text-foreground">
                +2 hôm qua
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="space-y-0.5">
            <CardHeader>
              <CardDescription className="text-base text-foreground">
                Lịch hẹn hôm nay
              </CardDescription>
              <CardTitle className="text-3xl font-bold">8</CardTitle>
              <CardDescription className="text-base text-foreground">
                +2 hôm qua
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="col-span-1 md:col-span-4"></Card>
        </div>
      </div>
    </div>
  );
};
