<template>
  <div>
    <ul v-if="name === ''"><li class="systemMessage">{{ message }}</li></ul>
  <ul v-else><li :class="setClass"><p class="name">{{ name }}</p>
  <p class="message">{{ message }}</p>
  <p class="time">{{ time }}</p>
  <p v-if="setClass === 'right'"><button @click="onDelete($event, id)">削除</button></p></li></ul></div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    name: VueTypes.string.isRequired,
    message: VueTypes.string.isRequired,
    time: VueTypes.string.isRequired,
    setClass: VueTypes.string.isRequired,
    id: VueTypes.number.isRequired,
  },
  methods: {
    // 削除ボタンをクリックした時
    onDelete(event, id) {
      console.log('delete1');
      event.stopPropagation();
      console.log('checkdele');
      this.$emit('delete', id);
    }
  }
};

</script>

<style lang="scss" scoped>
.systemMessage {
  list-style: none;
  text-align: center;
}

.right {
  list-style: none;
  text-align: right;
}

.right .message {
  text-align: left;
  display: inline-block;
  border-radius: 20px;
  background: #0f0;
  width: 400px;
  padding-left: 10px;
  padding-right: 1px;
  font-size: 1.3em;
}

.right .name {
  margin-right: 360px;
}

.left {
  list-style: none;
  text-align: left;
}

.left .message {
  border-radius: 20px;
  display: inline-block;
  background: #0f0;
  width: 400px;
  padding-left: 10px;
  padding-right: 1px;
  font-size: 1.3em;
}

.time {
  margin-left: 360px;
}

p {
  margin: 5px;
  padding-top: auto;
  padding-bottom: auto;
}

li {
  margin: 5px;
}
</style>
