const cors = require("cors");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Client } = rquire("pg");

const client = new Client({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  database : process.env.RDS_DB_NAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT || 5432
});


  await client.connect()

  console.log(await client.query('SELECT NOW()'))
 
  await client.end()

  // console.log(process.env.RDS_HOSTNAME)
  // console.log(process.env.RDS_USERNAME)
  // console.log(process.env.RDS_PASSWORD)
  // console.log(process.env.RDS_DB_NAME)
  // console.log(process.env.RDS_PORT)



app.get('/', (req, res) => {
  res.send('Lets go baby! Its heck time to rock,come Update WHY is it not working NEWWWWWWW!!!');
});


app.get('/health', (req, res) => {
  res.send('great!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
