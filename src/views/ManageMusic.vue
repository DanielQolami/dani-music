<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong"></app-upload>
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t("manageMusic.mySongs") }}</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* import store from "@/store"; */
import AppUpload from "@/components/Upload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { auth, songsCollection } from "@/includes/firebase";
import { query, where, getDocs } from "firebase/firestore";

export default {
  name: "ManageMusic",
  components: { AppUpload, CompositionItem },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    // created lifecycle, is the Earliest we can request data

    // query means request data from database
    const q = query(songsCollection, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };

      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(leave); // if we pass in False, it is the same as not calling the next() function
    }
  },
  /* beforeRouteLeave(to, from, next) {
    this.$refs.upload.cancelUploads(); // this is a function inside of AppUpload component
    // references should be used as a last resort
    next();
  }, */
  /* beforeRouteEnter(to, from, next) {
    if (store.state.userLoggedIn) { next(); }
    else { next({ name: "home" }); }
  }, */
};
</script>
