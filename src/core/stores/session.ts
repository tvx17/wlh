import { computed, ref } from "vue";
import { defineStore } from "pinia";

interface Profile {
  name: string;
  email: string;
}

export const useSessionStore = defineStore("session", () => {
  const profile = ref<Profile | null>(null);
  try {
    const stored: unknown = JSON.parse(
      sessionStorage.getItem("folio.session") ?? "null"
    );
    if (
      stored &&
      typeof stored === "object" &&
      "name" in stored &&
      "email" in stored &&
      typeof stored.name === "string" &&
      typeof stored.email === "string"
    ) {
      profile.value = { name: stored.name, email: stored.email };
    }
  } catch {
    // A blocked browser storage still permits a session in memory.
  }
  const signedIn = computed(() => profile.value !== null);
  function signIn(name: string, email: string) {
    profile.value = { name: name.trim() || "Alex", email };
    try {
      sessionStorage.setItem("folio.session", JSON.stringify(profile.value));
    } catch {
      // Keep the current in-memory session.
    }
  }
  function signOut() {
    profile.value = null;
    try {
      sessionStorage.removeItem("folio.session");
    } catch {
      // The in-memory session has already been cleared.
    }
  }
  return { profile, signedIn, signIn, signOut };
});
