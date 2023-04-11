export default {
  beforeMount(el, binding) {
    // beforemount will run, before the element is inserted into document
    let iconClass = `fa fa-${binding.value} text-xl`;

    if (binding.arg === 'full') {
      // if v-icon:full="something"
      iconClass = binding.value;
    }

    if (binding.modifiers.right) {
      // if v-icon.right=""
      iconClass += ' float-right'; // tailwind class, to float-right the icon
    }

    if (binding.modifiers.yellow) {
      // v-icon.yellow=""
      iconClass += ' text-yellow-400';
    } else {
      iconClass += ' text-green-400';
    }

    // binding: the value we pass to the v-directive
    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
