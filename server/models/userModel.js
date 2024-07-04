import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validator: validator.isEmail
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlenght: [5, "Password must be at least 5 characters"],
        select: true,
    },
    accountType: {
        type: String,
        default: "seeker",
    },
    contact: { type: String, },
    profileUrl: { type: String, },
    jobTitle: { type: String, },
    about: { type: String, },
},
    { timestamps: true }
);


userSchema.pre("save", async function () {
    if (!this.isModified)
        return;
    const salt = await bcrypt.getSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// compare the password
userSchema.methods.comparePasssword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
}


// JWT token
userSchema.methods.createToken = async function () {
    return JWT.sign({ userId: this._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" },
    )
};

const Users = mongoose.model("Users", usersSchema);

export default Users;