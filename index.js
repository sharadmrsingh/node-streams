import express from "express";
import fs from "fs";
import csv from "fast-csv";
import db from "./db.js";
import zlib from "zlib";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./swagger.yaml");


const app = express();
app.use(express.json());
app.use(express.static("public"));
// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const PORT = 8000;
app.use(express.json());

const asyncPipeline = promisify(pipeline);

// 🧠 1️⃣ CSV Stream Endpoint
app.get("/csv", (req, res) => {
  const FILE_PATH = "./data/sample.csv";
  if (!fs.existsSync(FILE_PATH)) return res.status(404).send("CSV file not found");

  const readStream = fs.createReadStream(FILE_PATH);
  const csvStream = csv.parse({ headers: true })
    .on("data", (row) => {
      if (!row.name || !row.email) return;
      db.run(
        "INSERT OR IGNORE INTO users (id, name, email, age) VALUES (?, ?, ?, ?)",
        [row.id, row.name, row.email, row.age],
        (err) => {
          if (err) console.error("DB Error:", err.message);
        }
      );
    })
    .on("end", () => console.log("✅ CSV processing complete!"));

  readStream.pipe(csvStream);
  res.json({ message: "CSV stream started..." });
});

// 🎬 2️⃣ Video Stream Endpoint
app.get("/video", (req, res) => {
  const videoPath = "./videos/sample.mp4";
  if (!fs.existsSync(videoPath)) return res.status(404).send("Video not found");

  const range = req.headers.range;
  if (!range) return res.status(400).send("Requires Range header");

  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 1 * 1e6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);
  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
});

// 📁 3️⃣ Large File Download Stream
app.get("/file/download", (req, res) => {
  const filePath = "./data/large.txt";
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  res.setHeader("Content-Disposition", "attachment; filename=large.txt");
  res.setHeader("Content-Type", "text/plain");
  fs.createReadStream(filePath).pipe(res);
});

// ⬆️ 4️⃣ File Upload Stream
app.post("/file/upload", (req, res) => {
  const outStream = fs.createWriteStream("./uploads/uploaded.txt");
  req.pipe(outStream);
  req.on("end", () => res.send("✅ File uploaded successfully!"));
});

// 🔄 5️⃣ Transform Stream (Compression)
app.get("/file/transform", (req, res) => {
  const src = "./data/large.txt";
  const dest = "./data/large.txt.gz";

  if (!fs.existsSync(src)) return res.status(404).send("File not found");

  const gzip = zlib.createGzip();
  const source = fs.createReadStream(src);
  const out = fs.createWriteStream(dest);

  pipeline(source, gzip, out, (err) => {
    if (err) {
      console.error("❌ Pipeline failed:", err);
      res.status(500).send("Compression failed");
    } else {
      res.send("✅ File compressed successfully!");
    }
  });
});

// 🧩 6️⃣ stream.pipeline() Demo
app.get("/pipeline", async (req, res) => {
  const source = Readable.from(["Stream ", "Pipeline ", "Demo ", "Works!"]);
  const transform = new zlib.Gzip();
  const dest = fs.createWriteStream("./data/pipeline.gz");

  await asyncPipeline(source, transform, dest);
  res.send("✅ Pipeline completed and file written!");
});

// 📊 7️⃣ Custom Readable Stream (Server Stats)
app.get("/stats", (req, res) => {
  res.setHeader("Content-Type", "text/plain");

  const statsStream = new Readable({
    read() {
      const memory = process.memoryUsage();
      const info = `Memory: ${(memory.rss / 1024 / 1024).toFixed(2)} MB\n`;
      this.push(info);
      setTimeout(() => this.push(null), 2000);
    },
  });

  statsStream.pipe(res);
});

// ⚡ 8️⃣ Buffered vs Streamed Read
app.get("/buffered", async (req, res) => {
  const filePath = "./data/large.txt";
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  console.time("Buffered");
  fs.readFileSync(filePath);
  console.timeEnd("Buffered");

  console.time("Streamed");
  await asyncPipeline(fs.createReadStream(filePath), fs.createWriteStream("./data/temp.txt"));
  console.timeEnd("Streamed");

  res.send("✅ Benchmark complete (check console)");
});

// 🏠 Root route
app.get("/", (req, res) => {
  res.send(`
    <h1>🌀 Node.js Streams Reference Server</h1>
    <ul>
      <li><a href="/csv">/csv</a> → CSV → DB Stream</li>
      <li>/video → Video Streaming(Open test.html)</li>
      <li><a href="/file/download">/file/download</a> → File Download</li>
      <li>/file/upload</a> → File Upload(Open http://localhost:8000/upload.html)</li>
      <li><a href="/file/transform">/file/transform</a> → Compression</li>
      <li><a href="/pipeline">/pipeline</a> → Pipeline Demo</li>
      <li><a href="/stats">/stats</a> → Server Stats Stream</li>
      <li><a href="/buffered">/buffered</a> → Buffered vs Streamed</li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
