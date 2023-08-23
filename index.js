const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${randomBytes(4).toString('hex')}-${file.originalname}`);
  },
});

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const upload = multer({ storage: storage });

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.use('/images', express.static('./images'));
app.get('/images/:id', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/images', upload.single('image'), async (req, res) => {
  await delay(2000);
  res
    .status(201)
    .send({ filePath: `${req.file.destination}${req.file.filename}` });
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});
