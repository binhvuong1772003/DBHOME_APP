import { useState } from "react";
import { createService } from "@/services/serviceService";
import { useForm } from "react-hook-form";
import { createServiceSchema } from "@/validations/serviceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateServiceInput } from "@/validations/serviceSchema";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
export const useCreateService = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("service");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const form = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      categoryId: "",
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
    navigate(`/shops/${shopSlug}/admin/services`);
  };
  const onSubmit = async (data: CreateServiceInput) => {
    if (!shopSlug) {
      setApiError(t("editor.loadError"));
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      const formData = new FormData();
      // The API expects an ObjectId when a category is selected; omit the
      // optional field rather than sending the empty Select placeholder.
      formData.append("data", JSON.stringify({ ...data, categoryId: data.categoryId || undefined }));
      if (imageFiles[0]) {
        formData.append("image", imageFiles[0]);
      }
      await createService(shopSlug, formData);
      form.reset();
      setImageFiles([]);
      navigate(`/shops/${shopSlug}/admin/services`);
    } catch (error) {
      setApiError(getApiErrorMessage(error, t("editor.saveError")));
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
