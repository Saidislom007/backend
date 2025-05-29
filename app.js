require('dotenv').config();
const express = require('express');
const postRouter = require('./routes/post.route');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthRouter = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error.middleware');
const axios = require("axios");
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const adminRouter = require('./routes/admin.route');
const leaderRouter = require('./routes/user.route');
const savodxonTestRouter = require('./routes/test.route')
const statistikaRoutes = require("./routes/stat.route");
const vocabRouter = require("./routes/vocab.route");
const readingTestRouter = require("./routes/readingTest.route");
const savRouter = require("./routes/sav.route");
const grammarTestRouter = require('./routes/grammar.route');
const testRouter1 = require("./routes/test1.route")
const listeningRouter = require("./routes/listening.route")

const router = express.Router();
const Vocabulary = require('./models/vocab.model');
const { compareSync } = require('bcrypt');

const app = express();

// CORS Middleware Configuration
const allowedOrigins = [
  "http://localhost:5173",  // Front-end localhost port
  "http://localhost:3000",  // Another possible front-end port
  "http://192.168.1.11:5173", // Custom IP
  "http://192.168.1.11:1000",
  "http://192.168.100.99:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS bloklandi"));
      }
    },
    credentials: true  // Allow credentials (cookies)
  })
);

app.use(cookieParser());
app.use(express.json());  // Parse JSON request bodies

// Routing for various API paths
app.use('/api/post', postRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', leaderRouter);

app.use("/api/stat",statistikaRoutes)
app.use("/api/vocab",vocabRouter)
app.use('/api/readingTest',readingTestRouter)
app.use('/api/savodxon/test',savodxonTestRouter)
app.use('/api/sav',savRouter)
app.use('/api/grammar',grammarTestRouter)
app.use('app/test',testRouter1),
app.use('api/listening',listeningRouter)
app.use('/api/demo', require('./routes/demo.route'));

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// OpenAI API Configuration for Whisper
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';
router.post('/api/vocab/add/bulk', async (req, res) => {
  const list = req.body; 
  if (!Array.isArray(list) || list.length === 0) {
    return res.status(400).json({ error: 'Empty array yoki noto‘g‘ri format' });
  }
  try {
    // insertMany avtomatik validatsiya qiladi va yangilarni qo‘shadi
    const inserted = await Vocabulary.insertMany(list, { ordered: false });
    res.json({ message: 'Bulk vocabulary added', count: inserted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});
// Endpoint to handle audio uploads and transcriptions using Whisper
app.post('/api/speaking-mock', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log("✅ Uploaded file:", req.file.path);

    // Transcribe the audio using Whisper
    const transcript = await transcribeAudio(req.file.path);
    if (!transcript) {
      return res.status(500).json({ error: 'Failed to transcribe audio' });
    }

    console.log("✅ Transcribed text:", transcript);

    // Return the result
    res.json({ transcript });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    fs.unlink(req.file.path, (err) => { // Delete file after processing
      if (err) console.error("❌ Error deleting file:", err);
    });
  }
});

// Function to transcribe audio using Whisper API
async function transcribeAudio(audioPath) {
  const audioData = fs.createReadStream(audioPath);
  const formData = new FormData();
  formData.append('file', audioData);
  formData.append('model', 'whisper-1');

  try {
    const response = await axios.post(OPENAI_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders()
      }
    });

    console.log("✅ Response from Whisper API:", response.data);

    if (!response.data || !response.data.text) {
      throw new Error("❌ Whisper API returned an invalid response!");
    }

    return response.data.text;
  } catch (error) {
    console.error("❌ Whisper Error:", error.response?.data || error.message);
    return null;
  }
}

// Endpoint to handle writing check (for IELTS-style feedback)
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
            content: `You are an IELTS writing examiner. Evaluate the provided IELTS Writing task based on:
            - Task Achievement
            - Coherence and Cohesion
            - Lexical Resource
            - Grammatical Range and Accuracy.
            
            Return the response in this exact format:
            
            Feedback: [Your detailed feedback here]
            Score: [X.X]`
          },
          { role: "user", content: text }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    console.log("✅ AI's response:", response.data);

    const feedback = response.data.choices?.[0]?.message?.content || "AI feedback not available.";
    const scoreMatch = feedback.match(/Score:\s*([\d.]+)/i);
    let score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    if (score !== null && (score < 1 || score > 9)) {
      score = null;  // Invalid score range (outside 1-9)
    }

    res.json({ feedback, score });

  } catch (error) {
    console.error("❌ Backend Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Use custom error handler middleware
app.use(errorMiddleware);

// Server Configuration and MongoDB Connection
const PORT = process.env.PORT || 5050;

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to DB');

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server listening on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error connecting with:", error);
  }
};

bootstrap();
