<template>
  <div>
    <ul v-if="name === ''"><li class="systemMessage">{{ message }}</li></ul>
  <ul v-else-if="id === socketId"><li class="right"><p class="name">{{ name }}</p>
  <p class="message">{{ message }}</p>
  <p class="time">{{ time }}</p>
  <p><button @click="onDelete($event, mesid)">削除</button></p></li></ul>
  <ul v-else><li class="left"><p class="name">{{ name }}</p>
  <p class="message">{{ message }}</p>
  <p class="time">{{ time }}</p></li></ul>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    name: VueTypes.string.isRequired,
    message: VueTypes.string.isRequired,
    time: VueTypes.string.isRequired,
    mesid: VueTypes.number.isRequired,
    id: VueTypes.string.isRequired,
    socketId: VueTypes.string.isRequired,
  },
  methods: {
    // 削除ボタンをクリックした時
    onDelete(event, mesid) {
      console.log('delete1');
      event.stopPropagation();
      console.log('checkdele');
      this.$emit('delete', mesid);
    }
  }
};

</script>

<style lang="scss" scoped>
.systemMessage {
  list-style: none;
  text-align: center;
  color: #666;
}

.right {
  list-style: none;
  text-align: right;
}

.right .message {
  text-align: left;
  display: inline-block;
  border-radius: 20px;
  background: rgb(123, 236, 123);
  width: 400px;
  padding-left: 10px;
  padding-right: 1px;
  font-size: 1.3em;
}

.right .name {
  text-align: left;
  padding-left: 70%;
}

.left {
  list-style: none;
  text-align: left;
}

.left .message {
  border-radius: 20px;
  display: inline-block;
  background: #fff;
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
