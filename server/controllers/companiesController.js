import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name) return next("Company Name is required!");
    if (!email) return next("Email address is required!");
    if (!password) return next("Password is required and must be greater than 6 characters");

    try {
        const accountExist = await Companies.findOne({ email });
        if (accountExist) return next("Email Already Registered. Please Login");

        // Create a new account
        const company = await Companies.create({ name, email, password });

        // Generate token
        const token = company.createJWT();

        res.status(201).json({
            success: true,
            message: "Company Account Created Successfully",
            user: {
                _id: company._id,
                name: company.name,
                email: company.email,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) return next("Please provide user credentials");

    try {
        const company = await Companies.findOne({ email }).select("+password");
        if (!company) return next("Invalid email or password");

        const isMatch = await company.comparePassword(password);
        if (!isMatch) return next("Invalid email or password");

        company.password = undefined;
        const token = company.createJWT();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: company,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateCompanyProfile = async (req, res, next) => {
    const { name, contact, location, profileUrl, about } = req.body;

    // Validate fields
    if (!name || !contact || !location || !profileUrl || !about) {
        return next("Please provide all required fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No company with id: ${id}`);
    }

    const updateCompany = {
        name,
        contact,
        location,
        profileUrl: profileUrl.secure_url || profileUrl.url, // Use only the URL part of the profileUrl object
        about,
    };

    try {
        const company = await Companies.findByIdAndUpdate(id, updateCompany, { new: true });
        if (!company) {
            return res.status(404).send(`No company with id: ${id}`);
        }

        const token = company.createJWT();
        company.password = undefined;

        res.status(200).json({
            success: true,
            message: "Company Profile Updated Successfully",
            company,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getCompanyProfile = async (req, res, next) => {
    const id = req.body.user.userId;

    try {
        const company = await Companies.findById(id).select("-password");
        if (!company) {
            return res.status(404).send({
                message: "Company Not Found",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getCompanies = async (req, res, next) => {
    const { search, sort, location, page = 1, limit = 20 } = req.query;

    const queryObject = {};
    if (search) queryObject.name = { $regex: search, $options: "i" };
    if (location) queryObject.location = { $regex: location, $options: "i" };

    let queryResult = Companies.find(queryObject).select("-password");

    // Sorting
    if (sort) {
        const sortOptions = {
            Newest: "-createdAt",
            Oldest: "createdAt",
            "A-Z": "name",
            "Z-A": "-name",
        };
        queryResult = queryResult.sort(sortOptions[sort] || "");
    }

    const skip = (page - 1) * limit;
    queryResult = queryResult.skip(skip).limit(limit);

    try {
        const total = await Companies.countDocuments(queryObject);
        const numOfPage = Math.ceil(total / limit);
        const companies = await queryResult;

        res.status(200).json({
            success: true,
            total,
            data: companies,
            page: Number(page),
            numOfPage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getCompanyJobListing = async (req, res, next) => {
    const { search, sort } = req.query;
    const id = req.body.user.userId;

    const queryObject = {};
    if (search) queryObject.location = { $regex: search, $options: "i" };

    const sortOptions = {
        Newest: "-createdAt",
        Oldest: "createdAt",
        "A-Z": "name",
        "Z-A": "-name",
    };

    try {
        const company = await Companies.findById(id).populate({
            path: "jobPosts",
            options: { sort: sortOptions[sort] || "" },
        });

        if (!company) return res.status(404).json({ message: "Company Not Found" });

        res.status(200).json({
            success: true,
            data: company.jobPosts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getCompanyById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const company = await Companies.findById(id).populate({
            path: "jobPosts",
            options: { sort: "-_id" },
        });

        if (!company) return res.status(404).json({ message: "Company Not Found" });

        company.password = undefined;

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
