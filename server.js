const {Client} = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  database : process.env.RDS_DB_NAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT || 5432
});

console.log(process.env.RDS_HOSTNAME)
console.log(process.env.RDS_USERNAME)
console.log(process.env.RDS_PASSWORD)
console.log(process.env.RDS_DB_NAME)
console.log(process.env.RDS_PORT)

// client.connect(function(err) {
//   if (!err) {
//     console.log('Connected to database.');
//   } else { 
//     console.error('Database connection failed: ' + err.stack);
//   }
//   client.end;
  
// });

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/health', (req, res) => {
  res.send('great!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});