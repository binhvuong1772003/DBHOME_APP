import { useState } from "react";
import { createService } from "@/services/serviceService";
import { useForm } from "react-hook-form";
import { createServiceSchema } from "@/validations/serviceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateServiceInput } from "@/validations/serviceSchema";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
export const useCreateService = () => {
  const navigate = useNavigate();
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const form = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      basePrice: 0,
      durationMin: 0,
      isActive: true,
      sortOrder: 0,
      description: "",
      options: [],
    },
  });
  const onCancel = () => {
    form.reset();
    navigate(`/shops/${shopSlug}/services`);
  };
  const onSubmit = async (data: CreateServiceInput) => {
    if (!shopSlug) {
      setApiError("Shop không tồn tại");
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (imageFiles[0]) {
        formData.append("image", imageFiles[0]);
      }
      await createService(shopSlug, formData);
      form.reset();
      setImageFiles([]);
      navigate(`/shops/${shopSlug}/services`);
    } catch (error) {
      if (error instanceof AxiosError) {
        setApiError(error.response?.data?.message || "Tạo dịch vụ thất bại");
      } else {
        setApiError("Tạo dịch vụ thất bại");
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
    imageFiles,
    setImageFiles,
    onCancel,
  };
};
