import { ServiceEditorForm } from "./ServiceEditorForm";
import { useCreateService } from "../hooks/useCreateService";

export function CreateServiceForm() {
  const controller = useCreateService();
  return <ServiceEditorForm mode="create" form={controller.form} onSubmit={controller.onSubmit} isSubmitting={controller.isSubmitting} imageFiles={controller.imageFiles} setImageFiles={controller.setImageFiles} apiError={controller.apiError} onCancel={controller.onCancel} />;
}
