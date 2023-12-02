import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import ctrlWrapper from "../../decorators/ctrlWrapper.js";
import User from "../../models/User.js";
import { HttpError } from "../../helpers/index.js";

const avatarsPath = path.resolve("public", "avatars");

const avatarUpdate = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  await Jimp.read(oldPath)
    .then((image) => {
      return image.resize(250, 250).write(oldPath);
    })
    .catch((err) => {
      HttpError(400, "Invalid file");
    });

  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  const updateUser = await User.findByIdAndUpdate(
    _id,
    { avatarURL },
    { new: true }
  );

  res.json({
    ResponseBody: { avatarURL: updateUser.avatarURL },
  });
};

export default ctrlWrapper(avatarUpdate);
