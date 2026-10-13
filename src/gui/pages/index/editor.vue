<template>
  <div class="editor-page" :class="{ 'is-focus': focus }">
    <div class="editor-topline"
      ><div class="editor-breadcrumb"
        ><router-link to="/books">{{ t("studio.books") }}</router-link
        ><q-icon name="chevron_right" size="15px" /><span>{{
          book ? studio.title(book, locale) : t("studio.editor")
        }}</span></div
      ><span
        class="save-state"
        :class="{ error: studio.storageError }"
        role="status"
        ><q-icon
          :name="studio.storageError ? 'error_outline' : 'check_circle_outline'"
          size="15px"
        />{{
          t(
            studio.storageError
              ? "studio.editorView.saveError"
              : "studio.editorView.save"
          )
        }}</span
      ></div
    >
    <div class="editor-toolbar"
      ><div class="panel-toggles"
        ><q-btn
          flat
          no-caps
          icon="view_sidebar"
          :label="t('studio.editorView.structure')"
          :aria-expanded="structureOpen && !focus"
          :class="{ 'is-active': structureOpen && !focus }"
          @click="
            focus = false;
            structureOpen = !structureOpen;
          " /><q-btn
          flat
          no-caps
          icon="explore"
          :label="t('studio.editorView.context')"
          :aria-expanded="contextOpen && !focus"
          :class="{ 'is-active': contextOpen && !focus }"
          @click="
            focus = false;
            contextOpen = !contextOpen;
          " /><q-btn
          flat
          no-caps
          icon="notes"
          :label="t('studio.editorView.notes')"
          :aria-expanded="notesOpen && !focus"
          :class="{ 'is-active': notesOpen && !focus }"
          @click="
            focus = false;
            notesOpen = !notesOpen;
          " /></div
      ><div class="editor-tools"
        ><q-btn
          flat
          round
          icon="file_download"
          :aria-label="t('studio.editorView.export')"
          :disable="!scene"
          @click="exportText"
          ><q-tooltip>{{ t("studio.editorView.export") }}</q-tooltip></q-btn
        ><q-btn
          flat
          no-caps
          :icon="focus ? 'close_fullscreen' : 'center_focus_strong'"
          :label="
            t(
              focus ? 'studio.editorView.leaveFocus' : 'studio.editorView.focus'
            )
          "
          :class="{ 'is-active': focus }"
          @click="focus = !focus" /></div
    ></div>
    <div
      class="editor-grid"
      :class="{
        'has-structure': structureOpen && !focus,
        'has-context': contextOpen && !focus
      }"
    >
      <ContextPanel
        v-if="structureOpen && !focus"
        :title="t('studio.editorView.structure')"
        class="structure-panel"
        @close="structureOpen = false"
      >
        <div
          v-for="(chapter, index) in bookChapters"
          :key="chapter.id"
          class="chapter-group"
          ><h3
            ><span>{{ String(index + 1).padStart(2, "0") }}</span
            >{{ studio.title(chapter, locale) }}</h3
          ><button
            v-for="chapterScene in studio.scenes.filter(
              item => item.chapter_id === chapter.id
            )"
            :key="chapterScene.id"
            class="scene-link"
            :class="{ active: scene?.id === chapterScene.id }"
            @click="selectScene(chapterScene.id)"
            ><q-icon
              :name="
                chapterScene.status === 'completed'
                  ? 'check_circle_outline'
                  : 'radio_button_unchecked'
              "
              size="16px"
            /><span>{{ studio.title(chapterScene, locale) }}</span></button
          ></div
        >
        <div v-if="freeScenes.length" class="chapter-group"
          ><h3>{{ t("studio.editorView.freeScenes") }}</h3
          ><button
            v-for="freeScene in freeScenes"
            :key="freeScene.id"
            class="scene-link"
            :class="{ active: scene?.id === freeScene.id }"
            @click="selectScene(freeScene.id)"
            ><q-icon name="lightbulb_outline" size="17px" /><span>{{
              studio.title(freeScene, locale)
            }}</span></button
          ></div
        >
        <div v-if="bookChapters.length" class="structure-footer"
          ><q-linear-progress
            :value="completedCount / Math.max(bookScenes.length, 1)"
            rounded
            color="primary"
            size="4px"
          /><span>{{
            t("studio.editorView.sceneProgress", {
              done: completedCount,
              total: bookScenes.length
            })
          }}</span></div
        >
      </ContextPanel>
      <section v-if="scene" class="manuscript-area">
        <div class="manuscript-sheet"
          ><div class="manuscript-kicker"
            ><span class="eyebrow">{{
              chapter
                ? studio.title(chapter, locale)
                : t("studio.editorView.freeScenes")
            }}</span
            ><span class="status-badge" :class="scene.status">{{
              t(`studio.status.${scene.status}`)
            }}</span></div
          ><h1>{{ studio.title(scene, locale) }}</h1
          ><div class="manuscript-rule"></div
          ><textarea
            v-model="text"
            class="manuscript-input"
            :class="{ serif: studio.preferences.serif }"
            :style="{ fontSize: `${studio.preferences.fontSize}px` }"
            :rows="Math.max(16, text.split('\n').length + 8)"
            :placeholder="t('studio.editorView.placeholder')"
            :aria-label="studio.title(scene, locale)"
            spellcheck="true"
            :lang="textLocale"
          />
        </div>
        <div class="manuscript-status"
          ><span
            >{{ t("studio.editorView.words", { count: studio.wordCount(text) })
            }}<span class="dot-divider">·</span
            >{{
              t("studio.editorView.readingTime", {
                count: Math.ceil(studio.wordCount(text) / 200)
              })
            }}</span
          ><div
            ><q-btn
              flat
              round
              dense
              icon="chevron_left"
              :aria-label="t('studio.editorView.previous')"
              :disable="sceneIndex <= 0"
              @click="step(-1)" /><q-btn
              flat
              round
              dense
              icon="chevron_right"
              :aria-label="t('studio.editorView.next')"
              :disable="sceneIndex >= bookScenes.length - 1 || sceneIndex < 0"
              @click="step(1)" /></div
        ></div>
      </section>
      <section v-else class="empty-state editor-empty"
        ><q-icon name="auto_stories" size="44px" /><h1>{{
          t("studio.editorView.emptyBook")
        }}</h1
        ><p class="muted">{{ t("studio.dashboard.notStarted") }}</p
        ><q-btn outline no-caps to="/books" :label="t('studio.books')"
      /></section>
      <ContextPanel
        v-if="contextOpen && !focus"
        :title="t('studio.editorView.context')"
        class="scene-context"
        @close="contextOpen = false"
      >
        <div class="context-section"
          ><h3>{{ t("studio.editorView.cast") }}</h3
          ><router-link
            v-for="entity in sceneCast"
            :key="entity.id"
            to="/characters"
            class="cast-link"
            ><span class="cast-avatar">{{
              entity.name
                .split(" ")
                .map(part => part[0])
                .slice(0, 2)
                .join("")
            }}</span
            ><span>{{ entity.name }}</span
            ><q-icon name="north_east" size="14px" /></router-link
          ><p v-if="!sceneCast.length" class="muted">{{
            t("studio.editorView.noEntities")
          }}</p></div
        >
        <div class="context-section"
          ><h3>{{ t("studio.editorView.locations") }}</h3
          ><router-link
            v-for="place in scenePlaces"
            :key="place.id"
            to="/places"
            class="linked-scene"
            ><q-icon name="place" size="18px" /><span>{{
              place.name
            }}</span></router-link
          ></div
        >
        <div class="context-section editor-preferences"
          ><h3>{{ t("studio.settings") }}</h3
          ><q-select
            v-model="textLocale"
            :options="[
              { label: t('studio.editorView.german'), value: 'de' },
              { label: t('studio.editorView.english'), value: 'en' }
            ]"
            emit-value
            map-options
            outlined
            dense
            :label="t('studio.editorView.textLanguage')"
          /><label class="slider-label" for="font-size"
            >{{ t("studio.editorView.fontSize")
            }}<span>{{ studio.preferences.fontSize }} px</span></label
          ><q-slider
            id="font-size"
            :model-value="studio.preferences.fontSize"
            @update:model-value="
              value => studio.updatePreferences({ fontSize: value ?? 19 })
            "
            :min="15"
            :max="26"
            :aria-label="t('studio.editorView.fontSize')"
            color="primary"
          /><q-toggle
            :model-value="studio.preferences.serif"
            @update:model-value="
              value => studio.updatePreferences({ serif: Boolean(value) })
            "
            :label="t('studio.editorView.serif')"
            color="primary"
            dense
          /><p class="panel-footnote">{{
            t("studio.editorView.sessionHint")
          }}</p></div
        >
      </ContextPanel>
    </div>
    <ContextPanel
      v-if="notesOpen && !focus && scene"
      :title="t('studio.editorView.notes')"
      class="notes-panel"
      @close="notesOpen = false"
      ><q-input
        v-model="note"
        outlined
        type="textarea"
        autogrow
        :placeholder="t('studio.editorView.noteHint')"
        :aria-label="t('studio.editorView.notes')"
    /></ContextPanel>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { exportFile } from "quasar";
import { useStudioText } from "@/core/composables/useStudioText";
import { useStudioStore } from "@/core/stores/studio";
import { sceneEntities, sceneBlocks } from "@/mockData.js";
import ContextPanel from "@/gui/components/ContextPanel.vue";
const { t, locale } = useStudioText();
const studio = useStudioStore();
const route = useRoute();
const router = useRouter();
const structureOpen = ref(
  typeof window !== "undefined" && window.innerWidth >= 1100
);
const contextOpen = ref(false);
const notesOpen = ref(false);
const focus = ref(false);
const textLocale = ref(studio.preferences.textLocale ?? "de");
watch(textLocale, value => studio.updatePreferences({ textLocale: value }), {
  immediate: true
});
const scene = computed(() => {
  if (typeof route.query.scene === "string")
    return studio.scenes.find(item => item.id === route.query.scene);
  if (typeof route.query.book === "string") {
    const chapterIds = studio.chapters
      .filter(item => item.book_id === route.query.book)
      .map(item => item.id);
    return studio.scenes.find(item =>
      chapterIds.includes(item.chapter_id ?? "")
    );
  }
  return (
    studio.scenes.find(item => item.id === studio.lastScene) ?? studio.scenes[0]
  );
});
const chapter = computed(() =>
  studio.chapters.find(item => item.id === scene.value?.chapter_id)
);
const book = computed(
  () =>
    studio.books.find(
      item => item.id === (chapter.value?.book_id ?? route.query.book)
    ) ?? studio.books[0]
);
const bookChapters = computed(() =>
  studio.chapters
    .filter(item => item.book_id === book.value?.id)
    .sort((a, b) => a.sort_order - b.sort_order)
);
const bookScenes = computed(() =>
  bookChapters.value.flatMap(item =>
    studio.scenes
      .filter(current => current.chapter_id === item.id)
      .sort((a, b) => a.sort_order - b.sort_order)
  )
);
const freeScenes = computed(() =>
  studio.scenes.filter(
    item => !item.chapter_id && item.project_id === book.value?.project_id
  )
);
const completedCount = computed(
  () => bookScenes.value.filter(item => item.status === "completed").length
);
const sceneIndex = computed(() =>
  bookScenes.value.findIndex(item => item.id === scene.value?.id)
);
const text = computed({
  get: () =>
    scene.value ? studio.sceneText(scene.value.id, textLocale.value) : "",
  set: value => {
    if (scene.value) studio.saveDraft(scene.value.id, textLocale.value, value);
  }
});
const note = computed({
  get: () => {
    if (!scene.value) return "";
    if (studio.notes[scene.value.id] !== undefined)
      return studio.notes[scene.value.id] ?? "";
    return sceneBlocks
      .filter(
        block =>
          block.scene_id === scene.value?.id && block.block_type === "note"
      )
      .map(
        block =>
          (block.translations as Record<string, { content: string }>)[
            textLocale.value === "en" ? "en-US" : "de-DE"
          ]?.content ?? ""
      )
      .join("\n");
  },
  set: value => {
    if (scene.value) studio.saveNote(scene.value.id, value);
  }
});
const entityIds = computed(() =>
  sceneEntities
    .filter(link => link.scene_id === scene.value?.id)
    .map(link => link.entity_id)
);
const sceneCast = computed(() =>
  studio.characters.filter(entity => entityIds.value.includes(entity.id))
);
const scenePlaces = computed(() =>
  studio.locations.filter(entity => entityIds.value.includes(entity.id))
);
watch(
  scene,
  value => {
    if (value) studio.setLastScene(value.id);
  },
  { immediate: true }
);
async function selectScene(id: string) {
  await router.replace({ path: "/editor", query: { scene: id } });
}
async function step(delta: number) {
  const target = bookScenes.value[sceneIndex.value + delta];
  if (target) await selectScene(target.id);
}
function exportText() {
  if (!scene.value) return;
  exportFile(
    `${scene.value.api_name}-${textLocale.value}.txt`,
    `${studio.title(scene.value, textLocale.value)}\n\n${text.value}`,
    { mimeType: "text/plain;charset=utf-8" }
  );
}
</script>
