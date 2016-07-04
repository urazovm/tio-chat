var bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);


bcrypt.hash('test', salt, (err, hashedPass, c)=> {
  console.log(hashedPass);
  bcrypt.compare('test', hashedPass, (err, r)=> {
    console.log(r);
  });
});
