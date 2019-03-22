<template>
  <div id="timeline">
    <p class="head">
      <img class="logo" src="../../images/logo.jpg" alt="ロゴ">
      <span class="sample">テスト</span>
      <span>参加者：{{ $data.id }}人</span>
      <Joinlist :id="$data.socketId" />
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
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
import socket from '../utils/socket';
// components
import MyComponent from '../components/MyComponent.vue';
import Joinlist from '../components/Joinlist';

export default {
  components: {
    MyComponent,
    Joinlist,
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
      joinList: []
    };
  },
  beforeCreate() {
    console.log('beforcreate');
  },
  created() {
    console.log('created');
    // ユーザー名入力
    socket.on('connect', () => {
      socket.emit('setName', prompt('ユーザー名入力'));
      console.log('connected!');
    });
    // 参加通知
    socket.on('setName', (setName) => {
      this.name = setName.name;
      this.$data.messages = setName.list;
      this.$data.socketId = setName.id;
    });
    // 参加人数変更
    socket.on('onlineData', (setData) => {
      this.$data.id = setData;
      console.log('id:', this.$data.id);
    });
    // 退室通知
    socket.on('disconnect', (name) => {
      this.$data.messages.push({
        name: '',
        mes: name + 'が退室しました'
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
    socket.on('sendMessage', (data) => {
      console.log('name', data.name);
      console.log('mes', data.message);
      /* this.$data.messages.name = data.name;
      this.$data.messages.mes = data.message;
      */
      if (this.$data.messages[this.$data.messages.length - 1].id !== data.id) {
      this.$data.messages.push({
        name: data.name,
        mes: data.message,
        time: data.time,
        id: data.id,
        socketId: data.socketid,
      });
      this.checkSocketId();
      console.log('check.length', this.$data.messages.length);
      /*
      for (let i = 0; i < this.$data.messages.length; i++) {
         if (this.$data.messages[i].name === '' && this.$data.messages[i].mes === '') {
          this.$data.messages[i].name = data.name;
          this.$data.messages[i].mes = data.message;
          console.log('check.name', this.$data.messages[i].name);
        console.log('check.mes', this.$data.messages[i].mes);
        console.log('check.setClass', this.$data.messages[i].setClass);
        console.log('check.id', this.$data.messages[i].id);
        console.log('check.length', i);
        console.log('test', this.$data.socketId);
        console.log('test', this.$data.socketId, ':', this.$data.messages[i].socketId);
      }
      */
      }
    });
    socket.on('socketId', (id) => {
      this.$data.socketId = id;
    })
    socket.on('ssId', (id) => {
      console.log('checksecret');
      socket.emit('secret2', id);
      this.$router.push('/secretchat');
    });
    socket.on('checkSocketId', (id) => {
      console.log('socket', id);
      this.$data.socketId = id;
    });
    socket.on('returnTop', (list) => {
      console.log('list => mes');
      for (let i = 0; i < list.length; i++) {
        console.log('check.name', list[i].name);
        console.log('check.mes', list[i].mes);
        console.log('check.id', list[i].id);
        console.log('check.length', i);
      }
      this.$data.messages = list;
      socket.emit('secretBack', this.$data.socketId);
    });
  },
  beforeMount() {
    console.log('beforemount');
  },
  mounted() {
    console.log('mounted');
  },
  beforeUpdate() {
    console.log('beforeupdate');
  },
  updated() {
    console.log('updated');
    this.scrollDown();
  },
  beforeDestroy() {
    console.log('beforedestroy');
  },
  methods: {
    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      socket.emit('sendMessage', {
        name: '',
        message: this.$data.mes,
        id: this.$data.socketId,
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
    onNextButtonClick() {
      this.$router.push('/Joinlist');
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
  top: 100px;
  bottom: 40px;
  left: 0;
  right: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: #f2caaa;
}

.head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  widows: 100%;
  height: 100px;
  margin-top: 0;
  background-color: #eee;
}

</style>
