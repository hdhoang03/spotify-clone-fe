import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import vi from "./locales/vi.json";
import en from "./locales/en.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";

const resources = {
  vi: { translation: vi },
  en: { translation: en },
  ko: { translation: ko },
  ja: { translation: ja }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // Ngôn ngữ mặc định nếu không tìm thấy
    supportedLngs: ["vi", "en", "ko", "ja"],
    interpolation: {
      escapeValue: false // React đã tự động bảo vệ chống XSS
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"] // Lưu cài đặt vào localStorage
    }
  });

export default i18n;
