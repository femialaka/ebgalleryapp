require("dotenv").config();
const {Client} = require('pg');
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
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

// AWS S3 & Rekognition setup
const s3 = new S3Client({ region: "eu-west-2" });
const rekognition = new RekognitionClient({ region: "eu-west-2" });

// Multer (Handles Image Uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image & analyze labels
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = `${Date.now()}-${file.originalname}`;
    
    // Upload image to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const imageUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`;

    // Call AWS Rekognition for image analysis
    const rekognitionParams = {
      Image: { S3Object: { Bucket: process.env.S3_BUCKET, Name: fileName } },
      MaxLabels: 5,
    };
    
    const detectLabelsResponse = await rekognition.send(new DetectLabelsCommand(rekognitionParams));
    const labels = detectLabelsResponse.Labels.map(label => label.Name);

    // Save to database
    const query = `INSERT INTO images (image_url, labels) VALUES ($1, $2) RETURNING *`;
    const values = [imageUrl, labels];
    await pool.query(query, values);

    res.json({ imageUrl, labels });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

app.get('/', (req, res) => {
  res.send('Lets go baby! Its heck time to rock,come Update NEWWW!!!');
});

// Get all images
app.get("/images", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM images ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));