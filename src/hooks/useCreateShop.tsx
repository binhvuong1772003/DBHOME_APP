// hooks/useCreateShop.ts
import { useState } from 'react';
import { createShop } from '@/services/shopService';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createShopSchema,
  type CreateShopInput,
} from '@/validations/shopSchema';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { getProvinces, getDistrictsByProvinceCode } from 'vn-provinces';

const STEP_FIELDS: Record<number, (keyof CreateShopInput)[]> = {
  0: ['name', 'slug', 'type'],
  1: ['phone', 'email', 'address', 'city', 'district'],
  2: ['openTime', 'closeTime', 'workDays'],
};

const TOTAL_STEPS = 4;

export const useCreateShop = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const provinces = getProvinces();
  const districts = provinceCode
    ? getDistrictsByProvinceCode(provinceCode)
    : [];

  const form = useForm<CreateShopInput>({
    resolver: zodResolver(createShopSchema),
    defaultValues: {
      name: '',
      slug: '',
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
  const onSubmit = async (data: CreateShopInput) => {
    console.trace('onsubmit called');
    setIsSubmitting(true);
    setApiError(null);
    try {
      await createShop(data, logo, background);
      toast.success('Tạo shop thành công');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        setApiError(error.response?.data?.message || 'Tạo shop thất bại');
      } else {
        setApiError('Tạo shop thất bại');
      }
      toast.error('Tạo shop thất bại');
    } finally {
      setIsSubmitting(false);
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
  };
};
