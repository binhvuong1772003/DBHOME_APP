import { useState } from 'react';
import { createService } from '@/services/serviceService';
import { useForm } from 'react-hook-form';
import { createServiceSchema } from '@/validations/serviceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateServiceInput } from '@/validations/serviceSchema';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
export const useCreateService = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const form = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: '',
      basePrice: 0,
      durationMin: 0,
      isActive: true,
      sortOrder: 0,
      description: '',
      options: [],
    },
  });
  const onSubmit = async (data: CreateServiceInput) => {
    if (!shopSlug) {
      setApiError('Shop không tồn tại');
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      await createService(shopSlug, data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setApiError(error.response?.data?.message || 'Tạo dịch vụ thất bại');
      } else {
        setApiError('Tạo dịch vụ thất bại');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    apiError,
  };
};
