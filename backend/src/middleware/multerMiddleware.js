
import multer from 'multer';
import fs from 'fs';
import {dirname, join} from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadDir = join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;
