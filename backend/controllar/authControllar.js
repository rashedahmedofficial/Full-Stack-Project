const userSchema = require("../model/userSchema");
const { uploadToCloudinary } = require("./uploadControllar");

const getAlluser = async (req, res) => {
  const data = await userSchema.find();
  res.send(data);
};

const registration = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existedUser = await userSchema.findOne({ email: email });
    if (existedUser) {
      res.status(409).json({
        success: false,
        massage: "User already exsited",
        data: existedUser.email,
      });
      return;
    }

    let avatarUrl = "";
    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.buffer, "avatars");
      avatarUrl = cloudinaryResponse.secure_url;
    }

    const users = new userSchema({
      username: username,
      email: email,
      password: password,
      avatar: avatarUrl,
    });
    await users.save();
    res.status(201).json({
      success: true,
      massege: "User created successfully ",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      massage: "Registration failed",
      error: error.message,
    });
  }
};

const userDelate = async (req, res) => {
  const id = req.params;
  try {
    await userSchema.findByIdAndDelete(id.id);
    res.status(200).json({
      success: true,
      massege: "User delated successfully",
      data: id,
    });
  } catch (error) {
    res.status(204).json({
      success: false,
      massege: "User not found",
    });
  }
};

const userUpdate = async (req, res) => {
  try {
    const id = req.params;
    const { username, email, password } = req.body;

    const updateData = { username, email, password };

    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.buffer, "avatars");
      updateData.avatar = cloudinaryResponse.secure_url;
    }

    await userSchema.findByIdAndUpdate(id.id, updateData);
    const updatedUser = await userSchema.findById(id.id);
    res.status(200).json({
      success: true,
      massege: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(204).json({
      success: false,
      massege: "User not found",
    });
  }
};

module.exports = { getAlluser, registration, userDelate, userUpdate };
