const mongoose = require('mongoose')

const connectDatabase =  () => {
    const url = process.env.DB_URL
  mongoose.connect(url);
 const db =  mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', () => {
    console.log('DB connected...');
})
      
}

module.exports = connectDatabase