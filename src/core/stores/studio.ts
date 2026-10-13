import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  books,
  chapters,
  characters,
  locations,
  projects,
  scenes,
  sceneBlocks
} from "@/mockData.js";
import { readStored, writeStored } from "@/core/app/storage";

interface Draft {
  text: string;
  updatedAt: string;
}
interface AddedProject {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}
interface Preferences {
  dailyGoal: number;
  fontSize: number;
  serif: boolean;
  textLocale: "de" | "en";
}
export const useStudioStore = defineStore("studio", () => {
  const drafts = ref(readStored<Record<string, Draft>>("folio.drafts", {}));
  const notes = ref(readStored<Record<string, string>>("folio.notes", {}));
  const addedProjects = ref(readStored<AddedProject[]>("folio.projects", []));
  const preferences = ref(
    readStored<Preferences>("folio.preferences", {
      dailyGoal: 500,
      fontSize: 19,
      serif: true,
      textLocale: "de"
    })
  );
  const lastScene = ref(readStored<string>("folio.lastScene", "scene-1"));
  const storageError = ref(false);
  const allProjects = computed(() => [...projects, ...addedProjects.value]);
  const activeScenes = scenes.filter(scene => scene.is_active);

  function title(
    item: { translations: object; api_name: string },
    locale: string
  ) {
    const translations = item.translations as Record<
      string,
      { title?: string }
    >;
    return (
      translations[locale === "en" ? "en-US" : "de-DE"]?.title ||
      translations["de-DE"]?.title ||
      item.api_name
    );
  }
  function draftKey(sceneId: string, locale: string) {
    return `${sceneId}:${locale}`;
  }
  function sceneText(sceneId: string, locale: string) {
    const draft = drafts.value[draftKey(sceneId, locale)];
    if (draft) return draft.text;
    return sceneBlocks
      .filter(
        block =>
          block.scene_id === sceneId &&
          block.is_active &&
          block.block_type !== "note"
      )
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(block => {
        const translations = block.translations as Record<
          string,
          { content?: string }
        >;
        return (
          translations[locale === "en" ? "en-US" : "de-DE"]?.content ||
          translations["de-DE"]?.content ||
          ""
        );
      })
      .join("\n\n");
  }
  function wordCount(text: string) {
    return text.trim() ? text.trim().split(/\s+/u).length : 0;
  }
  function saveDraft(sceneId: string, locale: string, text: string) {
    drafts.value[draftKey(sceneId, locale)] = {
      text,
      updatedAt: new Date().toISOString()
    };
    storageError.value = !writeStored("folio.drafts", drafts.value);
  }
  function setLastScene(id: string) {
    lastScene.value = id;
    writeStored("folio.lastScene", id);
  }
  function saveNote(sceneId: string, text: string) {
    notes.value[sceneId] = text;
    storageError.value = !writeStored("folio.notes", notes.value);
  }
  function updatePreferences(values: Partial<Preferences>) {
    preferences.value = { ...preferences.value, ...values };
    writeStored("folio.preferences", preferences.value);
  }
  function addProject(name: string, description: string) {
    const id = `project-${crypto.randomUUID()}`;
    addedProjects.value.push({
      id,
      name: name.trim(),
      description: description.trim(),
      is_active: true
    });
    storageError.value = !writeStored("folio.projects", addedProjects.value);
    return id;
  }
  const writtenToday = computed(() =>
    Object.values(drafts.value)
      .filter(
        draft =>
          new Date(draft.updatedAt).toDateString() === new Date().toDateString()
      )
      .reduce((sum, draft) => sum + wordCount(draft.text), 0)
  );
  function manuscriptWords(locale: string) {
    return activeScenes.reduce(
      (sum, scene) => sum + wordCount(sceneText(scene.id, locale)),
      0
    );
  }
  return {
    drafts,
    notes,
    preferences,
    lastScene,
    storageError,
    allProjects,
    books,
    chapters,
    characters,
    locations,
    scenes: activeScenes,
    title,
    sceneText,
    wordCount,
    saveDraft,
    setLastScene,
    saveNote,
    updatePreferences,
    addProject,
    writtenToday,
    manuscriptWords
  };
});
