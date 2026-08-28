import { MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { UpdateShopInput } from "@/validations/shopSchema";
import type { getProvinces, getDistrictsByProvinceCode } from "vn-provinces";

type Province = ReturnType<typeof getProvinces>[number];
type District = ReturnType<typeof getDistrictsByProvinceCode>[number];

const SHOP_TYPES = [
  { value: "NAIL", label: "Nail salon" },
  { value: "SPA", label: "Beauty spa" },
  { value: "HAIR", label: "Hair salon" },
  { value: "COMBO", label: "Salon & spa" },
];

interface BusinessInformationSettingProps {
  form: UseFormReturn<UpdateShopInput>;
  provinces: Province[];
  districts: District[];
  provinceCode: string;
  districtCode: string;
  onProvinceChange: (code: string, name: string) => void;
  onDistrictChange: (code: string) => void;
}

export const BusinessInformationSetting = ({
  form,
  provinces,
  districts,
  provinceCode,
  districtCode,
  onProvinceChange,
  onDistrictChange,
}: BusinessInformationSettingProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <Card
      id="business-information"
      className="scroll-mt-6 gap-0 py-0 shadow-xs"
    >
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">Business Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Legal, contact, and location details for your shop.
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
        <div className="space-y-2">
          <Label htmlFor="business-type">Business type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="business-type" className="w-full">
                  <SelectValue placeholder="Chọn loại hình" />
                </SelectTrigger>
                <SelectContent>
                  {SHOP_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business-phone">Phone</Label>
          <div className="relative">
            <Phone
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="business-phone"
              type="tel"
              className="pl-9"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="business-address">Address</Label>
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Textarea
              id="business-address"
              className="min-h-20 resize-none pl-9"
              {...register("address")}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business-city">City / Province</Label>
          <Select
            value={provinceCode}
            onValueChange={(code) => {
              const province = provinces.find((p) => p.code === code);
              onProvinceChange(code, province?.name ?? "");
            }}
          >
            <SelectTrigger id="business-city" className="w-full">
              <SelectValue placeholder="Chọn tỉnh/thành" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.code} value={p.code}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business-district">District</Label>
          <Select
            value={districtCode}
            onValueChange={onDistrictChange}
            disabled={!provinceCode}
          >
            <SelectTrigger id="business-district" className="w-full">
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.code} value={d.code}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.district && (
            <p className="text-xs text-destructive">
              {errors.district.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
