import { getCurrentScope, inject, onScopeDispose } from "vue";
import { useI18n } from "vue-i18n";
import { langDataKey, type LangDataHandle } from "@/i18n/lang-data";

/** Call synchronously in setup; also works in layouts and reusable elements. */
export function useLangData() {
  if (!getCurrentScope())
    throw new Error("useLangData requires a Vue setup scope");
  const providedService = inject(langDataKey);
  if (!providedService)
    throw new Error("Language data service is not installed");
  const service = providedService;
  const composer = useI18n({ useScope: "global" });
  const t = composer.t.bind(composer);
  const te = composer.te.bind(composer);
  const handles = new Map<string, Set<LangDataHandle>>();
  let disposed = false;

  function unloadLangData(namespace: string) {
    const group = handles.get(namespace);
    const handle = group?.values().next().value;
    if (!handle) return;
    handle.release();
    group?.delete(handle);
    if (!group?.size) handles.delete(namespace);
  }

  async function loadLangData(
    file: string,
    directory: string,
    namespace: string
  ) {
    if (disposed)
      throw new Error("Language data scope has already been disposed");
    const handle = service.acquire(file, directory, namespace);
    let group = handles.get(namespace);
    if (!group) {
      group = new Set();
      handles.set(namespace, group);
    }
    group.add(handle);
    try {
      await handle.ready;
    } catch (error) {
      handle.release();
      group.delete(handle);
      if (!group.size && handles.get(namespace) === group) {
        handles.delete(namespace);
      }
      throw error;
    }
  }

  onScopeDispose(() => {
    disposed = true;
    for (const group of handles.values()) {
      for (const handle of group) handle.release();
    }
    handles.clear();
  });

  return {
    t,
    te,
    locale: service.locale,
    loadLangData,
    unloadLangData,
    changeLanguage: service.changeLanguage
  };
}
