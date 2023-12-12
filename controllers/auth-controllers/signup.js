import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { HttpError, sendEmail } from "../../helpers/index.js";
import ctrlWrapper from "../../decorators/ctrlWrapper.js";
import { nanoid } from "nanoid";
import "dotenv/config.js";

const { BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const avatarURL = gravatar.url(email, {
    s: "250",
    r: "g",
    d: "monsterid",
  });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

export default ctrlWrapper(signup);
