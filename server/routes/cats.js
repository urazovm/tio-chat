
var catFeedRoom = 'taran-feed-cats';

module.exports.setupCatRoutes = function( app, io ) {
  io.on( 'connection', function (socket) {
    socket.on( 'watchFeed', function() {
      socket.join( catFeedRoom );
      socket.on( 'reconnect', function() {
        socket.join( catFeedRoom );
      });
    });
  });

  app.get( '/feedCats', function( req, res ) {
    io.to( catFeedRoom ).emit( 'feed:cats', { feed: 'cats' } );
    res.send( 'feeding successful' );
  });
};
