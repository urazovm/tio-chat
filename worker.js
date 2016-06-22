
var mongoose = require('mongoose');
var dbURI = process.env.MONGODB_URI || 'mongodb://localhost/urf3';
mongoose.connect(dbURI);

var db = mongoose.connection;

const periodic = require('./server/worker/periodic');
const rankings = require('./server/worker/rankings');
const User = require('./server/db/user').getUserModel(mongoose);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log( 'Worker connected to MongoDB' );

  setInterval(()=>{
    rankings.updateRankings(mongoose);
  }, 1000*60*10);

  periodic.setupPeriodicTasks(mongoose);
  rankings.updateRankings(mongoose);
});


//Todo: set up worker stuff?
