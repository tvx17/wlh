<template>
  <q-btn
    flat
    no-caps
    dense
    class="language-button"
    :label="locale.toUpperCase()"
    :aria-label="t('studio.language')"
    :loading="busy"
  >
    <q-menu class="folio-menu">
      <q-list>
        <q-item
          v-for="language in languages"
          :key="language.id"
          clickable
          v-close-popup
          @click="switchTo(language.id)"
        >
          <q-item-section>{{ language.name }}</q-item-section>
          <q-item-section side v-if="locale === language.id"
            ><q-icon name="check" size="18px"
          /></q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <span v-if="failed" role="alert" class="language-error">{{
    t("studio.languageError")
  }}</span>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useLangData } from "@/core/composables/useLangData";
import { writeStored } from "@/core/app/storage";
const { t, locale, changeLanguage } = useLangData();
const busy = ref(false);
const failed = ref(false);
const languages = [
  { id: "de", name: "Deutsch" },
  { id: "en", name: "English" }
];
async function switchTo(id: string) {
  busy.value = true;
  failed.value = false;
  try {
    await changeLanguage(id);
    writeStored("folio.locale", id);
    document.documentElement.lang = id;
  } catch {
    failed.value = true;
  } finally {
    busy.value = false;
  }
}
</script>
