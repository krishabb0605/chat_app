const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    email: { type: String, required: [true, 'Provide email'], unique: true },
    password: { type: String, required: [true, 'Provide password'] },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageModel =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

const ConversationModel =
  mongoose.models.Conversation ||
  mongoose.model('Conversation', conversationSchema);

module.exports = {
  MessageModel,
  ConversationModel,
};
