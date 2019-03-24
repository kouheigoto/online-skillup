'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let online = 0;
let id = 0;
const joinList = [];
const chatList = [];
const secretList = [];
const dataList = [];
let index = 0;
let mesId = 0;
let loginerror = '';
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

  // 新規ログイン
  socket.on('newlogin', (data) => {
    const index = dataList.findIndex((name) => name.name === data.name);
    const index2 = dataList.findIndex((pass) => pass.password === data.password);
    console.log('index', index, 'index2', index2);
    for (let i = 0; i < dataList.length; i++) {
      console.log(dataList[i].name);
      console.log(dataList.password);
    }
    if (data.name !== '') {
      if (data.password !== '') {
        if (dataList.findIndex((name) => name.name === data.name) === -1) {
          console.log('name');
          if (dataList.findIndex((pass) => pass.password === data.password) === -1) {
            console.log('pass');
            dataList.push({
              name: data.name,
              password: data.password,
              color: data.color,
            });
            console.log('loginOk');
            socket.emit('newloginOk', data.name);
          } else {
            loginerror = 'パスワードを変更してください';
            socket.emit('loginerror', loginerror);
          }
        } else {
          loginerror = 'この名前は既に使われています';
          socket.emit('loginerror', loginerror);
        }
      } else {
        loginerror = 'パスワードが空です';
        socket.emit('loginerror', loginerror);
      }
    } else {
      loginerror = '名前が空です';
      socket.emit('loginerror', loginerror);
    }
  });

  // ログイン
  socket.on('login', (data) => {
    console.log('loginck');
    if (data.name !== '') {
      if (data.password !== '') {
        index = dataList.findIndex((name) => name.name === data.name);
        if (index !== -1) {
          if (dataList[index].password === data.password) {
            if (joinList.findIndex((name) => name.name === data.name) === -1) {
              console.log('loginOk');
              socket.emit('loginOk', dataList[index].color);
            } else {
              loginerror = '既にログインしています';
              socket.emit('loginerror', loginerror);
            }
          } else {
            loginerror = 'パスワードが間違ってます';
            socket.emit('loginerror', loginerror);
          }
        } else {
          loginerror = 'この名前は登録されてません';
          socket.emit('loginerror', loginerror);
        }
      } else {
        loginerror = 'パスワードが空です';
        socket.emit('loginerror', loginerror);
      }
    } else {
      loginerror = '名前が空です';
      socket.emit('loginerror', loginerror);
    }
  });

  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
    online--;
    io.emit('onlineData', online);
    chatList.push({
      name: '',
      mes: socket.name + 'が退室しました',
    });
    if (chatList.length > 100) {
      chatList.shift();
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
  socket.on('setName', (name) => {
    online++;
    console.log('setName', name.name);
    console.log('online', online);
    socket.name = name.name;
    socket.color = name.color;
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
      color: socket.color,
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
      color: socket.color,
    });
    if (chatList.length > 100) {
      chatList.shift();
    }
    io.emit('sendMessage', {
      name: data.name,
      message: data.message,
      time: moment().format('HH:mm'),
      id: mesId,
      socketid: socket.id,
      color: socket.color,
    });
    mesId++;
  });

  // シークレット接続チェック
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

  // シークレットチャットへIdを渡す
  socket.on('secret2', (id) => {
    io.emit('secret2', id);
  });

  // シークレットチャットのメッセージ送信
  socket.on('secretMessage', function(data) {
    io.to(socket.id).emit('setClass2', 'right');
    data.name = socket.name;
    io.to(data.id).emit('secretMessage', {
      name: data.name,
      message: data.message,
      time: moment().format('HH:mm'),
      id: mesId,
      socketid: socket.id,
      color: socket.color,
    });
    io.to(data.id2).emit('secretMessage', {
      name: data.name,
      message: data.message,
      time: moment().format('HH:mm'),
      id: mesId,
      socketid: socket.id,
      color: socket.color,
    });
    mesId++;
  });

  // socketIdのチェック
  socket.on('checkSocketId', (id) => {
    io.to(socket.id).emit('checkSocketId', socket.id);
  });

  // nameのチェック
  socket.on('checkName', (name) => {
    io.to(socket.id).emit('checkName', socket.name);
  });

  // トップへ戻る
  socket.on('returnTop', (id) => {
    console.log('returntop');
    io.emit('discon', id);
    io.to(socket.id).emit('onlineData', online);
    io.to(socket.id).emit('joinList', joinList);
    io.to(socket.id).emit('socketId', socket.id);
    io.to(socket.id).emit('checkName', socket.name);
    io.to(socket.id).emit('returnTop', chatList);
  });

  // シークレットチャットを抜けたことを保存
  socket.on('secretBack', (id) => {
    index = secretList.findIndex((socketId) => socketId.id === id);
    if (index !== -1) {
      secretList.splice(index, 1);
    }
  });
});
