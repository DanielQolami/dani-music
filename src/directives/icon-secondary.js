export default {
  beforeMount(el, binding) {
    // this is a test for registering Local Directives
    // we put an object in the v-icon-secondary, and we access it via: binding.value.TEST
    let iconClass = `fa fa-${binding.value.icon} text-gray-600`;

    if (binding.value.right) {
      iconClass += ' float-right'; // tailwind class, to float-right the icon
    }

    // binding: the value we pass to the v-directive
    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;

    // we use this file in SongItem.vue
  },
};
