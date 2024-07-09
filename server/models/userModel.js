import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import validator from "validator";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is Required!"],
        },
        lastName: {
            type: String,
            required: [true, "Last Name is Required!"],
        },
        email: {
            type: String,
            required: [true, "Email is Required!"],
            unique: true,
            validate: validator.isEmail,
        },
        password: {
            type: String,
            required: [true, "Password is Required!"],
            minlength: [6, "Password length should be greater than 6 characters"],
            select: false, // Hide password by default
        },
        accountType: { type: String, default: "seeker" },
        contact: { type: String },
        location: { type: String },
        profileUrl: { type: String },
        cvUrl: { type: String },
        jobTitle: { type: String },
        about: { type: String },
    },
    { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
};

// Method to create JWT token
userSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
};

const Users = mongoose.model("Users", userSchema);

export default Users;
