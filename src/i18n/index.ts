import { createI18n } from "vue-i18n";
import { TranslationLoader } from "./loader";
export const i18n = createI18n({
  legacy: false,
  locale: "de-de",
  fallbackLocale: false,
  messages: {} as Record<string, Record<string, string>>
});
export const translations = new TranslationLoader(
  (locale, messages) => i18n.global.setLocaleMessage(locale, messages),
  locale => {
    i18n.global.locale.value = locale;
  }
);
