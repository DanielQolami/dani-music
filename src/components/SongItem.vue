<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-600 text-sm md:text-base"
        >{{ song.modified_name }}</router-link
      >
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }"
        @click="navigate"
        ><span
          class="comments"
          v-icon-secondary="{ icon: 'comments', right: false }"
        >
          <!-- icon -->
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script>
import IconSecondary from "@/directives/icon-secondary";

export default {
  name: "SongItem",
  props: ["song"],
  directives: {
    "icon-secondary": IconSecondary,
  },
};
</script>
