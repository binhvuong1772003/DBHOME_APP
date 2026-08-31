import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import appointmentEN from "./locales/en/appointment.json";
import appointmentVI from "./locales/vi/appointment.json";
import staffEN from "./locales/en/staff.json";
import staffVI from "./locales/vi/staff.json";
import settingsEN from "./locales/en/settings.json";
import settingsVI from "./locales/vi/settings.json";
import serviceEN from "./locales/en/service";
import serviceVI from "./locales/vi/service";
import commonEN from "./locales/en/common.json";
import commonVI from "./locales/vi/common.json";
import workspaceEN from "./locales/en/workspace.json";
import workspaceVI from "./locales/vi/workspace.json";
import workforceEN from "./locales/en/workforce.json";
import workforceVI from "./locales/vi/workforce.json";
import payrollEN from "./locales/en/payroll.json";
import payrollVI from "./locales/vi/payroll.json";
import staffDetailEN from "./locales/en/staffDetail.json";
import staffDetailVI from "./locales/vi/staffDetail.json";
import paymentsEN from "./locales/en/payments.json";
import paymentsVI from "./locales/vi/payments.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { appointment: appointmentEN, staff: staffEN, settings: settingsEN, service: serviceEN, common: commonEN, workspace: workspaceEN, workforce: workforceEN, payroll: payrollEN, staffDetail: staffDetailEN, payments: paymentsEN },
    vi: { appointment: appointmentVI, staff: staffVI, settings: settingsVI, service: serviceVI, common: commonVI, workspace: workspaceVI, workforce: workforceVI, payroll: payrollVI, staffDetail: staffDetailVI, payments: paymentsVI },
  },

  lng: localStorage.getItem("language") ?? "vi",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
