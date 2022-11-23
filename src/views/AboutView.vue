<template>
  <div class="about mx-4 my-3">
    <h1 class="text-3xl font-bold mb-3">language and technologies used:</h1>
    <h2 class="text-2xl font-bold">Front-end</h2>
    <ul class="list-disc px-4">
      <li>HTML, CSS, JavaScript</li>
      <li>Tailwind css framework</li>
      <li>Vue 3, Vue Router 4, VueX 4, Vee-Validate</li>
      <li>Yarn</li>
      <li>Firebase SDK</li>
    </ul>
    <h2 class="text-2xl font-bold mt-2">Back-end</h2>
    <ul class="list-disc px-4">
      <li>Firebase 9</li>
    </ul>
  </div>
</template>

<script>
import dummyModule from "@/store/modules/dummy";

export default {
  created() {
    this.$store.registerModule("dummy", dummyModule);
  },
};
</script>
