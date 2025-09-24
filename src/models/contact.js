import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Burayı ekledik
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
