import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const myId = req.user._id;
    // here, as in my sidebar I want to show every user
    // except me to chat with
    const filteredUsers = await User.find({
      _id: { $ne: myId },
    }).select("-password");

    res
      .status(200)
      .json({ data: filteredUsers, message: "Users fetched successfully" });
  } catch (error) {
    console.log("Error in getUsersForSidebar", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        // here we want all the chat messages where
        // i'm the sender & other is receiver
        // lly the other is sender & i'm receiver
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({
      data: {
        messages,
      },
      message: "Successfully retrieved the chat",
    });
  } catch (error) {
    console.log("Error in getMessages", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = "";
    if (image) {
      // upload image to cloudinary & get its url
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res
      .status(201)
      .json({ data: newMessage, message: "Message sent successfully" });
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
