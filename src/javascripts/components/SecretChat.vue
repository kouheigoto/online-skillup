<template>
  <div class="timeline" id="timeline">
    <p class="head">
      <button @click="$router.back()">全体チャット</button>
    </p>
    <form @submit="onSubmit" class="button">
      <input v-model="$data.mes" type="text" class="sendmessage"/>
      <button type="submit" class="send">送信</button>
    </form>
    <MyComponent v-for="post in $data.messages"
    :key="post.length"
    :name="post.name"
    :message="post.mes"
    :setClass="post.setClass"
    :time="post.time"
    :id="post.id"
    @delete="onDelete"/>
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
        setClass: this.$data.setClass
      });
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
}

.sendmessage {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 90%;
}

.send {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 10%;
}

.timeline {
  position: fixed;
  top: 0;
  bottom: 40px;
  left: 0;
  right: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.head {
  position: fixed;
  widows: 100%;
  height: 100px;
}

</style>
