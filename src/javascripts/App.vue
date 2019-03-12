<template>
  <div class="timeline" id="timeline">
    <p>
      <img class="logo" src="../images/logo.jpg" alt="ロゴ">
      <span class="sample">テスト</span>
      <span>参加者：{{ $data.id }}人</span>
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
    :time="post.time"/>
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
      setClass: '',
      socketId: '',
      joinList: []
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
        name: '',
        mes: setName + 'が参加しました'
      });
    });
    socket.on('onlineData', (setData) => {
      this.$data.id = setData;
    });
    socket.on('disconnect', (setName) => {
      this.name = setName;
      this.$data.messages.push({
        name: '',
        mes: setName + 'が退室しました'
      });
    });
    socket.on('disconnectuser', (index) => {
      this.$data.joinList.splice(index, 1);
      for (let j = 0; j < this.$data.joinList.length; j++) {
        console.log('dis.joinList.name', j, ':', this.$data.joinList[j].name);
        console.log('dis.joinList.id', j, ':', this.$data.joinList[j].id);
      }
    });
    socket.on('setClass', (data) => {
      console.log('class', data);
      this.$data.setClass = data;
    });
    socket.on('sendMessage', (data) => {
      console.log('name', data.name);
      console.log('mes', data.message);
      /* this.$data.messages.name = data.name;
      this.$data.messages.mes = data.message;
      */
      if (this.$data.setClass === '') this.$data.setClass = 'left';
      this.$data.messages.push({
        name: data.name,
        mes: data.message,
        time: data.time,
        setClass: this.$data.setClass
      });
      this.scrollDown();
      this.$data.setClass = '';
      for (let i = 0; i < this.$data.messages.length; i++) {
        /* if (this.$data.messages[i].name === '' && this.$data.messages[i].mes === '') {
          this.$data.messages[i].name = data.name;
          this.$data.messages[i].mes = data.message;
         */ console.log('check.name', this.$data.messages[i].name);
        console.log('check.mes', this.$data.messages[i].mes);
        console.log('check.setClass', this.$data.messages[i].setClass);
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
      socket.emit('sendMessage', {
        name: '',
        message: this.$data.mes
      });
      this.$data.mes = '';
    },
    onDelete(key) {
      const index = this.$data.list.indexOf(key);
      if (index !== -1) {
        this.$data.messages.splice(index, 1);
      }
    },
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
  position: relative;
  height: 100px;
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

</style>
