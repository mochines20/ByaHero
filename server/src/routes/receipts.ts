import { Router } from "express";
import multer from "multer";
import { deleteReceipt, uploadReceipt } from "../controllers/receiptsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(allowed ? null : new Error("Invalid file type"), allowed);
  },
});

router.use(authMiddleware);
router.post("/upload", upload.single("file"), uploadReceipt);
router.delete("/:id", deleteReceipt);

export default router;
