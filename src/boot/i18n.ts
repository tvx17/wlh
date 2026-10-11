import { defineBoot } from "#q-app";
import { i18n, translations } from "@/i18n";
export default defineBoot(async ({ app }) => {
  await translations.acquire("app", "app");
  app.use(i18n);
});
