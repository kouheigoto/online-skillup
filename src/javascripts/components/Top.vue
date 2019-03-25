<template>
  <div>
    <p>
      <img class="logo" src="../../images/logo.jpg" alt="ロゴ">
      <span>新規参加</span>
    </p>
    <p>
      <ul>
        <li v-for="error in $data.errorList" class="errorlist">{{ error.error }}</li>
      </ul>
    </p>
    <form @submit="onSubmit" name="login" class="button">
      <input type="checkbox" name="status">新規参加
      <p>{{ '名前:' }}<input v-model="$data.mes" type="text" class="sendmessage"/></p>
      <p>{{ 'パスワード:' }}<input v-model="$data.password" type="text"/></p>
      <p>
        <span>色選択(新規参加者のみ選択):</span>
        <input type="radio" name="color" value="green"><a class="green">緑</a>
        <input type="radio" name="color" value="red"><a class="red">赤</a>
        <input type="radio" name="color" value="blue"><a class="blue">青</a>
        <input type="radio" name="color" value="yellow"><a class="yellow">黄色</a>
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
      mes: '',
      socketId: '',
      password: '',
      color: 'green',
      errorList: [],
    };
  },
  beforeCreate() {
    console.log('beforcreate');
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
        name: this.$data.mes,
        color: this.$data.color,
      });
      this.$data.mes = '';
      this.$data.password = '';
      this.$data.color = 'green';
    });

    // ログインチェック
    socket.on('loginOk', (color) => {
      this.$router.push('/main');
      socket.emit('setName', {
        name: this.$data.mes,
        color: color,
      });
      this.$data.mes = '';
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
      if (document.login.status.checked) {
        for (var i = 0; i < document.login.color.length; i++) {
        if (document.login.color[i].checked) {
          this.$data.color = document.login.color[i].value;
          }
        }
        console.log('checktopcolor', this.$data.color);
        socket.emit('newlogin', {
          name: this.$data.mes,
          password: this.$data.password,
          color: this.$data.color,
        });
      } else {
        socket.emit('login', {
        name: this.$data.mes,
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
