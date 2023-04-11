<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase md:text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1 text-sm md:text-base">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">{{
              $t("header.about")
            }}</router-link>
          </li>
          <li v-if="!userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
              >{{ $t("header.authBtn") }}</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t("header.manage")
              }}</router-link>
            </li>
            <li>
              <a href="#" class="px-2 text-white" @click.prevent="signout">{{
                $t("header.logout")
              }}</a>
            </li>
          </template>
        </ul>
        <ul class="flex flex-row mt-1 ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">{{
              currentLocale
            }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
    }),
    currentLocale() {
      return this.$i18n.locale === "fa" ? "پارسی" : "English";
    },
  },
  methods: {
    ...mapMutations(["toggleAuthModal"]),
    /* toggleAuthModal() {
      this.$store.commit("toggleAuthModal");
    }, */
    signout() {
      this.$store.dispatch("signout");
      /* doing the redirecting in the action, without DEPENDENCY CYCLE.
      this.$store.dispatch("signout", {
        router: this.$router,
        route: this.$route
      }) 
      Since the logic doesn't effect the state, we won't use it in signout-action.
      */

      // console.log(this.$route);
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === "fa" ? "en" : "fa";
    },
  },
};
</script>

<style>
/* no-active doesn't exist. we wrote that so that the Music link doesn't change color when active. */
</style>
