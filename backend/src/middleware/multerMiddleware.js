
import multer from 'multer';
import fs from 'fs';
import {dirname, join} from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Option 1: Use /tmp directory (works in Lambda and most environments)
const uploadDir = '/tmp/uploads';

// Option 2: Use a relative path from your current directory
// const uploadDir = join(__dirname, '../../uploads');

// Create directory with error handling
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error('Error creating upload directory:', error);
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
