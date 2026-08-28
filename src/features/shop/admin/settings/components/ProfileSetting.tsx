import { useMemo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateShopInput } from "@/validations/shopSchema";

interface ProfileSettingProps {
  currentShop: { name?: string; slug?: string; logoUrl?: string | null } | null;
  form: UseFormReturn<UpdateShopInput>;
  logo: File | null;
  logoUrl: string | null;
  onLogoChange: (files: File[]) => void;
}

export const ProfileSetting = ({
  currentShop,
  form,
  logo,
  logoUrl,
  onLogoChange,
}: ProfileSettingProps) => {
  const {
    register,
    formState: { errors },
  } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarPreview = useMemo(
    () => (logo ? URL.createObjectURL(logo) : (logoUrl ?? undefined)),
    [logo, logoUrl],
  );

  return (
    <Card id="shop-profile" className="scroll-mt-6 gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">Thông tin Shop</CardTitle>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin cơ bản của cửa hàng.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-5 py-6 sm:px-6">
        <section
          aria-labelledby="shop-avatar-heading"
          className="flex flex-col gap-5 sm:flex-row sm:items-center"
        >
          <Avatar className="size-24 rounded-xl border border-border shadow-xs">
            <AvatarImage
              src={avatarPreview}
              alt={currentShop?.name ?? "Shop"}
              className="rounded-xl object-cover"
            />

            <AvatarFallback className="rounded-xl bg-primary/10 text-xl font-bold text-primary">
              {currentShop?.name?.charAt(0).toUpperCase() ?? "Mimo"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 id="shop-avatar-heading" className="text-sm font-semibold">
              Shop avatar
            </h2>
            <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
              JPG, PNG or WEBP. Maximum file size: 5MB.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onLogoChange(Array.from(e.target.files ?? []))}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera aria-hidden="true" />
                Change photo
              </Button>
              {logo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => {
                    onLogoChange([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </section>

        <Separator />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="shop-name">Shop name</Label>
            <Input id="shop-name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shop-slug">Shop slug</Label>
            <div className="flex rounded-lg border border-input bg-muted/40 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
              <span className="flex items-center border-r border-border px-3 text-xs text-muted-foreground">
                /shops/
              </span>
              <Input
                id="shop-slug"
                value={currentShop?.slug ?? ""}
                disabled
                readOnly
                className="border-0 shadow-none focus-visible:ring-0 disabled:opacity-100"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Slug không thể thay đổi sau khi tạo shop.
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="shop-description">Description</Label>
            <Textarea
              id="shop-description"
              className="min-h-28 resize-none"
              {...register("description")}
            />
            <p className="text-xs text-muted-foreground">
              A short description shown on your booking page.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shop-email">Email</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="shop-email"
                type="email"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shop-phone">Phone</Label>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="shop-phone"
                type="tel"
                className="pl-9"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
