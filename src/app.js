import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import noteRoutes from "./routes/notesRoutes.js";


const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("smart_notes api is running ");
});

export default app;