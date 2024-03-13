const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let uploadedData = [];

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    uploadedData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    res.json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Error processing the file' });
  }
});

app.get('/data', (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  res.json(uploadedData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
