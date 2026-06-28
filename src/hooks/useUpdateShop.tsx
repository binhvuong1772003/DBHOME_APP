import { useEffect, useState } from 'react';
import { updateShop, getShopDetail } from '@/services/shopService';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateShopSchema,
  type UpdateShopInput,
} from '@/validations/shopSchema';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { getProvinces, getDistrictsByProvinceCode } from 'vn-provinces';
const STEP_FIELDS: Record<number, (keyof UpdateShopInput)[]> = {
  0: ['name', 'type'],
  1: ['phone', 'email', 'address', 'city', 'district'],
  2: ['openTime', 'closeTime', 'workDays'],
};

const TOTAL_STEPS = 4;

export const useUpdateShop = () => {
  const navigate = useNavigate();
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const provinces = getProvinces();
  const districts = provinceCode
    ? getDistrictsByProvinceCode(provinceCode)
    : [];

  const form = useForm<UpdateShopInput>({
    resolver: zodResolver(updateShopSchema),
    defaultValues: {
      name: '',
      type: 'NAIL',
      openTime: '08:00',
      closeTime: '20:00',
      workDays: [1, 2, 3, 4, 5, 6],
      phone: '',
      email: '',
      address: '',
      city: '',
      district: '',
      description: '',
    },
  });

  const next = async () => {
    if (step >= TOTAL_STEPS - 1) return;
    const isValid = await form.trigger(STEP_FIELDS[step]);
    if (!isValid) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));
  const onProvinceChange = (code: string, name: string) => {
    setProvinceCode(code);
    setDistrictCode('');
    form.setValue('city', name);
    form.setValue('district', '');
  };
  const onDistrictChange = (code: string) => {
    setDistrictCode(code);
    const district = districts.find((d) => d.code === code);
    form.setValue('district', district?.name ?? '');
  };
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shop = await getShopDetail(shopSlug!);
        console.log(shop);
        const parts = shop.address?.split(', ') ?? [];
        const address = parts[0] ?? '';
        const districtdata = parts[1] ?? '';
        const city = parts[2] ?? '';
        const province = provinces.find((p) => p.name === city);
        if (province) {
          setProvinceCode(province.code);
        }
        if (province) {
          const districtList = getDistrictsByProvinceCode(province.code);
          const district = districtList.find((d) => d.name === districtdata);
          if (district) {
            setDistrictCode(district.code);
          }
        }
        setLogoUrl(shop.logoUrl ?? null);
        setBackgroundUrl(shop.backgroundUrl ?? null);
        form.reset({
          name: shop.name ?? '',
          type: shop.type ?? 'NAIL',
          phone: shop.phone ?? '',
          email: shop.email ?? '',
          address: address ?? '',
          city: city ?? '',
          district: districtdata ?? '',
          description: shop.description ?? '',
          openTime: shop.openTime ?? '08:00',
          closeTime: shop.closeTime ?? '20:00',
          workDays: shop.workDays ?? [1, 2, 3, 4, 5, 6],
        });
      } catch (error) {
        toast.error('Failed to fetch shop');
        console.error('Failed to fetch shop:', error);
      }
    };
    fetchShop();
  }, [shopSlug, provinces, form]);
  const onSubmit = async (data: UpdateShopInput) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await updateShop(shopSlug!, data, logo, background);
      toast.success('Cập nhật shop thành công');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        setApiError(error.response?.data?.message || 'Cập nhật shop thất bại');
      } else {
        setApiError('Cập nhật shop thất bại');
      }
      toast.error('Cập nhật shop thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (files: File[]) => {
    if (files.length === 0) {
      setLogo(null);
      setLogoUrl(null);
    } else {
      setLogo(files[0]);
    }
  };

  const handleBackgroundChange = (files: File[]) => {
    if (files.length === 0) {
      setBackground(null);
      setBackgroundUrl(null);
    } else {
      setBackground(files[0]);
    }
  };

  return {
    form,
    step,
    next,
    back,
    isSubmitting,
    apiError,
    totalSteps: TOTAL_STEPS,
    onSubmit,
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
    shopSlug,
    logoUrl,
    backgroundUrl,
    handleLogoChange,
    handleBackgroundChange,
  };
};
