require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Routes
const postRouter = require('./routes/post.route');
const authRouter = require('./routes/auth.route');
const adminRouter = require('./routes/admin.route');
const userRouter = require('./routes/user.route');
const statRouter = require('./routes/stat.route');
const vocabRouter = require('./routes/vocab.route');
const readingRouter = require('./routes/readingTest.route');
const savodxonRouter = require('./routes/test.route');
const savRouter = require('./routes/sav.route');
const grammarRouter = require('./routes/grammar.route');
const testRouter1 = require('./routes/test1.route');
const listeningRouter = require('./routes/listening.route');
const demoRouter = require('./routes/demo.route');
const errorMiddleware = require('./middlewares/error.middleware');
const Vocabulary = require('./models/vocab.model');

const app = express();

// === CORS ===
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://192.168.1.11:5173",
  "http://192.168.1.11:1000",
  "http://192.168.100.99:5173",
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS blocked"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// === Routes ===
app.use('/api/post', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/stat', statRouter);
app.use('/api/vocab', vocabRouter);
app.use('/api/readingTest', readingRouter);
app.use('/api/savodxon/test', savodxonRouter);
app.use('/api/sav', savRouter);
app.use('/api/grammar', grammarRouter);
app.use('/api/test', testRouter1);
app.use('/api/listening', listeningRouter);
app.use('/api/demo', demoRouter);

// === Bulk vocab add ===
app.post('/api/vocab/add/bulk', async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).json({ error: 'Empty array or invalid format' });
    }
    const inserted = await Vocabulary.insertMany(list, { ordered: false });
    res.json({ message: 'Added', count: inserted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// === Speaking mock (Whisper) ===
const upload = multer({ dest: 'uploads/' });
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.post('/api/speaking-mock', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const transcript = await transcribeAudio(req.file.path);
    res.json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transcription error' });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

async function transcribeAudio(audioPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioPath));
  formData.append('model', 'whisper-1');

  const res = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...formData.getHeaders()
    }
  });
  return res.data.text;
}

// === Writing check ===
app.post('/api/check-writing', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an IELTS examiner...' },
          { role: 'user', content: text }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const feedback = response.data.choices?.[0]?.message?.content || '';
    const match = feedback.match(/Score:\s*([\d.]+)/i);
    const score = match ? parseFloat(match[1]) : null;

    res.json({ feedback, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Check writing failed' });
  }
});

app.use(errorMiddleware);

// === MongoDB ===
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ DB connected")).catch(err => console.error("❌ DB Error:", err));

// === Export for Vercel ===
module.exports.handler = serverless(app);
