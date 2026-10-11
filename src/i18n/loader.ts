type Messages = { [key: string]: string | Messages };
type Resource = { path: string; users: number; messages: Messages };
function validate(value: unknown): asserts value is Messages {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Translation JSON must be an object");
  for (const [key, child] of Object.entries(value)) {
    if (["__proto__", "constructor", "prototype"].includes(key))
      throw new Error("Invalid translation key");
    if (typeof child !== "string") validate(child);
  }
}
export class TranslationLoader {
  private locale = "de-de";
  private resources = new Map<string, Resource>();
  private queue: Promise<unknown> = Promise.resolve();
  constructor(
    private publish: (locale: string, messages: Messages) => void,
    private activate: (locale: string) => void,
    private fetchJson: (url: string) => Promise<unknown> = async url => {
      if (typeof window !== "undefined" && window.desktop)
        return window.desktop.loadTranslation(url);
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `Translation loading failed: ${url} (${response.status})`
        );
      return response.json();
    }
  ) {}
  private run<T>(action: () => Promise<T> | T): Promise<T> {
    const result = this.queue.then(action);
    this.queue = result.catch(() => undefined);
    return result;
  }
  private async load(locale: string, path: string): Promise<Messages> {
    if (
      !/^[a-z]{2,3}-[a-z0-9]{2,8}$/.test(locale) ||
      !/^[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/.test(path)
    )
      throw new Error("Invalid locale or path");
    const messages = await this.fetchJson(`i18n/${locale}/${path}.json`);
    validate(messages);
    return messages;
  }
  private rebuild() {
    const root: Messages = {};
    for (const [namespace, resource] of this.resources) {
      const parts = namespace.split(".");
      let target = root;
      for (const part of parts.slice(0, -1)) {
        target[part] ??= {};
        target = target[part] as Messages;
      }
      target[parts.at(-1)!] = resource.messages;
    }
    this.publish(this.locale, root);
  }
  acquire(namespace: string, path: string): Promise<() => Promise<void>> {
    return this.run(async () => {
      if (
        !/^[a-z][a-z0-9_-]*(?:\.[a-z][a-z0-9_-]*)*$/.test(namespace) ||
        namespace
          .split(".")
          .some(part =>
            ["__proto__", "constructor", "prototype"].includes(part)
          )
      )
        throw new Error("Invalid namespace");
      for (const key of this.resources.keys()) {
        if (key.startsWith(`${namespace}.`) || namespace.startsWith(`${key}.`))
          throw new Error("Overlapping namespaces");
      }
      const existing = this.resources.get(namespace);
      if (existing && existing.path !== path)
        throw new Error("Namespace already assigned");
      if (existing) existing.users++;
      else
        this.resources.set(namespace, {
          path,
          users: 1,
          messages: await this.load(this.locale, path)
        });
      this.rebuild();
      let released = false;
      return () =>
        this.run(() => {
          if (released) return;
          released = true;
          const resource = this.resources.get(namespace);
          if (resource && --resource.users === 0)
            this.resources.delete(namespace);
          this.rebuild();
        });
    });
  }
  setLocale(locale: string): Promise<void> {
    return this.run(async () => {
      if (locale === this.locale) return;
      const loaded = await Promise.all(
        [...this.resources].map(
          async ([namespace, resource]) =>
            [namespace, await this.load(locale, resource.path)] as const
        )
      );
      const previous = this.locale;
      for (const [namespace, messages] of loaded)
        this.resources.get(namespace)!.messages = messages;
      this.locale = locale;
      this.rebuild();
      this.activate(locale);
      this.publish(previous, {});
    });
  }
}
