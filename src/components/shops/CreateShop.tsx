import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateShop } from '@/hooks/useCreateShop';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import UploadImage from '../ui/upload-image';
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
const STEPS = [
  'Thông tin cơ bản',
  'Địa chỉ & liên hệ',
  'Giờ hoạt động',
  'Hình ảnh',
];
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const SHOP_TYPES = [
  { value: 'NAIL', label: 'Nail', icon: '💅' },
  { value: 'HAIR', label: 'Hair', icon: '✂️' },
  { value: 'SPA', label: 'Spa', icon: '🧖' },
  { value: 'COMBO', label: 'Combo', icon: '✨' },
];

export const CreateShopForm = () => {
  const {
    form,
    onSubmit,
    isSubmitting,
    apiError,
    step,
    next,
    back,
    totalSteps,
    provinces,
    districts,
    onProvinceChange,
    onDistrictChange,
    provinceCode,
    districtCode,
    logo,
    setLogo,
    background,
    setBackground,
  } = useCreateShop();

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Tabs */}
        <div className="flex">
          {STEPS.map((label, i) => (
            <Button
              key={i}
              type="button"
              onClick={() => {}}
              className={`px-4 py-2 text-sm rounded-full hover:bg-transparent focus:bg-transparent focus-visible:ring-0
                ${
                  step === i
                    ? 'bg-secondary! text-secondary-foreground font-medium hover:bg-secondary!'
                    : 'bg-transparent! text-muted-foreground hover:text-muted-foreground hover:opacity-70'
                }`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Progress */}
        <Progress value={((step + 1) / totalSteps) * 100} className="h-1" />

        {/* Error */}
        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1 */}
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Điền thông tin cơ bản về cửa hàng của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tên cửa hàng{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên cửa hàng"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const slug = e.target.value
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/[^a-z0-9\s-]/g, '')
                                .trim()
                                .replace(/\s+/g, '-');
                              form.setValue('slug', slug);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                              shn.vn/
                            </span>
                            <Input
                              className="rounded-l-none"
                              placeholder="ten-cua-hang"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Loại hình <span className="text-destructive">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-4 gap-3">
                          {SHOP_TYPES.map((t) => (
                            <Button
                              key={t.value}
                              type="button"
                              variant="outline"
                              onClick={() => field.onChange(t.value)}
                              className={`relative flex flex-col items-start gap-2 h-auto py-2 px-2 rounded-lg text-left focus-visible:ring-0
                              ${
                                field.value === t.value
                                  ? '!border-secondary !bg-secondary/10'
                                  : '!bg-card hover:!bg-card hover:opacity-70'
                              }`}
                            >
                              <span className="flex items-center gap-2 w-full">
                                <span
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${field.value === t.value ? 'border-secondary' : 'border-muted-foreground'}`}
                                >
                                  {field.value === t.value && (
                                    <span className="w-2 h-2 rounded-full bg-secondary" />
                                  )}
                                </span>
                                <span className="text-xl">{t.icon}</span>
                                <span className="font-medium text-foreground text-sm">
                                  {t.label}
                                </span>
                              </span>
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Giới thiệu ngắn gọn về shop..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Địa chỉ & Liên hệ</CardTitle>
                  <CardDescription>
                    Giúp khách hàng tìm thấy bạn dễ hơn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={() => (
                        <FormItem>
                          <FormLabel>Tỉnh / Thành phố</FormLabel>
                          <Select
                            value={provinceCode}
                            onValueChange={(code) => {
                              const province = provinces.find(
                                (p) => p.code === code
                              );
                              onProvinceChange(code, province?.name ?? '');
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn tỉnh/thành" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((p) => (
                                <SelectItem key={p.code} value={p.code}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={() => (
                        <FormItem>
                          <FormLabel>Quận / Huyện</FormLabel>
                          <Select
                            value={districtCode}
                            onValueChange={onDistrictChange}
                            disabled={!provinceCode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn quận/huyện" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districts.map((d) => (
                                <SelectItem key={d.code} value={d.code}>
                                  {d.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ cụ thể</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-l-none"
                            placeholder="Số nhà, tên đường..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-l-none"
                              placeholder="Số điện thoại"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-l-none"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Giờ hoạt động</CardTitle>
                  <CardDescription>
                    Thiết lập giờ mở cửa và đóng cửa cho cửa hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="workDays"
                    render={({ field }) => (
                      <div className="flex gap-2 flex-wrap">
                        {DAYS.map((day, i) => {
                          const val = i + 1;
                          const selected = field.value?.includes(val);
                          return (
                            <Button
                              type="button"
                              key={i}
                              onClick={() => {
                                const current = field.value || [];
                                field.onChange(
                                  selected
                                    ? current.filter((d) => d !== val)
                                    : [...current, val]
                                );
                              }}
                              className={`w-10 h-10 rounded-md font-medium border
                                ${
                                  selected
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-muted-foreground border-input hover:bg-muted'
                                }
                              `}
                            >
                              {day}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  />
                  <div className="grid grid-cols-2">
                    <FormField
                      control={form.control}
                      name="openTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ mở cửa</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="closeTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ đóng cửa</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh</CardTitle>
                  <CardDescription>
                    Upload logo và ảnh bìa để shop đẹp hơn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Label>Logo</Label>
                  <UploadImage
                    files={logo ? [logo] : []}
                    onValueChange={(files: File[]) => setLogo(files[0] || null)}
                    maxFiles={1}
                  />
                  <Label>BackGround</Label>
                  <UploadImage
                    files={background ? [background] : []}
                    onValueChange={(files: File[]) =>
                      setBackground(files[0] || null)
                    }
                    maxFiles={1}
                  />
                </CardContent>
              </Card>
            )}
            {/* Actions */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={back}
                disabled={step === 0}
              >
                Previous
              </Button>
              {step < totalSteps - 1 ? (
                <Button type="button" onClick={next}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang tạo...' : 'Create Shop'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
