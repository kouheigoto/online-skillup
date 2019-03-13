<template>
  <div>
    <p>aa</p>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import socket from '../utils/socket.js';

export default {
  props: {
    name: VueTypes.string.isRequired,
  },
  data() {
    return {
      joinList: [],
    };
  },
  created() {
    socket.on('joinList', (list) => {
      this.$data.joinList = list;
    });
  },
  methods: {
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/');
    }
  }
};

</script>

<style lang="scss" scoped>
//
</style>
