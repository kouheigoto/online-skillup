<template>
  <div>
    <ul v-if="name === ''"><li class="systemMessage">{{ message }}</li></ul>
    <ul v-else-if="name === keyName">
      <li class="right">
        <p class="message" :class="color">{{ message }}</p>
        <p class="time">{{ time }}</p>
        <p><button @click="onDelete($event, mesid)">削除</button></p>
      </li>
    </ul>
    <ul v-else>
      <li class="left"><p class="name">{{ name }}</p>
        <p class="message" :class="color">{{ message }}</p>
        <p class="time">{{ time }}</p>
      </li>
    </ul>
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
    keyName: VueTypes.string.isRequired,
    socketId: VueTypes.string.isRequired,
    color: VueTypes.string.isRequired,
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
  color: #fff;
}

.right {
  list-style: none;
  text-align: right;

  .message {
    text-align: left;
    display: inline-block;
    border-radius: 20px;
    width: 400px;
    padding-left: 10px;
    padding-right: 1px;
    font-size: 1.3em;
    color: #fff;
  }
}

.red {
  background-color: $red;
}

.blue {
  background-color: $blue;
}

.yellow {
  background-color: $yellow;
}

.green {
  background-color: $green;
}

.left {
  list-style: none;
  text-align: left;

  .message {
    border-radius: 20px;
    display: inline-block;
    width: 400px;
    padding-left: 10px;
    padding-right: 1px;
    font-size: 1.3em;
    color: #fff;
  }

  .name {
    color: #fff;
  }
}

.time {
  margin-left: 360px;
  color: #fff;
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
