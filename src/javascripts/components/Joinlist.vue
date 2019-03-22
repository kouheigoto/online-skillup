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
      console.log('join', this.$data.joinList[0].name);
    });
    socket.on('ssOk', (id) => {
      this.$router.push('/secretchat');
    });
  },
  methods: {
    secret(event, id) {
      const index = this.$data.joinList.findIndex((mes) => mes.id === id);
      console.log('SendSecret', this.$data.joinList[index].name);
      console.log('SendSecret.id', id);
      socket.emit('secret', {
        id: id,
        myId: this.$props.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.accbox {
  margin: 2em 0;
  padding: 0;
  width: 300px;
  position: absolute;
  top: 0;
  left: 200px;
}

.accbox label {
  display: block;
  margin: 1.5px 0;
  padding: 13px 12px;
  color: #d5d;
  font-weight: bold;
  background: #99e;
  cursor: pointer;
  transition: all 0.5s;
}

.accbox input {
  display: none;
}

.accbox label:hover {
  background: #55f;
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
