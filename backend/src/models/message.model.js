import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // here text & image aren't marked required true bcoz,
    // a msg could have either text, image or both
    text: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = new mongoose.model("Message", messageSchema);

export default Message;
