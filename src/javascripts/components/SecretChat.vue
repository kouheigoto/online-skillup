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
    :keyName="$data.name"
    :socketId="$data.socketId"
    :color="post.color"
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
    // id確認
    socket.on('secret', (id) => {
      console.log('check.id', id);
      this.$data.id = id;
    });

    // 接続確認
    socket.on('secret2', (id) => {
      console.log('check.id2', id);
      this.$data.id2 = id;
      this.$data.messages.push({
        name: '',
        mes: '接続に成功しました'
      });
    });

    // メッセージ削除
    socket.on('deleteMessage', (key) => {
      const index = this.$data.messages.findIndex((mes) => mes.id === key);
      if (index !== -1) {
        this.$data.messages.splice(index, 1);
      }
    });

    // メッセージプッシュ
    socket.on('secretMessage', (data) => {
      console.log('name', data.name);
      console.log('mes', data.message);
      this.$data.messages.push({
        name: data.name,
        mes: data.message,
        time: data.time,
        id: data.id,
        socketId: data.socketid,
        color: data.color,
      });
      this.checkSocketId();
      this.checkName();
      this.$data.setClass = '';
      this.scrollDown();
    });

    // socketId確認
    socket.on('checkSocketId', (id) => {
      console.log('socket', id);
      this.$data.socketId = id;
    });

    // name確認
    socket.on('checkName', (name) => {
      console.log('name', name);
      this.$data.name = name;
      this.checkName();
    });

    // 退室通知
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
    // トップへ戻る
    returnTop() {
      console.log('secret=>top');
      socket.emit('returnTop', this.$data.socketId);
      this.$router.push('/Main');
    },
    // socketid確認
    checkSocketId() {
      socket.emit('checkSocketId', this.$data.socketId);
    },
    // name確認
    checkName() {
      socket.emit('checkName', this.$data.name);
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
