<template>
  <div class="login-page">
    <section class="login-story">
      <div class="brand-link"
        ><span class="brand-icon"
          ><q-icon name="auto_stories" size="21px" /></span
        ><span class="wordmark">folio<span>.</span></span></div
      >
      <div class="login-story-copy"
        ><span class="eyebrow">{{ t("studio.login.eyebrow") }}</span
        ><h1>{{ t("studio.login.headline") }}</h1
        ><p>{{ t("studio.login.subline") }}</p></div
      >
      <div class="paper-composition" aria-hidden="true">
        <div class="paper-back"></div>
        <div class="paper-front"
          ><div class="paper-kicker">FOLIO / 01</div
          ><div class="paper-title"
            >{{ t("studio.books") }}<br /><em>{{
              t("studio.tagline")
            }}</em></div
          ><div class="paper-rule"></div><div class="paper-line long"></div
          ><div class="paper-line"></div><div class="paper-line long"></div
          ><div class="paper-line short"></div
          ><span class="paper-flower">✳</span></div
        >
        <div class="paper-stamp"><q-icon name="edit" size="23px" /></div>
      </div>
      <div class="login-story-footer"
        ><q-icon name="spa" size="18px" /><span>{{
          t("studio.login.quote")
        }}</span></div
      >
    </section>
    <section class="login-form-side">
      <div class="login-top"
        ><span class="login-mobile-brand wordmark">folio<span>.</span></span
        ><LanguageSwitch
      /></div>
      <div class="login-form-wrap">
        <span class="small-symbol"
          ><q-icon name="waving_hand" size="23px"
        /></span>
        <h2>{{ t("studio.login.welcome") }}</h2
        ><p class="muted login-intro">{{ t("studio.login.intro") }}</p>
        <q-form @submit="submit" class="login-form">
          <q-input
            v-model="email"
            outlined
            type="email"
            autocomplete="username"
            :label="t('studio.login.email')"
            lazy-rules
            :rules="[
              value =>
                /[^\s@]+@[^\s@]+\.[^\s@]+/.test(String(value)) ||
                t('studio.login.invalidEmail')
            ]"
          />
          <q-input
            v-model="password"
            outlined
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :label="t('studio.login.password')"
            lazy-rules
            :rules="[value => Boolean(value) || t('studio.login.required')]"
          >
            <template #append
              ><q-btn
                flat
                round
                dense
                :icon="showPassword ? 'visibility_off' : 'visibility'"
                :aria-label="
                  t(
                    showPassword
                      ? 'studio.login.hidePassword'
                      : 'studio.login.showPassword'
                  )
                "
                @click="showPassword = !showPassword"
            /></template>
          </q-input>
          <q-btn
            type="submit"
            unelevated
            no-caps
            color="primary"
            class="primary-button full-width"
            :label="t('studio.login.submit')"
            icon-right="arrow_forward"
          />
        </q-form>
        <div class="login-divider"
          ><span>{{ t("studio.login.or") }}</span></div
        >
        <q-btn
          outline
          no-caps
          class="full-width demo-button"
          :label="t('studio.login.demo')"
          icon="auto_stories"
          @click="enterDemo"
        />
        <p class="login-note">{{ t("studio.login.demoNote") }}</p>
      </div>
      <div class="login-benefits"
        ><span><q-icon name="check" />{{ t("studio.login.feature1") }}</span
        ><span
          ><q-icon name="check" />{{ t("studio.login.feature2") }}</span
        ></div
      >
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudioText } from "@/core/composables/useStudioText";
import { useSessionStore } from "@/core/stores/session";
import LanguageSwitch from "@/gui/components/LanguageSwitch.vue";
const { t } = useStudioText();
const session = useSessionStore();
const route = useRoute();
const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
async function enter(name: string, address: string) {
  session.signIn(name, address);
  password.value = "";
  const next = route.query.next;
  await router.push(
    typeof next === "string" &&
      next.startsWith("/") &&
      !next.startsWith("//") &&
      !next.startsWith("/login")
      ? next
      : "/"
  );
}
async function submit() {
  await enter(email.value.split("@")[0] ?? "Alex", email.value);
}
async function enterDemo() {
  await enter("Alex", "");
}
</script>
