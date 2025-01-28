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

// Middleware
app.use(cors());
app.use(express.json());

// 🚀 Retrieve all artworks
app.get("/artworks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM artworks");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving artworks:", error);
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
});

// 🚀 Retrieve artwork by ID
app.get("/artworks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM artworks WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving artwork:", error);
    res.status(500).json({ error: "Failed to fetch artwork" });
  }
});

app.get('/', (req, res) => {
  res.send('Lets go baby! Its heck time to rock,come Update NEWWW!!!');
});


app.get('/health', (req, res) => {
  res.send('great!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
