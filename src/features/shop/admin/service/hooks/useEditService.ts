import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getServiceById, updateService } from "@/services/serviceService";
import type { Service } from "@/types/service";
import { createServiceSchema, type CreateServiceInput } from "@/validations/serviceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function useEditService() {
  const navigate = useNavigate();
  const { t } = useTranslation("service");
  const { shopSlug = "", serviceId = "" } = useParams<{ shopSlug: string; serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const form = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: { name: "", categoryId: "", basePrice: 0, durationMin: 60, sortOrder: 0, isActive: true, description: "", options: [] },
  });

  const load = useCallback(async () => {
    if (!shopSlug || !serviceId) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await getServiceById(shopSlug, serviceId);
      setService(result);
      form.reset({
        name: result.name,
        categoryId: result.categoryId ?? "",
        description: result.description ?? "",
        basePrice: result.basePrice ?? 0,
        durationMin: result.durationMin,
        sortOrder: result.sortOrder,
        isActive: result.isActive,
        imageUrl: result.imageUrl,
        options: (result.options ?? []).map((option) => ({
          id: option.id,
          name: option.name,
          isRequired: option.isRequired,
          sortOrder: option.sortOrder,
          values: (option.values ?? []).map((value) => ({ id: value.id, name: value.name, price: value.price, duration: value.duration ?? 0 })),
        })),
      });
      setImageFiles([]);
    } catch (requestError) {
      setLoadError(getApiErrorMessage(requestError, t("editor.loadError")));
    } finally {
      setIsLoading(false);
    }
  }, [form, serviceId, shopSlug, t]);

  useEffect(() => { void load(); }, [load]);

  const onSubmit = async (data: CreateServiceInput) => {
    if (!shopSlug || !serviceId || isSubmitting) return;
    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload = { ...data, categoryId: data.categoryId || undefined, imageUrl: data.imageUrl || undefined };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (imageFiles[0]) formData.append("image", imageFiles[0]);
      const saved = await updateService(shopSlug, serviceId, formData);
      setService(saved);
      navigate(`/shops/${shopSlug}/admin/services`);
    } catch (requestError) {
      setApiError(getApiErrorMessage(requestError, t("editor.saveError")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => navigate(`/shops/${shopSlug}/admin/services`);
  const onReset = () => {
    if (!service) return;
    form.reset({ name: service.name, categoryId: service.categoryId ?? "", description: service.description ?? "", basePrice: service.basePrice ?? 0, durationMin: service.durationMin, sortOrder: service.sortOrder, isActive: service.isActive, imageUrl: service.imageUrl, options: (service.options ?? []).map((option) => ({ id: option.id, name: option.name, isRequired: option.isRequired, sortOrder: option.sortOrder, values: (option.values ?? []).map((value) => ({ id: value.id, name: value.name, price: value.price, duration: value.duration ?? 0 })) })) });
    setImageFiles([]);
    setApiError(null);
  };

  return { form, service, isLoading, loadError, onRetry: load, onSubmit, isSubmitting, apiError, imageFiles, setImageFiles, onCancel, onReset };
}
