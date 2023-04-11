<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto pl-2 flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="newSong(song)"
        >
          <i
            class="fa"
            :class="{ 'fa-play': !playingSong, 'fa-pause': playingSong }"
          ></i>
        </button>
        <div class="z-50 text-left ml-4 md:ml-8">
          <!-- Song Info -->
          <div class="text-xl md:text-3xl font-bold">
            {{ song.modified_name }}
          </div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc("song.comment_count", song.comment_count, {
              count: song.comment_count,
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="userLoggedIn"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Comment Sorting -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";
import {
  doc,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "Song",
  data() {
    return {
      song: {},
      schema: {
        comment: "required|min:1",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "Please wait! Your comment is being submitted.",
      comments: [],
      sort: "1", // 1: latest to oldest, 2: oldest to latest
    };
  },
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
      currentSong: (state) => state.player.currentSong,
    }),
    ...mapGetters(["playing"]),
    sortedComments() {
      /* return this.comments.sort(); Computed property Can't change data DIRECTLY! */
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      }); // slice returns a new array based on old array
    },
    playingSong() {
      if (this.currentSong === this.song && this.playing) {
        return true;
      }

      return false;
    },
  },
  /* async created() {
    const docSnapshot = await getDoc(
      doc(songsCollection, this.$route.params.id)
    ); // if we used a different parameter instead of id, we could use where() to retrieve data from firebase

    // firebase doesn't throw error if a document doesn't exist. it will still return a snapshot.
    if (!docSnapshot.exists()) {
      this.$router.push({ name: "home" });
      return;
    }

    const { sort } = this.$route.query; // updating the sort data, at the beginning
    this.sort = sort === "1" || sort === "2" ? sort : "1";

    this.song = docSnapshot.data();
    this.getComments();
  }, */
  async beforeRouteEnter(to, from, next) {
    // to better the page speed, we change the Created() with beforeRouteEnter
    const docSnapshot = await getDoc(doc(songsCollection, to.params.id));

    /* eslint-disable no-param-reassign */
    next((vm) => {
      if (!docSnapshot.exists()) {
        vm.$router.push({ name: "home" });
        return;
      }

      const { sort } = vm.$route.query;
      vm.sort = sort === "1" || sort === "2" ? sort : "1";

      vm.song = docSnapshot.data();
      vm.getComments();
    });
    /* eslint-enable no-param-reassign */
  },
  methods: {
    ...mapActions(["newSong"]),
    async addComment(values, { resetForm }) {
      // resetFrom is from context object. context is from vee-validate. it gives us methods and properties about our form. we only need resetForm method.
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_message =
        "Please wait! Your comment is being submitted.";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(), // toString(): because Firebase can't store Date object
        sid: this.$route.params.id, // song id
        name: auth.currentUser.displayName, // name of the Commenter
        uid: auth.currentUser.uid, // id of Commenter
      };

      await addDoc(commentsCollection, comment);

      this.song.comment_count += 1;
      await updateDoc(doc(songsCollection, this.$route.params.id), {
        comment_count: this.song.comment_count,
      });

      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_message = "Comment added!";

      resetForm(); // reset values in the form to their original values, which was empty.
    },
    async getComments() {
      const snapshots = await getDocs(
        query(commentsCollection, where("sid", "==", this.$route.params.id))
      );

      this.comments = []; // reseting comments to make sure we don't have duplicate comments

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: { sort: newVal },
      });
    },
  },
};
</script>
