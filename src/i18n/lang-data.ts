import { readonly, type InjectionKey, type Ref } from "vue";

export interface Messages {
  [key: string]: string | Messages | (string | Messages)[];
}

interface MessageStore {
  locale: Ref<string>;
  setLocaleMessage(locale: string, messages: Messages): void;
}

export interface LangDataHandle {
  ready: Promise<void>;
  release(): void;
}

interface Entry {
  file: string;
  directory: string;
  users: Set<symbol>;
  data?: Messages;
}

const reserved = new Set(["__proto__", "prototype", "constructor"]);

function validateSegment(value: string, label: string) {
  if (
    typeof value !== "string" ||
    !/^[A-Za-z0-9_-]+$/.test(value) ||
    reserved.has(value)
  ) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

function validateMessages(value: unknown): asserts value is Messages {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Translation JSON must contain an object");
  }
  for (const [key, item] of Object.entries(value)) {
    if (reserved.has(key)) throw new Error(`Invalid translation key: ${key}`);
    const items = Array.isArray(item) ? item : [item];
    for (const child of items) {
      if (typeof child !== "string") validateMessages(child);
    }
  }
}

export function createLangDataService(
  store: MessageStore,
  options: { baseUrl?: string; fetcher?: typeof fetch } = {}
) {
  const entries = new Map<string, Entry>();
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const baseUrl = `${(options.baseUrl ?? "/").replace(/\/$/, "")}/locales`;
  let queue: Promise<void> = Promise.resolve();

  // Serialize loads and switches; failures must not block subsequent requests.
  function enqueue(task: () => Promise<void>) {
    const result = queue.then(task);
    queue = result.catch(() => {});
    return result;
  }

  function publish(locale: string) {
    const messages: Messages = {};
    for (const [namespace, entry] of entries) {
      if (entry.data && entry.users.size) messages[namespace] = entry.data;
    }
    store.setLocaleMessage(locale, messages);
  }

  async function read(locale: string, entry: Entry): Promise<Messages> {
    const path = [
      locale,
      ...entry.directory.split("/").filter(Boolean),
      entry.file
    ]
      .map(encodeURIComponent)
      .join("/");
    const url = `${baseUrl}/${path}.json`;
    const response = await fetcher(url);
    if (!response.ok) {
      throw new Error(`Cannot load translations: ${url} (${response.status})`);
    }
    try {
      const data: unknown = await response.json();
      validateMessages(data);
      return data;
    } catch (cause) {
      throw new Error(`Invalid translations: ${url}`, { cause });
    }
  }

  function acquire(
    file: string,
    directory: string,
    namespace: string
  ): LangDataHandle {
    validateSegment(file, "file");
    validateSegment(namespace, "namespace");
    if (typeof directory !== "string") {
      throw new Error("Directory is required; use an empty string for the root");
    }
    if (directory) {
      for (const segment of directory.split("/"))
        validateSegment(segment, "directory");
    }
    const token = Symbol(namespace);
    let released = false;
    let ownedEntry: Entry | undefined;

    function release() {
      if (released) return;
      released = true;
      if (!ownedEntry) return;
      ownedEntry.users.delete(token);
      if (!ownedEntry.users.size && entries.get(namespace) === ownedEntry) {
        delete ownedEntry.data;
        entries.delete(namespace);
        publish(store.locale.value);
      }
    }

    const ready = enqueue(async () => {
      if (released) return;
      let entry = entries.get(namespace);
      if (entry && (entry.file !== file || entry.directory !== directory)) {
        throw new Error(`Namespace already used by another file: ${namespace}`);
      }
      if (!entry) {
        entry = { file, directory, users: new Set() };
        entries.set(namespace, entry);
      }
      ownedEntry = entry;
      entry.users.add(token);
      try {
        if (!entry.data) {
          const data = await read(store.locale.value, entry);
          if (!released) entry.data = data;
        }
        if (!released) publish(store.locale.value);
      } catch (error) {
        release();
        throw error;
      }
    });
    return { ready, release };
  }

  function changeLanguage(locale: string) {
    validateSegment(locale, "locale");
    return enqueue(async () => {
      if (locale === store.locale.value) return;
      const loaded = await Promise.all(
        [...entries].map(async ([namespace, entry]) => ({
          namespace,
          entry,
          data: await read(locale, entry)
        }))
      );
      // No mutation until all requests succeed. Released entries stay removed.
      for (const { namespace, entry, data } of loaded) {
        if (entries.get(namespace) === entry) entry.data = data;
      }
      const previousLocale = store.locale.value;
      publish(locale);
      store.locale.value = locale;
      store.setLocaleMessage(previousLocale, {});
      if (typeof document !== "undefined")
        document.documentElement.lang = locale;
    });
  }

  return { locale: readonly(store.locale), acquire, changeLanguage };
}

export type LangDataService = ReturnType<typeof createLangDataService>;
export const langDataKey: InjectionKey<LangDataService> = Symbol("langData");
