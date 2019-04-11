<template>
  <div>
    <p>
      <img class="logo" src="../../images/logo.jpg" alt="ロゴ">
      <span class="login">ログイン</span>
    </p>
    <p>
      <ul>
        <li v-for="error in $data.errorList" class="errorlist">{{ error.error }}</li>
      </ul>
    </p>
    <form @submit="onSubmit" name="login" class="button">
      <input type="checkbox" name="status">新規参加
      <a>←新規参加はここをクリック</a>
      <p>{{ '名前:' }}<input v-model="$data.name" type="text" class="sendmessage"/></p>
      <p>{{ 'パスワード:' }}<input v-model="$data.password" type="password"/></p>
      <p>
        <span>色選択(新規参加者のみ選択):</span>
        <input type="radio" name="color" value="green" id="green">
        <a class="green">緑</a>
        <input type="radio" name="color" value="red" id="red">
        <a class="red">赤</a>
        <input type="radio" name="color" value="blue" id="blue">
        <a class="blue">青</a>
        <input type="radio" name="color" value="yellow" id="yellow">
        <a class="yellow">黄色</a>
      </p>
      <button type="submit" class="send">新規参加</button>
    </form>
  </div>
</template>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
import socket from '../utils/socket';

export default {
  data() {
    return {
      name: '',
      socketId: '',
      password: '',
      color: 'green',
      errorList: [],
    };
  },
  created() {
    console.log('created');
    // connect
    socket.on('connect', () => {
      console.log('connected!');
    });

    // 新規ログインチェック
    socket.on('newloginOk', (name) => {
      console.log('loginOk')
      this.$router.push('/Main');
      socket.emit('setName', {
        name: this.$data.name,
        color: this.$data.color,
      });
      this.$data.name = '';
      this.$data.password = '';
      this.$data.color = 'green';
    });

    // ログインチェック
    socket.on('loginOk', (color) => {
      this.$router.push('/main');
      socket.emit('setName', {
        name: this.$data.name,
        color: color,
      });
      this.$data.name = '';
      this.$data.password = '';
      this.$data.color = 'green';
    });

    // エラー取得
    socket.on('loginerror', (message) => {
      console.log('loginerror', message);
      this.$data.errorList.push({
        error: message,
      })
    });
  },
  methods: {
    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      if (document.login.status.checked) {
        for (var i = 0; i < document.login.color.length; i++) {
        if (document.login.color[i].checked) {
          this.$data.color = document.login.color[i].value;
          }
        }
        console.log('checktopcolor', this.$data.color);
        socket.emit('newlogin', {
          name: this.$data.name,
          password: this.$data.password,
          color: this.$data.color,
        });
      } else {
        socket.emit('login', {
        name: this.$data.name,
        password: this.$data.password,
        color: this.$data.color,
      });
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 40px;
}

.login {
  border: solid 3px #ff0;
  display: inline-block;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #ff0;
  margin-left: 30px;
}

form {
  margin-left: 50px;

  a {
    color: $red;
  }
}

.errorlist {
  list-style: none;
  color: $red;
}

.green {
  color: $green;
}

.red {
  color: $red;
}

.blue {
  color: $blue;
}

.yellow {
  color: $yellow;
}

</style>
