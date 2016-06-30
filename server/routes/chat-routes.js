'use strict';
const _ = require('lodash');

const ChatMsgModel = require('../db/chat-msg').ChatMsg;

function addRoomToSocket(socket, room) {
  if (!socket.tioRooms) {
    socket.tioRooms = [];
  }
  if (_.findIndex(socket.tioRooms, (a)=>a===room) === -1) {
    socket.tioRooms.push(room);
  }
}

function addChatRoutes(app, io) {
  function getUsersForRoom(room) {
    let roomUsers = [];
    if (io.sockets.adapter.rooms[room]) {
      for(var clientId in io.sockets.adapter.rooms[room].sockets) {
        let client_socket = io.sockets.connected[clientId];//Do whatever you want with this
        if (client_socket && client_socket.decoded_token && client_socket.decoded_token.user) {
          roomUsers.push(client_socket.decoded_token.user);
        }
      }
    }
    roomUsers = _.uniq(roomUsers);
    return roomUsers;
  }

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



      ChatMsgModel.find({roomId: room})
        .sort({'timestamp': -1})
        .limit(100)
        .sort({'timestamp': 1})
        .exec()
        .then((docs)=> {
          socket.emit('chat:init', {roomId: room, msgs: docs} )
        });
      // TODO: should this be seperate from chat:join?
      let roomUsers = getUsersForRoom(room);

      socket.emit('user:init', { roomId: room, users: roomUsers });
      socket.join(room);
      io.to(room).emit('user:join', {roomId: room, user: socket.decoded_token.user});
    });

    socket.on('chat:add', (msg)=>{
      msg.fromUser = socket.decoded_token.user;
      let chat = new ChatMsgModel(msg);
      chat.save()
        .then((doc)=>{
          msg.timestamp = Date.now();
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
      let users = getUsersForRoom(room);
      if(_.findIndex(users, (a)=>a===socket.decoded_token.user) === -1) {
        io.to(room).emit('user:leave', {roomId: room, user: socket.decoded_token.user});
      }
    });

    socket.on('disconnect', () => {
      _.each(socket.tioRooms, (room) => {
        let users = getUsersForRoom(room);
        if(_.findIndex(users, (a)=>a===socket.decoded_token.user) === -1) {
          io.to(room).emit('user:leave', {roomId: room, user: socket.decoded_token.user});
        }
      });
    });

    socket.on('reconnect', ()=> {
      console.log('reconnected');
      _.each(socket.tioRooms, (room) => {
        io.to(room).emit('user:join', {roomId: room, user: socket.decoded_token.user});
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
