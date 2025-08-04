const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.51l7ww2.mongodb.net/test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

module.exports = {
  connectDB,
};
