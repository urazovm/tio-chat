'use strict';
const _ = require('lodash');

const ChatMsgModel = require('../db/chat-msg').ChatMsg;

function addChatRoutes(app, io) {
  io.on('authenticated', (socket)=> {
    socket.on('rooms:init', (rooms) => {
      ChatMsgModel.find()
        .distinct('roomId')
        .then((docs)=> {
          let rooms = _.pick(docs, 'roomId');
          socket.emit('rooms:init', rooms);
        });
    });

    socket.on('chat:join', (room) => {
      console.log('joined: ' + room);
      socket.join(room);
      ChatMsgModel.find({roomId: room}).exec()
        .then((docs)=> {
          socket.emit('chat:init', {roomId: room, msgs: docs} )
        });
    });

    socket.on('chat:add', (msg)=>{
      console.log('new message');
      msg.fromUser = socket.decoded_token.user;
      let chat = new ChatMsgModel(msg);
      console.log(chat);
      chat.save()
        .then(()=>{
          io.to(msg.roomId).emit('chat:add', msg);
        });
    });

    socket.on('chat:leave', (room)=> {
      socket.leave(room);
    });

    ChatMsgModel.find()
      .distinct('roomId')
      .then((docs)=> {
        let rooms = _.pick(docs, 'roomId');
        socket.emit('rooms:init', rooms);
      });
  });
}

module.exports.addChatRoutes = addChatRoutes;
