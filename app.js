require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');

// Mongoose model
const Vocabulary = require('./models/vocab.model');
const errorMiddleware = require('./middlewares/error.middleware');

// Routes (bular sizda alohida fayllarda saqlanadi)
const postRouter = require('./routes/post.route');
const authRouter = require('./routes/auth.route');
const adminRouter = require('./routes/admin.route');
const userRouter = require('./routes/user.route');
const savodxonTestRouter = require('./routes/test.route');
const statRouter = require("./routes/stat.route");
const vocabRouter = require("./routes/vocab.route");
const readingTestRouter = require("./routes/readingTest.route");
const savRouter = require("./routes/sav.route");
const grammarTestRouter = require('./routes/grammar.route');
const testRouter1 = require("./routes/test1.route");
const listeningRouter = require("./routes/listening.route");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://192.168.1.11:5173",
  "http://192.168.1.11:1000",
  "http://192.168.100.99:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS bloklandi"));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// MongoDB ulanish
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Multer config for Vercel (faqat /tmp ruxsat etilgan)
const upload = multer({ dest: '/tmp' });

// Routers
app.use('/api/post', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use("/api/stat", statRouter);
app.use("/api/vocab", vocabRouter);
app.use('/api/readingTest', readingTestRouter);
app.use('/api/savodxon/test', savodxonTestRouter);
app.use('/api/sav', savRouter);
app.use('/api/grammar', grammarTestRouter);
app.use('/api/test', testRouter1);
app.use('/api/listening', listeningRouter);

// Bulk vocab insert
app.post('/api/vocab/add/bulk', async (req, res) => {
  const list = req.body;
  if (!Array.isArray(list) || list.length === 0) {
    return res.status(400).json({ error: 'Empty array yoki noto‘g‘ri format' });
  }
  try {
    const inserted = await Vocabulary.insertMany(list, { ordered: false });
    res.json({ message: 'Bulk vocabulary added', count: inserted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// Whisper transcription
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
app.post('/api/speaking-mock', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));
    formData.append('model', 'whisper-1');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders()
      }
    });

    const transcript = response.data.text;
    res.json({ transcript });
  } catch (err) {
    console.error("❌ Whisper error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

// Writing check (IELTS)
app.post("/api/check-writing", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "No text provided" });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an IELTS writing examiner. Evaluate the task based on:
- Task Achievement
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy

Format:
Feedback: ...
Score: X.X`
          },
          { role: "user", content: text }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const feedback = response.data.choices?.[0]?.message?.content || "No feedback";
    const scoreMatch = feedback.match(/Score:\s*([\d.]+)/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    res.json({ feedback, score });
  } catch (err) {
    console.error("❌ Writing check error:", err.response?.data || err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Error middleware
app.use(errorMiddleware);

// Serverless export
module.exports = serverless(app);
