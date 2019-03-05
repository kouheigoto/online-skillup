<template>
  <div>
    <ul v-if="name === 'system'"><li class="message">{{ message }}</li></ul>
  <ul v-else><li class="message">{{ name }}:{{ message }}</li></ul></div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    name: VueTypes.string.isRequired,
    message: VueTypes.string.isRequired,
  }
};
</script>

<style lang="scss" scoped>
.message {
  outline: 10px;
  list-style: none;
}
</style>
