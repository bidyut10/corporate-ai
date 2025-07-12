// Import the multer library for handling file uploads
import multer from "multer";

// Memory storage for PDF processing
const memoryStorage = multer.memoryStorage();

// Disk storage for other files
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed."), false);
  }
};

// PDF-specific file filter
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed for resumes."), false);
  }
};

// Create multer upload instances
export const upload = multer({
  storage: memoryStorage, // Use memory storage for PDF processing
  fileFilter: pdfFileFilter, // Only allow PDFs for resume uploads
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Specific upload for resumes with memory storage
export const uploadResume = multer({
  storage: memoryStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('resume');

// General file upload with disk storage
export const uploadGeneral = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});

// Multiple file upload for other purposes
export const uploadMultiple = multer({
  storage: diskStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5, // Maximum 5 files
  },
}).array('files', 5);
