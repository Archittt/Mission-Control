const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGO_URI, PORT } = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/missions', require('./routes/missions'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));