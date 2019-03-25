<template>
  <div id="timeline">
    <p class="head">
      <img class="logo" src="../../images/logo.jpg" alt="ロゴ">
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
    :keyName="$data.name"
    :socketId="$data.socketId"
    :color="post.color"
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
      messages: [],
      name: '',
      mes: '',
      socketId: '',
      joinList: [],
      color: '',
    };
  },
  beforeCreate() {
    console.log('beforcreate');
  },
  created() {
    console.log('created');
    // 参加通知
    socket.on('setName', (setName) => {
      this.$data.name = setName.name;
      this.$data.messages = setName.list;
      this.$data.socketId = setName.id;
      this.color = setName.color;
      console.log('color', this.$data.color);
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
      if (this.$data.messages[this.$data.messages.length - 1].id !== data.id) {
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
      console.log('check.length', this.$data.messages.length);
      }
    });

    // socketId取得
    socket.on('socketId', (id) => {
      this.$data.socketId = id;
    })

    // シークレットチャット接続確認
    socket.on('ssId', (id) => {
      console.log('checksecret');
      socket.emit('secret2', id);
      this.$router.push('/secretchat');
    });

    // socketId更新
    socket.on('checkSocketId', (id) => {
      console.log('socket', id);
      this.$data.socketId = id;
    });

    // socket.name取得
    socket.on('checkName', (name) => {
      console.log('name', name);
      this.$data.name = name;
    })

    // シークレットチャットから戻ってきたことの確認
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
    this.checkName();
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
        color: this.$data.color,
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
    // socketId確認
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
  background-color: #000;
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
