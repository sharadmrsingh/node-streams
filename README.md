# 🌀 Node Streams — Complete Reference Server

A full-featured **Node.js backend project** demonstrating **Readable, Writable, Transform, and Duplex streams** with real-world use cases.

---

## 🚀 Features
| # | Endpoint | Type | Description |
|---|-----------|------|-------------|
| 1️⃣ | `/csv` | Readable + Transform + Writable | Streams a CSV file and inserts each record into SQLite |
| 2️⃣ | `/video` | Readable | Serves video in chunks using Range requests |
| 3️⃣ | `/file/download` | Readable | Streams a large file directly for download |
| 4️⃣ | `/file/upload` | Writable | Streams file uploads from client (any file type) |
| 5️⃣ | `/file/transform` | Transform | Compresses file using `zlib.createGzip()` |
| 6️⃣ | `/pipeline` | Pipeline | Demonstrates `stream.pipeline()` for safe chaining |
| 7️⃣ | `/stats` | Custom Readable | Streams server memory stats in real time |
| 8️⃣ | `/buffered` | Read vs Streamed | Benchmarks buffered vs streamed file reading |

---

## 🧩 Directory Structure

```
node-streams/
├── data/
│ ├── sample.csv
│ ├── large.txt
│ └── pipeline.gz
├── uploads/
│ └── uploaded.txt
├── videos/
│ └── sample.mp4
├── public/
│ └── upload.html
├── db.js
├── index.js
├── swagger.yaml
└── README.md
```
---

## ⚙️ Run Locally

```bash
npm install
npm run dev
```

Open your browser:

📄 Swagger Docs → http://localhost:8000/api-docs

📤 Upload UI → http://localhost:8000/upload.html

🎥 Video Test → http://localhost:8000/video

---

## 🧠 Stream Concepts Covered

Readable Streams: File read, video stream, stats stream

Writable Streams: Upload endpoint

Transform Streams: Compression (zlib.createGzip())

Pipeline: Robust stream chaining

Backpressure handling & memory comparison

---

## 🛠️ Tech Stack

- Node.js
 
- Express
 
- fast-csv
 
- SQLite3
 
- Zlib
 
- Swagger UI
 
- Nodemon

---

## 📚 Learning Goal

This project helps backend developers deeply understand how Node streams work under the hood — essential for scalable data-heavy services like:

Video streaming

CSV/ETL jobs

File uploads/downloads

Log processing

Real-time analytics pipelines

---

## 🧑‍💻 Contributing

Contributions welcome — feel free to open issues or PRs. Suggested improvements:

Feel free to fork this project and submit pull requests.
Suggestions and improvements are always welcome!

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

---

**Built with ❤️ using Node.js.**