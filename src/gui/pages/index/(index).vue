<template>
  <div class="dashboard page-content">
    <div class="page-heading"
      ><div
        ><span class="eyebrow">{{ t("studio.dashboard.eyebrow") }}</span
        ><h1>{{
          t("studio.dashboard.greeting", { name: session.profile?.name })
        }}</h1
        ><p class="muted">{{ t("studio.dashboard.intro") }}</p></div
      ><q-btn
        unelevated
        color="primary"
        no-caps
        icon="edit_note"
        :label="t('studio.dashboard.continue')"
        :to="{ path: '/editor', query: { scene: studio.lastScene } }"
        class="primary-button"
    /></div>
    <div class="stats-strip">
      <div v-for="stat in stats" :key="stat.key" class="stat-item"
        ><span class="stat-icon"><q-icon :name="stat.icon" size="19px" /></span
        ><div
          ><strong>{{ stat.value.toLocaleString(locale) }}</strong
          ><span>{{ t(`studio.dashboard.${stat.key}`) }}</span></div
        ></div
      >
    </div>
    <div class="dashboard-feature-grid">
      <section class="continue-card">
        <div class="continue-copy"
          ><span class="eyebrow">{{ t("studio.dashboard.lastOpen") }}</span
          ><h2>{{
            currentBook
              ? studio.title(currentBook, locale)
              : t("studio.dashboard.heroTitle")
          }}</h2
          ><p>{{ t("studio.dashboard.heroHint") }}</p
          ><div class="continue-meta"
            ><span class="status-dot"></span
            >{{ currentScene ? studio.title(currentScene, locale) : ""
            }}<span class="dot-divider">·</span
            >{{
              t("studio.editorView.words", {
                count: currentScene
                  ? studio.wordCount(studio.sceneText(currentScene.id, locale))
                  : 0
              })
            }}</div
          ><router-link
            :to="{ path: '/editor', query: { scene: studio.lastScene } }"
            class="text-link"
            >{{ t("studio.dashboard.continue")
            }}<q-icon name="arrow_forward" /></router-link
        ></div>
        <div class="book-art" aria-hidden="true"
          ><div class="book-art-lines"></div
          ><div class="book-art-inner"
            ><span>01</span><div class="book-art-orbit"></div
            ><div class="book-art-label">FALKENSTEIN</div
            ><q-icon name="auto_stories" size="23px" /></div
        ></div>
      </section>
      <section class="goal-card"
        ><div class="tw:flex tw:items-center tw:justify-between"
          ><span class="eyebrow">{{ t("studio.dashboard.goal") }}</span
          ><q-icon name="wb_sunny" size="21px" /></div
        ><p class="muted">{{ t("studio.dashboard.goalHint") }}</p
        ><div class="goal-number"
          >{{ studio.writtenToday.toLocaleString(locale)
          }}<span>
            / {{ studio.preferences.dailyGoal.toLocaleString(locale) }}</span
          ></div
        ><q-linear-progress
          :value="goalProgress"
          color="primary"
          track-color="grey-3"
          rounded
          size="6px"
          :aria-label="t('studio.dashboard.goalLabel')"
        /><span class="goal-label">{{ t("studio.dashboard.goalLabel") }}</span
        ><div class="goal-footer"
          ><q-icon
            :name="goalProgress >= 1 ? 'check_circle_outline' : 'spa'"
            size="19px"
          />{{
            t(
              goalProgress >= 1
                ? "studio.dashboard.goalComplete"
                : "studio.dashboard.goalFooter"
            )
          }}</div
        ></section
      >
    </div>
    <section class="quick-section"
      ><div class="section-heading"
        ><div
          ><h2>{{ t("studio.dashboard.quick") }}</h2
          ><p class="muted">{{ t("studio.dashboard.quickHint") }}</p></div
        ></div
      ><div class="quick-grid"
        ><router-link
          v-for="item in quickLinks"
          :key="item.key"
          :to="item.path"
          class="quick-card"
          ><div class="quick-card-top"
            ><span class="quick-icon" :class="item.color"
              ><q-icon :name="item.icon" size="25px" /></span
            ><q-icon name="north_east" size="18px" /></div
          ><h3
            >{{ t(`studio.${item.key}`) }}<span>{{ item.count }}</span></h3
          ><p>{{ t(`studio.dashboard.${item.key}Hint`) }}</p></router-link
        ></div
      ></section
    >
    <section class="desk-section"
      ><div class="section-heading"
        ><h2>{{ t("studio.dashboard.recent") }}</h2
        ><router-link to="/books" class="text-link small"
          >{{ t("studio.dashboard.allBooks")
          }}<q-icon name="arrow_forward" /></router-link></div
      ><div class="desk-books"
        ><router-link
          v-for="(book, index) in studio.books"
          :key="book.id"
          :to="{ path: '/editor', query: { book: book.id } }"
          class="desk-book"
          ><div class="mini-cover" :class="{ sand: index % 2 }"
            ><q-icon name="auto_stories" size="22px" /></div
          ><div class="desk-book-copy"
            ><strong>{{ studio.title(book, locale) }}</strong
            ><span>{{
              studio.allProjects.find(project => project.id === book.project_id)
                ?.name
            }}</span
            ><span class="mobile-book-status">{{
              t(`studio.status.${book.status}`)
            }}</span></div
          ><span class="status-badge" :class="book.status">{{
            t(`studio.status.${book.status}`)
          }}</span
          ><q-icon name="chevron_right" size="20px" /></router-link></div
    ></section>
    <footer class="page-footer"
      ><span>folio<span class="accent">.</span></span
      ><span>{{ t("studio.tagline") }}</span></footer
    >
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useStudioText } from "@/core/composables/useStudioText";
import { useStudioStore } from "@/core/stores/studio";
import { useSessionStore } from "@/core/stores/session";
const { t, locale } = useStudioText();
const studio = useStudioStore();
const session = useSessionStore();
const currentScene = computed(
  () =>
    studio.scenes.find(scene => scene.id === studio.lastScene) ??
    studio.scenes[0]
);
const currentBook = computed(() =>
  studio.books.find(
    book =>
      studio.chapters.find(
        chapter => chapter.id === currentScene.value?.chapter_id
      )?.book_id === book.id
  )
);
const goalProgress = computed(() =>
  Math.min(studio.writtenToday / studio.preferences.dailyGoal, 1)
);
const stats = computed(() => [
  {
    key: "manuscript",
    icon: "format_align_left",
    value: studio.manuscriptWords(locale.value)
  },
  {
    key: "activeProjects",
    icon: "folder_open",
    value: studio.allProjects.length
  },
  { key: "sceneCount", icon: "view_agenda", value: studio.scenes.length },
  { key: "castCount", icon: "people_outline", value: studio.characters.length }
]);
const quickLinks = computed(() => [
  {
    key: "projects",
    path: "/projects",
    icon: "folder_open",
    color: "sage",
    count: studio.allProjects.length
  },
  {
    key: "books",
    path: "/books",
    icon: "auto_stories",
    color: "sand",
    count: studio.books.length
  },
  {
    key: "characters",
    path: "/characters",
    icon: "people_outline",
    color: "rose",
    count: studio.characters.length
  },
  {
    key: "places",
    path: "/places",
    icon: "explore",
    color: "blue",
    count: studio.locations.length
  }
]);
</script>
