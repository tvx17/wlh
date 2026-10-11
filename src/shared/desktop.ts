export const ECHO_CHANNEL = "wlh:echo";
export const TRANSLATION_CHANNEL = "wlh:translation";
export interface EchoResponse {
  text: string;
  receivedAt: string;
}
export interface DesktopApi {
  loadTranslation(url: string): Promise<unknown>;
  echo(text: string): Promise<EchoResponse>;
}
declare global {
  interface Window {
    desktop?: DesktopApi;
  }
}
