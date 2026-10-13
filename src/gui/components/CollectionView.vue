<template>
  <div class="page-content collection-page">
    <div class="page-heading"
      ><div
        ><span class="eyebrow">{{ t("studio.collection.eyebrow") }}</span
        ><h1>{{ t(`studio.${kind}`) }}</h1
        ><p class="muted">{{ t(`studio.collection.${kind}Intro`) }}</p></div
      ><q-btn
        v-if="kind === 'projects'"
        color="primary"
        unelevated
        no-caps
        icon="add"
        class="primary-button"
        :label="t('studio.collection.newProject')"
        @click="creating = true"
    /></div>
    <div class="collection-toolbar"
      ><q-input
        v-model="search"
        outlined
        dense
        :placeholder="t('studio.collection.search')"
        :aria-label="t('studio.collection.search')"
        class="search-field"
        ><template #prepend><q-icon name="search" size="20px" /></template
        ><template #append
          ><q-btn
            v-if="search"
            flat
            round
            dense
            icon="close"
            size="sm"
            :aria-label="t('studio.close')"
            @click="search = ''" /></template></q-input
      ><q-select
        v-if="kind !== 'projects'"
        v-model="projectFilter"
        :options="projectOptions"
        emit-value
        map-options
        outlined
        dense
        :label="t('studio.projects')"
        class="project-filter"
    /></div>
    <div class="collection-workspace" :class="{ 'has-detail': selected }">
      <div class="collection-grid">
        <button
          v-for="(item, index) in filtered"
          :key="item.id"
          class="entity-card"
          :class="{ selected: selected?.id === item.id }"
          @click="open(item)"
        >
          <div class="entity-card-top"
            ><div class="entity-art" :class="colors[index % colors.length]"
              ><span v-if="kind === 'characters'" class="entity-initials">{{
                initials(item.name)
              }}</span
              ><q-icon v-else :name="icons[kind]" size="29px" /></div
            ><q-icon name="north_east" size="18px"
          /></div>
          <span v-if="item.status" class="status-badge" :class="item.status">{{
            t(`studio.status.${item.status}`)
          }}</span>
          <h2>{{ item.name }}</h2
          ><p>{{
            item.description ||
            item.projectName ||
            t("studio.dashboard.notStarted")
          }}</p>
          <div class="entity-card-footer"
            ><span v-if="kind === 'projects'"
              >{{
                t("studio.collection.bookCount", {
                  count: studio.books.filter(
                    book => book.project_id === item.id
                  ).length
                })
              }}<span class="dot-divider">·</span
              >{{
                t("studio.collection.characterCount", {
                  count: studio.characters.filter(
                    character => character.project_id === item.id
                  ).length
                })
              }}</span
            ><span v-else>{{ item.projectName }}</span
            ><q-icon name="arrow_forward" size="19px"
          /></div>
        </button>
        <div v-if="!filtered.length" class="empty-state"
          ><q-icon :name="icons[kind]" size="35px" /><h2>{{
            t(
              search ? "studio.collection.noResults" : "studio.collection.empty"
            )
          }}</h2
          ><q-btn
            v-if="projectFilter"
            flat
            no-caps
            :label="t('studio.collection.allProjects')"
            @click="projectFilter = ''"
        /></div>
      </div>
      <ContextPanel
        v-if="selected"
        :title="t('studio.collection.details')"
        class="entity-details"
        @close="selected = null"
      >
        <div class="detail-avatar sage">{{ initials(selected.name) }}</div
        ><h2>{{ selected.name }}</h2
        ><p class="muted">{{ selected.description }}</p>
        <dl v-if="selected.properties" class="property-list"
          ><template v-for="key in ['age', 'occupation']" :key="key"
            ><div v-if="selected.properties[key]"
              ><dt>{{ t(`studio.collection.${key}`) }}</dt
              ><dd>{{ selected.properties[key] }}</dd></div
            ></template
          ></dl
        >
        <h3>{{ t("studio.collection.sceneLinks") }}</h3
        ><router-link
          v-for="scene in linkedScenes"
          :key="scene.id"
          :to="{ path: '/editor', query: { scene: scene.id } }"
          class="linked-scene"
          ><q-icon name="article" size="18px" /><span>{{
            studio.title(scene, locale)
          }}</span
          ><q-icon name="arrow_forward" size="16px" /></router-link
        ><p v-if="!linkedScenes.length" class="muted">{{
          t("studio.collection.noScenes")
        }}</p>
      </ContextPanel>
    </div>
    <q-dialog v-model="creating"
      ><q-card class="project-dialog"
        ><q-form @submit="create"
          ><div class="dialog-heading"
            ><div
              ><span class="eyebrow">FOLIO</span
              ><h2>{{ t("studio.collection.newProject") }}</h2></div
            ><q-btn
              v-close-popup
              flat
              round
              icon="close"
              :aria-label="t('studio.close')" /></div
          ><q-input
            v-model="projectName"
            outlined
            autofocus
            maxlength="120"
            :label="t('studio.collection.projectName')"
            lazy-rules
            :rules="[
              value =>
                Boolean(String(value).trim()) || t('studio.login.required')
            ]" /><q-input
            v-model="projectDescription"
            outlined
            type="textarea"
            maxlength="2000"
            rows="3"
            :label="t('studio.collection.description')" /><p
            class="panel-footnote"
            >{{ t("studio.collection.newProjectHint") }}</p
          ><div class="dialog-actions"
            ><q-btn
              v-close-popup
              flat
              no-caps
              :label="t('studio.collection.cancel')" /><q-btn
              type="submit"
              unelevated
              no-caps
              color="primary"
              :label="t('studio.collection.create')" /></div></q-form></q-card
    ></q-dialog>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudioText } from "@/core/composables/useStudioText";
import { useStudioStore } from "@/core/stores/studio";
import { sceneEntities } from "@/mockData.js";
import ContextPanel from "@/gui/components/ContextPanel.vue";
type Kind = "projects" | "books" | "characters" | "places";
interface Item {
  id: string;
  name: string;
  description: string;
  projectName?: string;
  projectId?: string;
  status?: string;
  properties?: Record<string, unknown>;
}
const props = defineProps<{ kind: Kind }>();
const { t, locale } = useStudioText();
const studio = useStudioStore();
const route = useRoute();
const router = useRouter();
const search = ref("");
const projectFilter = ref(
  typeof route.query.project === "string" ? route.query.project : ""
);
const selected = ref<Item | null>(null);
const creating = ref(false);
const projectName = ref("");
const projectDescription = ref("");
const colors = ["sage", "sand", "rose", "blue"];
const icons = {
  projects: "folder_open",
  books: "auto_stories",
  characters: "people_outline",
  places: "explore"
};
const projectOptions = computed(() => [
  { label: t("studio.collection.allProjects"), value: "" },
  ...studio.allProjects.map(project => ({
    label: project.name,
    value: project.id
  }))
]);
const projectLabel = (id: string) =>
  studio.allProjects.find(project => project.id === id)?.name ?? "";
const items = computed<Item[]>(() => {
  if (props.kind === "projects")
    return studio.allProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description
    }));
  if (props.kind === "books")
    return studio.books.map(book => ({
      id: book.id,
      name: studio.title(book, locale.value),
      description: "",
      projectName: projectLabel(book.project_id),
      projectId: book.project_id,
      status: book.status
    }));
  return (props.kind === "characters" ? studio.characters : studio.locations)
    .filter(entity => entity.is_active)
    .map(entity => ({
      id: entity.id,
      name: entity.name,
      description: entity.description ?? "",
      projectName: projectLabel(entity.project_id),
      projectId: entity.project_id,
      properties: entity.properties
    }));
});
const filtered = computed(() =>
  items.value.filter(
    item =>
      (!projectFilter.value || item.projectId === projectFilter.value) &&
      `${item.name} ${item.description}`
        .toLocaleLowerCase()
        .includes(search.value.toLocaleLowerCase())
  )
);
const linkedScenes = computed(() =>
  studio.scenes.filter(scene =>
    sceneEntities.some(
      link =>
        link.scene_id === scene.id && link.entity_id === selected.value?.id
    )
  )
);
function initials(name: string) {
  return name
    .split(" ")
    .map(word => word[0])
    .slice(0, 2)
    .join("");
}
async function open(item: Item) {
  if (props.kind === "projects")
    await router.push({ path: "/books", query: { project: item.id } });
  else if (props.kind === "books")
    await router.push({ path: "/editor", query: { book: item.id } });
  else selected.value = item;
}
function create() {
  if (!projectName.value.trim()) return;
  studio.addProject(projectName.value, projectDescription.value);
  creating.value = false;
  projectName.value = "";
  projectDescription.value = "";
  search.value = "";
}
</script>
