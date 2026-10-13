import { execute } from "@/core/app/bridge";

/** Browser HTTP and packaged Electron share the language service API. */
export const translationFetch: typeof fetch = async (input, init) => {
  if (typeof window === "undefined" || !window.appBridge)
    return fetch(input, init);
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  const pathname = new URL(url, window.location.href).pathname;
  const resource = pathname.slice(pathname.lastIndexOf("/locales/") + 1);
  const messages = await execute("translations.read", resource);
  return Response.json(messages);
};
