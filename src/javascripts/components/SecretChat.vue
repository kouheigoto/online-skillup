<template>
  <div id="timeline">
    <p class="head">
      <button @click="returnTop" class="returnbuttton">全体チャット</button>
      <span class="title">個別チャット</span>
    </p>
    <div class="timeline">
    <form @submit="onSubmit" class="button">
      <input v-model="$data.mes" type="text" class="sendmessage"/>
      <button type="submit" class="send">送信</button>
    </form>
    <MyComponent v-for="post in $data.messages"
    :key="post.length"
    :name="post.name"
    :message="post.mes"
    :time="post.time"
    :mesid="post.id"
    :id="post.socketId"
    :socketId="$data.socketId"
    @delete="onDelete"/>
    </div>
  </div>
</template>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
import socket from '../utils/socket';
// components
import MyComponent from '../components/MyComponent.vue';
import Joinlist from '../components/Joinlist';

export default {
  components: {
    MyComponent,
  },
  data() {
    return {
      message: '',
      message2: '',
      messages: [],
      name: '',
      mes: '',
      setClass: '',
      socketId: '',
      joinList: [],
      id: '',
      id2: '',
    };
  },
  created() {
    socket.on('secret', (id) => {
      console.log('check.id', id);
      this.$data.id = id;
    });
    socket.on('secret2', (id) => {
      console.log('check.id2', id);
      this.$data.id2 = id;
      this.$data.messages.push({
        name: '',
        mes: '接続に成功しました'
      });
    });
    socket.on('deleteMessage', (key) => {
      const index = this.$data.messages.findIndex((mes) => mes.id === key);
      if (index !== -1) {
        this.$data.messages.splice(index, 1);
      }
    });
    // クラスセット
    socket.on('setClass2', (data) => {
      console.log('class', data);
      this.$data.setClass = data;
    });
    // メッセージプッシュ
    socket.on('secretMessage', (data) => {
      console.log('name', data.name);
      console.log('mes', data.message);
      if (this.$data.setClass === '') this.$data.setClass = 'left';
      this.$data.messages.push({
        name: data.name,
        mes: data.message,
        time: data.time,
        id: data.id,
        socketId: data.socketid,
        setClass: this.$data.setClass
      });
      this.checkSocketId();
      this.$data.setClass = '';
      for (let i = 0; i < this.$data.messages.length; i++) {
        /* if (this.$data.messages[i].name === '' && this.$data.messages[i].mes === '') {
          this.$data.messages[i].name = data.name;
          this.$data.messages[i].mes = data.message;
         */ console.log('check.name', this.$data.messages[i].name);
        console.log('check.mes', this.$data.messages[i].mes);
        console.log('check.setClass', this.$data.messages[i].setClass);
        console.log('check.id', this.$data.messages[i].id);
        console.log('check.length', i);
      }
      this.scrollDown();
    });
    socket.on('checkSocketId', (id) => {
      console.log('socket', id);
      this.$data.socketId = id;
    });
    socket.on('discon', (id) => {
      this.$data.messages.push({
        name: '',
        mes: '退室しました'
      });
    });
  },
  methods: {
    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      socket.emit('secretMessage', {
        name: '',
        message: this.$data.mes,
        id: this.$data.id,
        id2: this.$data.id2,
      });
      this.$data.mes = '';
    },
    // deleteボタン
    onDelete(key) {
      console.log('delete2');
      socket.emit('deleteMessage', key);
    },
    // scroll位置変更
    scrollDown() {
      console.log('scrollDown');
      const element = document.getElementById('timeline');
      element.scrollTop = element.scrollHeight;
    },
    returnTop() {
      console.log('secret=>top');
      socket.emit('returnTop', this.$data.socketId);
      this.$router.push('/');
    },
    checkSocketId() {
      socket.emit('checkSocketId', this.$data.socketId);
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
}

.button {
  position: fixed;
  bottom: 0;
  height: 40px;
  width: 100%;
}

.sendmessage {
  position: absolute;
  left: 0;
  height: 100%;
  width: 90%;
}

.send {
  position: absolute;
  right: 0;
  height: 100%;
  width: 10%;
}

#timeline {
  position: fixed;
  top: 40px;
  bottom: 40px;
  left: 0;
  right: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: #737;
}

.head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 0;
  margin-bottom: 0;
  widows: 100%;
  height: 40px;
  background-color: #eee;
}

.returnbutton {
  height: 100%;
  width: 100px;
}

.title {
  position: absolute;
  top: 10px;
  left: 45%;
  font-size: 20px;
}

</style>
