'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let online = 0;
let id = 0;
const joinList = [];
let chatList = [];
const secretList = [];
let index = 0;
let mesId = 0;
// タイムゾーンを設定する
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const app = express();

// CORSを許可する
app.use(cors());

// POSTパラメータをJSONで取得できるようにする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// public以下に配置したファイルは直リンクで見れるようにする
app.use(express.static(path.resolve(__dirname, 'public')));

// サーバーの動作確認
app.get('/time', (req, res) => {
  res.send(moment().format('YYYY/MM/DD HH:mm:ss'));
});

// サーバーを起動する
const server = app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`START SERVER http://${host}:${port}`);
});

// socketサーバーを立ち上げる
const io = require('socket.io')(server, { origins: '*:*' });

// socketイベントの設定
io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
    online--;
    io.emit('onlineData', online);
    chatList.push({
      name: '',
      mes: socket.name + 'が退室しました',
    });
    if (joinList.length > 100) {
      joinList.shift();
    }
    io.emit('disconnect', socket.name);
    index = joinList.findIndex((list) => list.id === socket.id);
    console.log('socket.id', socket.id);
    console.log('index', index);
    if (index !== -1) {
      joinList.splice(index, 1);
    }
    io.emit('joinList', joinList);
  });

  // メッセージ削除
  socket.on('deleteMessage', (key) => {
    console.log('key', key);
    const index = chatList.findIndex((id) => id.id === key);
    if (index !== -1) {
      chatList.splice(index, 1);
    }
    io.emit('deleteMessage', key);
  });

  // ユーザの参加
  socket.on('setName', function(name) {
    online++;
    if (!name) {
      name = '匿名' + id;
      id++;
    };
    console.log('setName', name);
    console.log('online', online);
    socket.name = name;
    io.emit('onlineData', online);
    chatList.push({
      name: '',
      mes: socket.name + 'が参加しました',
    });
    if (chatList.length > 100) {
      chatList.shift();
    }
    io.emit('setName', {
      name: socket.name,
      list: chatList,
      id: socket.id,
    });
    joinList.push({
      name: socket.name,
      id: socket.id
    });
    io.emit('joinList', joinList);
    io.to(socket.id).emit('socketId', socket.id);
  });

  // メッセージ送信
  socket.on('sendMessage', function(data) {
    console.log('b.mes:', data.message);
    io.to(socket.id).emit('setClass', 'right');
    data.name = socket.name;
    chatList.push({
      name: data.name,
      mes: data.message,
      time: moment().format('HH:mm'),
      id: mesId,
      socketId: socket.id,
    });
    if (chatList.length > 100) {
      chatList.shift();
    }
    io.emit('sendMessage', {
      name: data.name,
      message: data.message,
      time: moment().format('HH:mm'),
      id: mesId,
      socketid: socket.id
    });
    mesId++;
  });
  socket.on('secret', (id) => {
    console.log('secretchat.id', id);
    if (secretList.findIndex((mes) => mes.id === id.id) === -1) {
      secretList.push({
        id: id.id,
      });
      if (secretList.findIndex((mes) => mes.id === id.myId) === -1) {
        secretList.push({
          id: id.myId,
        });
        io.to(socket.id).emit('ssOk', id.id);
        io.to(id.id).emit('ssId', socket.id);
        io.emit('secret', id.id);
      }
    }
  });
  socket.on('secret2', (id) => {
    io.emit('secret2', id);
  });
  socket.on('secretMessage', function(data) {
    io.to(socket.id).emit('setClass2', 'right');
    data.name = socket.name;
    io.to(data.id).emit('secretMessage', {
      name: data.name,
      message: data.message,
      time: moment().format('HH:mm'),
      id: mesId,
      socketid: socket.id
    });
    io.to(data.id2).emit('secretMessage', {
      name: data.name,
      message: data.message,
      time: moment().format('HH:mm'),
      id: mesId,
      socketid: socket.id
    });
    mesId++;
  });
  socket.on('checkSocketId', (id) => {
    io.to(socket.id).emit('checkSocketId', socket.id);
  });
  socket.on('returnTop', (id) => {
    console.log('returntop');
    io.emit('discon', id);
    io.to(socket.id).emit('onlineData', online);
    io.to(socket.id).emit('joinList', joinList);
    io.to(socket.id).emit('socketId', socket.id);
    io.to(socket.id).emit('returnTop', chatList);
  });
  socket.on('secretBack', (id) => {
    index = secretList.findIndex((socketId) => socketId.id === id);
    if (index !== -1) {
      secretList.splice(index, 1);
    }
  });
});
