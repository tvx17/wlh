/** The renderer sees only this narrow API, never Electron's IPC object. */
export interface AppBridge {
  execute(command: string, payload?: unknown): Promise<unknown>;
}

declare global {
  interface Window {
    appBridge?: AppBridge;
  }
}

/** Execute a registered backend command; rejects outside Electron. */
export async function execute(
  command: string,
  payload?: unknown
): Promise<unknown> {
  if (typeof window === "undefined" || !window.appBridge) {
    throw new Error("The application bridge is only available in Electron");
  }
  return window.appBridge.execute(command, payload);
}
