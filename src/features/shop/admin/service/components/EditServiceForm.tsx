import { ServiceEditorForm } from "./ServiceEditorForm";
import { useEditService } from "../hooks/useEditService";

export function EditServiceForm() {
  const controller = useEditService();
  return <ServiceEditorForm mode="edit" form={controller.form} onSubmit={controller.onSubmit} isSubmitting={controller.isSubmitting} imageFiles={controller.imageFiles} setImageFiles={controller.setImageFiles} existingImageUrl={controller.service?.imageUrl} apiError={controller.apiError} isLoading={controller.isLoading} loadError={controller.loadError} onRetry={() => void controller.onRetry()} onReset={controller.onReset} onCancel={controller.onCancel} />;
}
