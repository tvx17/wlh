<template>
  <div class="studio-shell">
    <header class="studio-header">
      <router-link to="/" class="brand-link" :aria-label="t('studio.overview')"
        ><span class="brand-icon"
          ><q-icon name="auto_stories" size="21px" /></span
        ><span class="wordmark">folio<span>.</span></span></router-link
      >
      <nav class="desktop-nav" :aria-label="t('studio.workspace')">
        <router-link
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          :class="{ active: route.path === item.path }"
          >{{ t(`studio.${item.key}`) }}</router-link
        >
      </nav>
      <div class="header-actions">
        <LanguageSwitch />
        <q-btn
          flat
          round
          dense
          icon="tune"
          :aria-label="t('studio.settings')"
          :aria-expanded="settingsOpen"
          @click="settingsOpen = !settingsOpen"
          :class="{ 'is-active': settingsOpen }"
        />
        <q-btn
          flat
          round
          class="profile-button"
          :aria-label="session.profile?.name"
        >
          <span>{{ session.profile?.name.slice(0, 1).toUpperCase() }}</span>
          <q-menu class="folio-menu"
            ><q-list
              ><q-item
                ><q-item-section
                  ><strong>{{ session.profile?.name }}</strong
                  ><q-item-label caption>{{
                    t("studio.localDemo")
                  }}</q-item-label></q-item-section
                ></q-item
              ><q-separator /><q-item clickable v-close-popup @click="logout"
                ><q-item-section avatar><q-icon name="logout" /></q-item-section
                ><q-item-section>{{
                  t("studio.logout")
                }}</q-item-section></q-item
              ></q-list
            ></q-menu
          >
        </q-btn>
      </div>
    </header>
    <div class="shell-body" :class="{ 'with-preferences': settingsOpen }">
      <main id="main-content"><router-view /></main>
      <ContextPanel
        v-if="settingsOpen"
        :title="t('studio.settings')"
        class="preferences-panel"
        @close="settingsOpen = false"
      >
        <h3>{{ t("studio.preferences.headline") }}</h3>
        <p class="muted">{{ t("studio.preferences.hint") }}</p>
        <q-input
          :model-value="studio.preferences.dailyGoal"
          @update:model-value="setGoal"
          type="number"
          min="1"
          max="100000"
          outlined
          :label="t('studio.preferences.goal')"
        />
        <p class="panel-footnote">{{ t("studio.preferences.local") }}</p>
      </ContextPanel>
    </div>
    <nav class="mobile-nav" :aria-label="t('studio.workspace')">
      <router-link
        v-for="item in mobileNavigation"
        :key="item.path"
        :to="item.path"
        :class="{ active: route.path === item.path }"
        ><q-icon :name="item.icon" size="21px" /><span>{{
          t(`studio.${item.key}`)
        }}</span></router-link
      >
    </nav>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudioText } from "@/core/composables/useStudioText";
import { useSessionStore } from "@/core/stores/session";
import { useStudioStore } from "@/core/stores/studio";
import LanguageSwitch from "@/gui/components/LanguageSwitch.vue";
import ContextPanel from "@/gui/components/ContextPanel.vue";
const { t } = useStudioText();
const session = useSessionStore();
const studio = useStudioStore();
const route = useRoute();
const router = useRouter();
const settingsOpen = ref(false);
const navigation = [
  { path: "/", key: "overview", icon: "space_dashboard" },
  { path: "/projects", key: "projects", icon: "folder_open" },
  { path: "/books", key: "books", icon: "auto_stories" },
  { path: "/characters", key: "characters", icon: "people_outline" }
];
const mobileNavigation = [
  ...navigation.slice(0, 3),
  { path: "/editor", key: "editor", icon: "edit_note" },
  navigation[3]!
];
function setGoal(value: string | number | null) {
  const goal = Number(value);
  if (Number.isFinite(goal) && goal >= 1 && goal <= 100000)
    studio.updatePreferences({ dailyGoal: Math.round(goal) });
}
async function logout() {
  session.signOut();
  await router.push("/login");
}
</script>
