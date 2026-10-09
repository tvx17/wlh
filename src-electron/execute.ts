export type CommandHandler = (payload: unknown) => unknown;

/** Central backend entry. Add only explicitly supported commands to the map. */
export function createExecutor(commands: ReadonlyMap<string, CommandHandler>) {
  return async function execute(
    command: unknown,
    payload?: unknown
  ): Promise<unknown> {
    if (typeof command !== "string" || !command.trim()) {
      throw new Error("A non-empty command name is required");
    }
    const handler = commands.get(command);
    if (!handler) throw new Error(`Unknown backend command: ${command}`);
    // Each command validates its own payload and returns IPC-cloneable data.
    return handler(payload);
  };
}

/** Hash navigation is allowed; other documents and frames are not. */
export function isTrustedDocument(actualUrl: string, expectedUrl: string) {
  try {
    const actual = new URL(actualUrl);
    const expected = new URL(expectedUrl);
    actual.hash = "";
    expected.hash = "";
    return actual.href === expected.href;
  } catch {
    return false;
  }
}
