import { onScopeDispose, ref } from "vue";
import { translations } from "@/i18n";
export function useTranslationResource(namespace: string, path: string) {
  const ready = ref(false);
  const error = ref<unknown>();
  let disposed = false;
  let release: (() => Promise<void>) | undefined;
  const loaded = translations
    .acquire(namespace, path)
    .then(async cleanup => {
      release = cleanup;
      if (disposed) await cleanup();
      else ready.value = true;
    })
    .catch(reason => {
      error.value = reason;
    });
  onScopeDispose(() => {
    disposed = true;
    if (release) void release();
  });
  return { ready, error, loaded };
}
