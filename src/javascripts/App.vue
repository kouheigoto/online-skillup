<template>
  <div>
    <p>
      <img class="logo" src="../images/logo.jpg" alt="ロゴ">
      <span class="sample">テスト</span>
      <span>参加者：{{ $data.id }}人</span>
    </p>
    <form @submit="onSubmit">
      <p>投稿：<input v-model="$data.mes" type="text"/></p>
      <button type="submit">送信</button>
    </form>
    <MyComponent v-for="post in $data.messages"
    :key="post.length"
    :name="post.name"
    :message="post.mes"/>
  </div>
</template>

<script>
import socket from './utils/socket';
// components
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    MyComponent
  },
  data() {
    return {
      message: '',
      message2: '',
      messages: [],
      nextid: '1',
      name: '',
      mes: '',
      id: ''
    };
  },
  created() {
    socket.on('connect', () => {
      socket.emit('setName', prompt('ユーザー名入力'));
      console.log('connected!');
    });
    socket.on('setName', (setName) => {
      this.name = setName;
      this.$data.messages.push({
        name: 'system',
        mes: setName + 'が参加しました'
      });
    });
    socket.on('onlineData', (setData) => {
      this.$data.id = setData;
    });
    socket.on('send', (message) => {
      console.log(message);
      this.$data.messages.name = message;
    });
    socket.on('send2', (message2) => {
      console.log(message2);
      this.$data.messages.mes = message2;
    });
    socket.on('b', (data) => {
      console.log('name', data.name);
      console.log('mes', data.message);
      /* this.$data.messages.name = data.name;
      this.$data.messages.mes = data.message;
      */
      this.$data.messages.push({
        name: data.name,
        mes: data.message
      });
      for (let i = 0; i < this.$data.messages.length; i++) {
        /* if (this.$data.messages[i].name === '' && this.$data.messages[i].mes === '') {
          this.$data.messages[i].name = data.name;
          this.$data.messages[i].mes = data.message;
         */ console.log('check.name', this.$data.messages[i].name);
        console.log('check.mes', this.$data.messages[i].mes);
        console.log('check.length', i);
      }
    });
  },
  methods: {
    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      /*
      socket.emit('send', this.$data.text);
      socket.emit('send2', this.$data.text1);
      */
      socket.emit('b', {
        name: '',
        message: this.$data.mes
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 40px;
}

.sample {
  color: $red;
  border-radius: 10px solid black;
}

</style>
