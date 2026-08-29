import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { getProvinces, getDistrictsByProvinceCode } from "vn-provinces";
import {
  updateShopSchema,
  type UpdateShopInput,
  type BusinessHourItem,
} from "@/validations/shopSchema";
import {
  getShopDetail,
  updateShop,
  getBusinessHours,
  updateBusinessHours,
  uploadShopLogo,
  uploadShopBanner,
} from "@/services/shopService";
import { useShopContext } from "@/context/ShopContext";
import { useTranslation } from "react-i18next";

export const WEEK_DAYS: { value: number; label: string }[] = [
  { value: 1, label: "Thứ Hai" },
  { value: 2, label: "Thứ Ba" },
  { value: 3, label: "Thứ Tư" },
  { value: 4, label: "Thứ Năm" },
  { value: 5, label: "Thứ Sáu" },
  { value: 6, label: "Thứ Bảy" },
  { value: 0, label: "Chủ Nhật" },
];

const defaultBusinessHours = (): BusinessHourItem[] =>
  WEEK_DAYS.map(({ value }) => ({
    dayOfWeek: value,
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: value === 0,
  }));

const sortByDayOfWeek = (hours: BusinessHourItem[]) =>
  [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

const areBusinessHoursEqual = (a: BusinessHourItem[], b: BusinessHourItem[]) =>
  JSON.stringify(sortByDayOfWeek(a)) === JSON.stringify(sortByDayOfWeek(b));

export const useSetting = () => {
  const { t } = useTranslation("settings");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { currentShop, setCurrentShop } = useShopContext();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHourItem[]>(
    defaultBusinessHours(),
  );
  const [initialBusinessHours, setInitialBusinessHours] = useState<
    BusinessHourItem[]
  >(defaultBusinessHours());
  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const provinces = getProvinces();
  const districts = provinceCode
    ? getDistrictsByProvinceCode(provinceCode)
    : [];

  const form = useForm<UpdateShopInput>({
    resolver: zodResolver(updateShopSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
    },
  });

  useEffect(() => {
    if (!shopSlug) return;
    let cancelled = false;

    const fetchSettings = async () => {
      setLoading(true);
      try {
        const [shop, hours] = await Promise.all([
          getShopDetail(shopSlug),
          getBusinessHours(shopSlug),
        ]);
        if (cancelled) return;

        setCurrentShop(shop);

        form.reset({
          name: shop.name ?? "",
          description: shop.description ?? "",
          email: shop.email ?? "",
          phone: shop.phone ?? "",
          type: shop.type ?? undefined,
          address: shop.address ?? "",
          city: shop.city ?? "",
          district: shop.district ?? "",
        });

        setLogoUrl(shop.logoUrl ?? null);
        setCoverUrl(shop.coverUrl ?? null);

        const province = provinces.find((p) => p.name === shop.city);
        if (province) {
          setProvinceCode(province.code);
          const district = getDistrictsByProvinceCode(province.code).find(
            (d) => d.name === shop.district,
          );
          if (district) setDistrictCode(district.code);
        }

        const mergedHours = WEEK_DAYS.map(({ value }) => {
          const found = (hours as BusinessHourItem[]).find(
            (h) => h.dayOfWeek === value,
          );
          return (
            found ?? {
              dayOfWeek: value,
              openTime: "09:00",
              closeTime: "18:00",
              isClosed: value === 0,
            }
          );
        });
        setBusinessHours(mergedHours);
        setInitialBusinessHours(mergedHours);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast.error(t("toast.loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  const onProvinceChange = (code: string, name: string) => {
    setProvinceCode(code);
    setDistrictCode("");
    form.setValue("city", name, { shouldDirty: true });
    form.setValue("district", "", { shouldDirty: true });
  };

  const onDistrictChange = (code: string) => {
    setDistrictCode(code);
    const district = districts.find((d) => d.code === code);
    form.setValue("district", district?.name ?? "", { shouldDirty: true });
  };

  const updateBusinessHourDay = (
    dayOfWeek: number,
    patch: Partial<BusinessHourItem>,
  ) => {
    setBusinessHours((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day,
      ),
    );
  };

  const handleLogoChange = (files: File[]) => {
    setLogo(files[0] ?? null);
  };

  const handleBackgroundChange = (files: File[]) => {
    setBackground(files[0] ?? null);
  };

  const isBusinessHoursDirty = !areBusinessHoursEqual(
    businessHours,
    initialBusinessHours,
  );
  const hasImageChanges = !!logo || !!background;
  const isDirty =
    form.formState.isDirty || isBusinessHoursDirty || hasImageChanges;

  const saveSettings = async (values: UpdateShopInput) => {
    if (!shopSlug || !isDirty) return;

    setIsSaving(true);
    try {
      const tasks: Promise<unknown>[] = [];
      let logoUploaded = false;
      let newLogoUrl: string | null = null;

      if (form.formState.isDirty) {
        const dirtyFields = form.formState.dirtyFields as Partial<
          Record<keyof UpdateShopInput, boolean>
        >;
        const changedValues = (
          Object.keys(dirtyFields) as (keyof UpdateShopInput)[]
        ).reduce((acc, key) => {
          if (dirtyFields[key]) acc[key] = values[key] as never;
          return acc;
        }, {} as Partial<UpdateShopInput>);

        if (Object.keys(changedValues).length > 0) {
          tasks.push(updateShop(shopSlug, changedValues));
        }
      }

      if (isBusinessHoursDirty) {
        const changedDays = businessHours.filter((day) => {
          const original = initialBusinessHours.find(
            (item) => item.dayOfWeek === day.dayOfWeek,
          );
          return JSON.stringify(original) !== JSON.stringify(day);
        });

        if (changedDays.length > 0) {
          tasks.push(updateBusinessHours(shopSlug, changedDays));
        }
      }

      if (logo) {
        tasks.push(
          uploadShopLogo(shopSlug, logo).then((res) => {
            newLogoUrl =
              (res?.data?.logoUrl as string | null | undefined) ?? null;
            logoUploaded = true;
            setLogoUrl(newLogoUrl);
          }),
        );
      }

      if (background) {
        tasks.push(
          uploadShopBanner(shopSlug, background).then((res) => {
            const uploadedCoverUrl =
              (res?.data?.coverUrl as string | null | undefined) ?? null;
            setCoverUrl(uploadedCoverUrl);
          }),
        );
      }

      await Promise.all(tasks);

      form.reset(values);
      setInitialBusinessHours(businessHours);
      setLogo(null);
      setBackground(null);
      if (currentShop) {
        setCurrentShop({
          ...currentShop,
          name: values.name ?? currentShop.name,
          ...(logoUploaded ? { logoUrl: newLogoUrl } : {}),
        });
      }
      toast.success(t("toast.success"));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || t("toast.updateError"),
        );
      } else {
        toast.error(t("toast.updateError"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = form.handleSubmit(saveSettings, (validationErrors) => {
    console.error("Settings validation failed:", validationErrors);
    toast.error(t("toast.validation"));

    const firstInvalidField = Object.keys(validationErrors)[0];
    if (firstInvalidField) {
      document
        .querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
        ?.focus();
    }
  });

  return {
    form,
    loading,
    isSaving,
    isDirty,
    handleSave,
    businessHours,
    updateBusinessHourDay,
    weekDays: WEEK_DAYS,
    currentShop,
    provinces,
    districts,
    provinceCode,
    districtCode,
    onProvinceChange,
    onDistrictChange,
    logo,
    background,
    logoUrl,
    coverUrl,
    handleLogoChange,
    handleBackgroundChange,
  };
};
