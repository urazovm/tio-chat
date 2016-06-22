'use strict';
const _ = require('lodash');

const ChatMsgModel = require('../db/chat-msg').ChatMsg;

function addRoomToSocket(socket, room) {
  if (!socket.tioRooms) {
    socket.tioRooms = [];
  }
  if (_.findIndex(socket.tioRooms, room) === -1) {
    socket.tioRooms.push(room);
  }
}

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

      addRoomToSocket(socket, room);



      ChatMsgModel.find({roomId: room}).exec()
        .then((docs)=> {
          socket.emit('chat:init', {roomId: room, msgs: docs} )
        });
      /* TODO: this example code might work?
      let roomUsers = [];
       const clients_in_the_room = io.sockets.adapter.rooms[room];
       for (var clientId in clients_in_the_room ) {
       console.log('client: %s', clientId); //Seeing is believing
       var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
       }
       */
      socket.join(room);
      io.to(room).emit('user:join', socket.decoded_token.user);
    });

    socket.on('chat:add', (msg)=>{
      msg.fromUser = socket.decoded_token.user;
      let chat = new ChatMsgModel(msg);
      chat.save()
        .then(()=>{
          io.to(msg.roomId).emit('chat:add', msg);
        });
    });

    socket.on('chat:leave', (room)=> {
      socket.leave(room);
      if(socket.tioRooms) {
        socket.tioRooms = _.filter(socket.tioRooms, (socketRoom) =>{
          return socketRoom !== room
        });
      }
      io.to(room).emit('user:leave', socket.decoded_token.user);
    });

    socket.on('disconnect', () => {
      _.each(socket.tioRooms, (room) => {
        io.to(room).emit('user:leave', socket.decoded_token.user);
      });
    });

    socket.on('reconnect', ()=> {
      _.each(socket.tioRooms, (room) => {
        io.to(room).emit('user:join', socket.decoded_token.user);
      });
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
