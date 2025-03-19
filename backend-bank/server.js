import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import NodeCache from "node-cache";
import cluster from "cluster";
import os from "os";
import OpenAI from "openai";
import { NlpManager } from "node-nlp";
import authRoutes from "./routes/auth.js";
// Add this import near the other route imports
import adminRoutes from "./routes/admin.js";
// Add this import near the other route imports
import transferRoutes from "./routes/transfers.js";

// Load environment variables
dotenv.config();

// Initialize cache for NLP responses
const nlpCache = new NodeCache({ stdTTL: 3600 });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Add request ID to each request
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Request logging
app.use(
  morgan(
    ":method :url :status :response-time ms - :req[content-length] - :req[id]"
  )
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Terlalu banyak permintaan, coba lagi nanti" },
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 chat requests per minute
  message: { error: "Terlalu banyak permintaan chat, coba lagi nanti" },
});

app.use("/api/", apiLimiter);
app.use("/api/chat", chatLimiter);

// Debugging ENV variables
console.log("🔍 Environment:", process.env.NODE_ENV || "development");
console.log(
  "🔍 MongoDB URI:",
  process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "🔍 OpenAI API Key:",
  process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "🔍 WhatsApp CS Number:",
  process.env.WHATSAPP_CS ? `✅ ${process.env.WHATSAPP_CS}` : "❌ Missing"
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

// Database Schemas
const ChatSchema = new mongoose.Schema({
  userId: String,
  userMessage: String,
  botResponse: String,
  useNLP: Boolean,
  responseTime: Number,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", ChatSchema);

const FeedbackSchema = new mongoose.Schema({
  userId: String,
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  rating: Number, // 1-5
  comment: String,
  timestamp: { type: Date, default: Date.now },
});
const Feedback = mongoose.model("Feedback", FeedbackSchema);

const SupportRequestSchema = new mongoose.Schema({
  userId: String,
  message: String,
  phoneNumber: String,
  status: {
    type: String,
    enum: ["pending", "processing", "resolved"],
    default: "pending",
  },
  timestamp: { type: Date, default: Date.now },
});
const SupportRequest = mongoose.model("SupportRequest", SupportRequestSchema);

// OpenAI Configuration
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// NLP.js Setup
const manager = new NlpManager({ languages: ["id"] });
let isNlpReady = false; // Flag untuk mengecek apakah NLP sudah siap

// Tambahkan intent (pola pertanyaan & jawaban)
// Greetings
manager.addDocument("id", "halo", "greeting");
manager.addDocument("id", "hai", "greeting");
manager.addDocument("id", "selamat pagi", "greeting");
manager.addDocument("id", "selamat siang", "greeting");
manager.addDocument("id", "selamat sore", "greeting");
manager.addDocument("id", "selamat malam", "greeting");

// Identity
manager.addDocument("id", "siapa kamu?", "identity");
manager.addDocument("id", "kamu siapa?", "identity");
manager.addDocument("id", "dengan siapa saya berbicara?", "identity");
manager.addDocument("id", "ini layanan apa?", "identity");

// About CBank
manager.addDocument("id", "apa itu Cbank?", "about_cbank");
manager.addDocument("id", "ceritakan tentang Cbank", "about_cbank");
manager.addDocument("id", "informasi tentang Cbank", "about_cbank");
manager.addDocument("id", "Cbank itu apa?", "about_cbank");

// Interest Rates
manager.addDocument("id", "bunga tabungan di Cbank?", "interest_rate");
manager.addDocument("id", "berapa suku bunga tabungan?", "interest_rate");
manager.addDocument("id", "suku bunga deposito?", "interest_rate");
manager.addDocument("id", "bunga KPR berapa?", "interest_rate");
manager.addDocument("id", "berapa persen bunga pinjaman?", "interest_rate");
manager.addDocument("id", "bunga kartu kredit?", "interest_rate");

// Branch Locations
manager.addDocument("id", "dimana cabang terdekat?", "nearest_branch");
manager.addDocument("id", "lokasi ATM Cbank?", "nearest_branch");
manager.addDocument("id", "alamat kantor Cbank?", "nearest_branch");
manager.addDocument("id", "Cbank di kota mana saja?", "nearest_branch");

// Cashback and Promotions
manager.addDocument("id", "cashback transaksi internasional?", "cashback");
manager.addDocument("id", "apakah ada program cashback?", "cashback");
manager.addDocument("id", "promo kartu kredit?", "cashback");
manager.addDocument("id", "diskon dengan kartu Cbank?", "cashback");
manager.addDocument("id", "reward point?", "cashback");

// Account Opening
manager.addDocument("id", "cara buka rekening", "open_account");
manager.addDocument("id", "syarat buka tabungan", "open_account");
manager.addDocument("id", "dokumen untuk membuka rekening", "open_account");
manager.addDocument("id", "bisakah membuka rekening online?", "open_account");
manager.addDocument("id", "berapa setoran awal?", "open_account");

// Mobile Banking
manager.addDocument("id", "cara daftar mobile banking", "mobile_banking");
manager.addDocument("id", "aktivasi aplikasi Cbank", "mobile_banking");
manager.addDocument("id", "lupa password mobile banking", "mobile_banking");
manager.addDocument("id", "fitur aplikasi Cbank", "mobile_banking");
manager.addDocument("id", "biaya transaksi di aplikasi", "mobile_banking");

// Credit Cards
manager.addDocument("id", "cara apply kartu kredit", "credit_card");
manager.addDocument("id", "syarat pengajuan kartu kredit", "credit_card");
manager.addDocument("id", "limit kartu kredit", "credit_card");
manager.addDocument("id", "jenis kartu kredit Cbank", "credit_card");
manager.addDocument("id", "cara bayar tagihan kartu kredit", "credit_card");

// Loans
manager.addDocument("id", "pengajuan KPR", "loans");
manager.addDocument("id", "syarat pinjaman", "loans");
manager.addDocument("id", "kredit tanpa agunan", "loans");
manager.addDocument("id", "pinjaman modal usaha", "loans");
manager.addDocument("id", "jangka waktu kredit", "loans");

// Customer Service
manager.addDocument("id", "nomor customer service", "customer_service");
manager.addDocument("id", "cara menghubungi CS", "customer_service");
manager.addDocument("id", "jam layanan call center", "customer_service");
manager.addDocument("id", "email pengaduan", "customer_service");
manager.addDocument("id", "komplain layanan", "customer_service");

// Tambahkan entitas untuk ekstraksi informasi spesifik
manager.addNamedEntityText(
  "product",
  "tabungan",
  ["id"],
  ["tabungan", "rekening", "simpanan"]
);
manager.addNamedEntityText(
  "product",
  "kredit",
  ["id"],
  ["kredit", "pinjaman", "kpr", "kta"]
);
manager.addNamedEntityText(
  "product",
  "kartu",
  ["id"],
  ["kartu kredit", "kartu debit", "cc", "atm"]
);

// Jawaban untuk intent
manager.addAnswer(
  "id",
  "greeting",
  "Halo! Selamat datang di Cbank. Apa yang bisa saya bantu hari ini?"
);

manager.addAnswer(
  "id",
  "identity",
  "Saya adalah asisten virtual Cbank yang siap membantu Anda dengan informasi seputar layanan perbankan kami. Silakan tanyakan apa yang ingin Anda ketahui."
);

manager.addAnswer(
  "id",
  "about_cbank",
  "Cbank adalah institusi keuangan terkemuka yang menyediakan berbagai layanan perbankan seperti tabungan, deposito, kredit, kartu kredit, dan investasi. Kami telah melayani jutaan nasabah di Indonesia dengan komitmen untuk memberikan solusi keuangan terbaik dan inovatif."
);

manager.addAnswer(
  "id",
  "interest_rate",
  "Suku bunga di Cbank bervariasi tergantung produk:\n\n• Tabungan reguler: 2.5% per tahun\n• Deposito: 3.5% - 5.5% tergantung tenor\n• KPR: mulai dari 7.5% per tahun\n• KTA: mulai dari 9.5% per tahun\n• Kartu Kredit: 2.25% per bulan\n\nSilakan kunjungi website resmi kami atau hubungi customer service untuk informasi terbaru dan penawaran khusus."
);

manager.addAnswer(
  "id",
  "nearest_branch",
  "Cbank memiliki lebih dari 500 cabang dan 1,200 ATM di seluruh Indonesia. Untuk menemukan lokasi cabang atau ATM terdekat, Anda dapat:\n\n1. Menggunakan fitur 'Lokasi' di aplikasi mobile Cbank\n2. Mengunjungi website kami di bagian 'Jaringan Cabang'\n3. Menghubungi call center kami di 1500-123\n\nMohon beri tahu kota atau area Anda untuk informasi lebih spesifik."
);

manager.addAnswer(
  "id",
  "cashback",
  "Cbank memiliki berbagai program cashback dan promo menarik:\n\n• Cashback 5% untuk transaksi di merchant F&B dengan kartu kredit\n• Cashback hingga 10% untuk transaksi e-commerce\n• Diskon hingga 20% di merchant partner\n• Program point reward yang dapat ditukarkan dengan hadiah menarik\n\nPromo berlaku untuk periode tertentu. Silakan cek website atau aplikasi Cbank untuk informasi promo terbaru."
);

manager.addAnswer(
  "id",
  "open_account",
  "Untuk membuka rekening di Cbank, Anda memerlukan:\n\n• KTP (wajib)\n• NPWP (jika ada)\n• Setoran awal minimal Rp 250.000\n\nAnda dapat membuka rekening melalui:\n1. Kunjungan ke cabang terdekat\n2. Aplikasi Cbank secara online (eKYC)\n3. Website resmi kami\n\nProses pembukaan rekening online hanya membutuhkan waktu sekitar 10 menit dan kartu akan dikirimkan ke alamat Anda."
);

manager.addAnswer(
  "id",
  "mobile_banking",
  "Aplikasi Mobile Banking Cbank menawarkan berbagai fitur:\n\n• Transfer dana real-time\n• Pembayaran tagihan\n• Top-up e-wallet\n• Pembelian pulsa dan paket data\n• Pembukaan deposito\n• Pengajuan kredit\n• Informasi saldo dan mutasi rekening\n\nUntuk mendaftar, download aplikasi Cbank di App Store atau Play Store, lalu ikuti petunjuk pendaftaran dengan menyiapkan kartu ATM dan nomor rekening Anda."
);

manager.addAnswer(
  "id",
  "credit_card",
  "Kartu Kredit Cbank tersedia dalam beberapa varian:\n\n• Cbank Classic: Limit mulai 5 juta\n• Cbank Gold: Limit mulai 10 juta\n• Cbank Platinum: Limit mulai 25 juta\n• Cbank Signature: Limit mulai 50 juta\n\nSyarat pengajuan:\n- WNI berusia 21-65 tahun\n- Penghasilan minimum 3 juta per bulan\n- Fotokopi KTP dan slip gaji\n\nAnda dapat mengajukan melalui aplikasi, website, atau kunjungan ke cabang."
);

manager.addAnswer(
  "id",
  "loans",
  "Cbank menawarkan berbagai produk pinjaman:\n\n• KPR: Bunga mulai 7.5%, tenor hingga 20 tahun\n• KTA: Bunga mulai 9.5%, plafon hingga 300 juta\n• Kredit Usaha: Bunga kompetitif dengan tenor fleksibel\n• Kredit Pendidikan: Khusus untuk biaya pendidikan\n\nPersyaratan umum:\n- KTP dan KK\n- Slip gaji atau bukti penghasilan\n- Rekening koran 3 bulan terakhir\n\nProses persetujuan KTA secepat 3 hari kerja."
);

manager.addAnswer(
  "id",
  "customer_service",
  "Anda dapat menghubungi Customer Service Cbank melalui:\n\n• Call Center: 1500-123 (24/7)\n• Email: cs@cbank.co.id\n• WhatsApp: 082117763760\n• Live Chat di website atau aplikasi\n• Media sosial: @CbankID\n\nJam layanan cabang: Senin-Jumat 08.00-15.00, Sabtu 08.00-12.00 (kecuali libur nasional)."
);

// Latih NLP dan tunggu hingga selesai
(async () => {
  try {
    console.log("🔄 Training NLP model...");
    await manager.train();
    manager.save("./model.nlp");
    isNlpReady = true;
    console.log("✅ NLP Model is trained and ready to use.");
  } catch (error) {
    console.error("❌ Error training NLP model:", error);
    // Tetap jalankan server meskipun training gagal
    isNlpReady = false;
  }
})();

// Fungsi untuk mengirim pesan WhatsApp (simulasi)
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    // Implementasi dengan WhatsApp Business API atau layanan pihak ketiga
    console.log(`📱 Sending WhatsApp message to ${phoneNumber}: ${message}`);
    return { success: true };
  } catch (error) {
    console.error("❌ WhatsApp sending error:", error);
    return { success: false, error };
  }
}

// API Routes
app.use("/api/auth", authRoutes);
// Add this route middleware after the other app.use statements
app.use("/api/admin", adminRoutes);
// Add this route middleware after the other app.use statements
app.use("/api/transfers", transferRoutes);

// Chatbot Route dengan NLP.js + OpenAI
app.post(
  "/api/chat",
  [
    body("userId").notEmpty().isString(),
    body("message").notEmpty().isString().trim(),
    body("useNLP").isBoolean(),
  ],
  async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, message, useNLP = true } = req.body;
    const startTime = Date.now();

    // Pastikan model NLP sudah siap sebelum menerima pertanyaan
    if (useNLP && !isNlpReady) {
      return res.status(503).json({
        error: "NLP model is still training. Please try again later.",
      });
    }

    try {
      let responseText;
      const userMessage = message.trim();
      const userMessageLower = userMessage.toLowerCase();

      // Log request
      console.log(`📩 Chat request from ${userId}: "${userMessage}"`);

      if (useNLP) {
        // Cek cache untuk respons NLP
        const cacheKey = `nlp_${userMessageLower}`;
        let nlpResult = nlpCache.get(cacheKey);

        if (!nlpResult) {
          nlpResult = await manager.process("id", userMessageLower);
          nlpCache.set(cacheKey, nlpResult);
        }

        responseText = nlpResult.answer;

        // Jika NLP tidak menemukan jawaban, gunakan OpenAI
        if (!responseText) {
          console.log(`⚠️ No NLP match for: "${userMessage}", using OpenAI...`);

          try {
            const openaiResponse = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "Anda adalah asisten virtual Cbank yang hanya memberikan informasi perbankan dalam Bahasa Indonesia. Berikan jawaban yang informatif dan ramah. Jangan menjawab di luar konteks perbankan. Jika Anda tidak yakin, sarankan pengguna untuk menghubungi customer service.",
                },
                { role: "user", content: userMessage },
              ],
              temperature: 0.7,
              max_tokens: 500,
            });

            responseText = openaiResponse.choices[0]?.message?.content || null;
          } catch (openaiError) {
            if (openaiError.code === "insufficient_quota") {
              console.error("❌ OpenAI Quota Habis!");
              responseText = null;
            } else {
              throw openaiError; // Lempar error jika bukan karena kuota habis
            }
          }
        }
      } else {
        // Langsung gunakan OpenAI jika useNLP=false
        try {
          const openaiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "Anda adalah asisten virtual Cbank yang hanya memberikan informasi perbankan dalam Bahasa Indonesia. Berikan jawaban yang informatif dan ramah. Jangan menjawab di luar konteks perbankan. Jika Anda tidak yakin, sarankan pengguna untuk menghubungi customer service.",
              },
              { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 500,
          });

          responseText = openaiResponse.choices[0]?.message?.content || null;
        } catch (openaiError) {
          if (openaiError.code === "insufficient_quota") {
            console.error("❌ OpenAI Quota Habis!");
            responseText = null;
          } else {
            throw openaiError;
          }
        }
      }

      // Hitung waktu respons
      const responseTime = Date.now() - startTime;

      // Simpan chat ke database
      const chatEntry = new Chat({
        userId,
        userMessage: message,
        botResponse: responseText,
        useNLP,
        responseTime,
      });
      await chatEntry.save();

      // Log respons
      console.log(
        `📤 Bot response to ${userId} in ${responseTime}ms: "${responseText.substring(
          0,
          50
        )}..."`
      );

      res.json({ response: responseText, chatId: chatEntry._id });
    } catch (error) {
      console.error("❌ Chatbot API Error:", error);
      res.status(500).json({
        error: "Failed to process chat request",
        requestId: req.id,
      });
    }
  }
);

// Endpoint untuk menerima feedback
app.post(
  "/api/feedback",
  [
    body("userId").notEmpty().isString(),
    body("chatId").notEmpty().isString(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").optional().isString(),
  ],
  async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, chatId, rating, comment } = req.body;

    try {
      const feedback = new Feedback({
        userId,
        chatId,
        rating,
        comment,
      });
      await feedback.save();

      // Gunakan feedback untuk meningkatkan model NLP (jika rating rendah)
      if (rating < 3) {
        // Tandai untuk review manual
        console.log(
          `⚠️ Low rating feedback received: ${comment} for chat ${chatId}`
        );

        // Ambil chat yang terkait
        const chat = await Chat.findById(chatId);
        if (chat) {
          console.log(`⚠️ Original query: "${chat.userMessage}"`);
          console.log(`⚠️ Bot response: "${chat.botResponse}"`);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("❌ Feedback error:", error);
      res.status(500).json({ error: "Gagal menyimpan feedback" });
    }
  }
);

// Endpoint untuk mengirim chat langsung ke CS
app.post(
  "/api/support",
  [
    body("userId").notEmpty().isString(),
    body("message").notEmpty().isString(),
    body("phoneNumber").optional().isString(),
  ],
  async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, message, phoneNumber } = req.body;

    try {
      const supportRequest = new SupportRequest({
        userId,
        message,
        phoneNumber,
        status: "pending",
      });
      await supportRequest.save();

      // Kirim notifikasi ke tim CS (opsional)
      if (phoneNumber) {
        const csMessage = `Permintaan bantuan baru dari user ${userId}: "${message}"`;
        await sendWhatsAppMessage(
          process.env.CS_NOTIFICATION_NUMBER,
          csMessage
        );
      }

      res.json({ success: true, requestId: supportRequest._id });
    } catch (error) {
      console.error("❌ Support request error:", error);
      res.status(500).json({ error: "Gagal mengirim permintaan bantuan" });
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  // Log error ke sistem monitoring (contoh: Sentry)
  // Sentry.captureException(err);

  // Kirim respons yang sesuai berdasarkan jenis error
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: "Data tidak valid", details: err.message });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(409).json({ error: "Konflik data" });
  }

  // Error default
  res.status(500).json({
    error: "Terjadi kesalahan pada server",
    requestId: req.id,
  });
});

// Jika menggunakan clustering
if (process.env.USE_CLUSTER === "true" && cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`🚀 Master process running. Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
