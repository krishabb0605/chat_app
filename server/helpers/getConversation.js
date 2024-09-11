const { ConversationModel } = require('../models/ConversationModel');

const getConveration = async (currentUserId) => {
  if (!currentUserId) {
    return [];
  }
  const currentUserConversation = await ConversationModel.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .populate('messages')
    .sort({ updatedAt: -1 })
    .populate('sender')
    .populate('receiver');

  const conversation = currentUserConversation?.map((conver) => {
    const conveUnseenMessage = conver.messages.reduce((prev, curr) => {
      const msgByUserId = curr?.msgByUserId?.toString();

      if (msgByUserId?.toString() !== currentUserId) {
        return prev + (curr.seen ? 0 : 1);
      } else {
        return prev;
      }
    }, 0);

    return {
      _id: conver?._id,
      sender: conver?.sender,
      receiver: conver?.receiver,
      unseenMsg: conveUnseenMessage,
      lastMsg: conver.messages[conver?.messages?.length - 1],
    };
  });

  return conversation;
};

module.exports = getConveration;
