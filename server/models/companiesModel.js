import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import validator from "validator";

const companySchema = new Schema({
    name: {
        type: String,
        required: [true, "Company Name is required"],
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
    contact: { type: String, },
    location: { type: String, },
    about: { type: String, },
    profileUrl: { type: String, },
    jobPosts: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],

});


companySchema.pre("save", async function () {
    if (!this.isModified)
        return;
    const salt = await bcrypt.getSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// compare the password
// userSchema.methods.comparePasssword = async function (userPassword) {
companySchema.methods.comparePasssword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
}


// JWT token
// userSchema.methods.createToken = async function () {
companySchema.methods.createToken = async function () {
    return JWT.sign({ userId: this._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" },
    )
};

const Companies = mongoose.model("Companies", companySchema);

export default Companies;