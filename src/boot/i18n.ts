import { defineBoot } from "#q-app";
import { createI18n } from "vue-i18n";
import { createLangDataService, langDataKey } from "@/core/app/lang-data";
import { translationFetch } from "@/core/app/translation-fetch";
import { readStored } from "@/core/app/storage";

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: readStored<string>("folio.locale", "de"),
    fallbackLocale: false,
    messages: {}
  });
  const service = createLangDataService(i18n.global, {
    baseUrl: import.meta.env.BASE_URL,
    fetcher: translationFetch
  });
  app.use(i18n);
  app.provide(langDataKey, service);
});
