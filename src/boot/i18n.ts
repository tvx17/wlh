import { defineBoot } from "#q-app";
import { createI18n } from "vue-i18n";
import { createLangDataService, langDataKey } from "@/i18n/lang-data";

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: false,
    messages: {}
  });
  const service = createLangDataService(i18n.global, {
    baseUrl: import.meta.env.BASE_URL
  });
  app.use(i18n);
  app.provide(langDataKey, service);
});
