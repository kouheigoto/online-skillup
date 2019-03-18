<template>
<div class="accbox">
    <input type="checkbox" id="label1" class="cssacc" />
    <label for="label1">参加者</label>
    <div class="accshow">
      <ul>
        <li v-for="list in $data.joinList"
        :key=list.length>{{ list.name }}
        <button v-if="list.id !== id" @click="secret($event, list.id)">個人チャット</button>
        </li>
      </ul>
    </div>
</div>
</template>

<script>
import socket from '../utils/socket.js';
import VueTypes from 'vue-types';
export default {
  props: {
    id: VueTypes.string.isRequired,
  },
  data() {
    return {
      joinList: [],
    };
  },
  created() {
    socket.on('joinList', (list) => {
      this.$data.joinList = list;
    });
    document.querySelector('button').addEventListener('click', function() {
      document.querySelector('li').classList.toggle('is-open');
    });
  },
  methods: {
    secret(event, id) {
      const index = this.$data.joinList.findIndex((mes) => mes.id === id);
      console.log('SendSecret', this.$data.joinList[index].name);
      console.log('SendSecret.id', id);
      socket.emit('secret', id);
      this.$router.push('/secretchat');
    },
  },
};
</script>

<style lang="scss" scoped>
.accbox {
  margin: 2em 0;
  padding: 0;
  max-width: 400px;
}

.accbox label {
  display: block;
  margin: 1.5px 0;
  padding: 13px 12px;
  color: #ffba47;
  font-weight: bold;
  background: #fff2cc;
  cursor: pointer;
  transition: all 0.5s;
}

.accbox input {
  display: none;
}

.accbox label:hover {
  background: #ffe9a9;
}

.accbox .accshow {
  height: 0;
  padding: 0;
  overflow: hidden;
  opacity: 0;
  transition: 0.8s;
}

.cssacc:checked + label + .accshow {
  height: auto;
  padding: 5px;
  background: #fff5eb;
  opacity: 1;
}

.accbox .accshow p {
  margin: 15px 10px;
}

</style>
