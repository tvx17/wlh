import { useI18n } from "vue-i18n";

// The App scope owns this namespace; child views do not pin extra copies.
export function useStudioText() {
  const { t, locale } = useI18n({ useScope: "global" });
  return { t, locale };
}
