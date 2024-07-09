import mongoose from "mongoose";
import Users from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        about,
    } = req.body;

    try {
        if (!firstName || !lastName || !email || !contact || !jobTitle || !about) {
            return next("Please enter all required fields");
        }

        const id = req.body.user.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No user with id: ${id}`);
        }

        const updateUser = {
            firstName,
            lastName,
            email,
            contact,
            location,
            profileUrl: profileUrl?.secure_url || profileUrl?.url, // Ensure profileUrl exists before accessing properties
            jobTitle,
            about,
        };

        const user = await Users.findByIdAndUpdate(id, updateUser, { new: true });

        if (!user) {
            return res.status(404).send(`No user with id: ${id}`);
        }

        const token = user.createJWT();
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res, next) => {
    try {
        const id = req.body.user.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No user with id: ${id}`);
        }

        const user = await Users.findById(id).select('-password');

        if (!user) {
            return res.status(404).send({
                message: "User not found",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Auth error",
            success: false,
            error: error.message,
        });
    }
};
