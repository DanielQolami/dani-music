<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content px-3">
          <h1 class="font-bold text-5xl mb-5" dir="auto">
            {{ $t("homeView.listen") }}
          </h1>
          <p class="w-full md:w-8/12 mx-auto" dir="auto">
            {{ $t("homeView.introductionMsg") }}
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
        alt="img-1"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon.right="'headphones-alt'"
        >
          <span class="card-title">{{ $t("homeView.songsHeader") }}</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <app-song-item
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          ></app-song-item>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
// @ is an alias to /src
import { songsCollection } from "@/includes/firebase";
import {
  doc,
  getDoc,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import AppSongItem from "@/components/SongItem.vue";

export default {
  name: "HomeView",
  components: { AppSongItem },
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequest: false,
    };
  },
  async created() {
    this.getSongs();

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;

      let documentSnapshots;

      if (this.songs.length) {
        const lastDoc = await getDoc(
          doc(songsCollection, this.songs[this.songs.length - 1].docID)
        );
        documentSnapshots = await getDocs(
          query(
            songsCollection,
            orderBy("modified_name"),
            startAfter(lastDoc),
            limit(this.maxPerPage)
          )
        );
      } else {
        documentSnapshots = await getDocs(
          query(
            songsCollection,
            orderBy("modified_name"),
            limit(this.maxPerPage)
          )
        );
      }

      documentSnapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
  },
};
</script>
