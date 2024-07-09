import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";

// Create Job
export const createJob = async (req, res, next) => {
    const { jobTitle, jobType, location, salary, vacancies, experience, desc, requirements } = req.body;

    if (!jobTitle || !jobType || !location || !salary || !requirements || !desc) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const companyId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(404).json({ message: `No company with id: ${companyId}` });
    }

    try {
        const jobPost = {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            detail: { desc, requirements },
            company: companyId,
        };

        const job = new Jobs(jobPost);
        await job.save();

        // Update the company information with job id
        await Companies.findByIdAndUpdate(companyId, { $push: { jobPosts: job._id } });

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            job,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update Job
export const updateJob = async (req, res, next) => {
    const { jobTitle, jobType, location, salary, vacancies, experience, desc, requirements } = req.body;
    const { jobId } = req.params;

    if (!jobTitle || !jobType || !location || !salary || !desc || !requirements) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const companyId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(404).json({ message: `No company with id: ${companyId}` });
    }

    try {
        const jobPost = {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            detail: { desc, requirements },
        };

        const updatedJob = await Jobs.findByIdAndUpdate(jobId, jobPost, { new: true });

        res.status(200).json({
            success: true,
            message: "Job post updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get Job Posts
export const getJobPosts = async (req, res, next) => {
    const { search, sort, location, jtype, exp } = req.query;
    const types = jtype?.split(","); // e.g., full-time, part-time
    const experience = exp?.split("-"); // e.g., 2-6

    let queryObject = {};

    if (location) {
        queryObject.location = { $regex: location, $options: "i" };
    }

    if (jtype) {
        queryObject.jobType = { $in: types };
    }

    if (exp) {
        queryObject.experience = {
            $gte: Number(experience[0]),
            $lte: Number(experience[1]),
        };
    }

    if (search) {
        queryObject.$or = [
            { jobTitle: { $regex: search, $options: "i" } },
            { jobType: { $regex: search, $options: "i" } },
        ];
    }

    try {
        let queryResult = Jobs.find(queryObject).populate({
            path: "company",
            select: "-password",
        });

        // Sorting
        if (sort) {
            const sortOptions = {
                Newest: "-createdAt",
                Oldest: "createdAt",
                "A-Z": "jobTitle",
                "Z-A": "-jobTitle",
            };
            queryResult = queryResult.sort(sortOptions[sort]);
        }

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalJobs = await Jobs.countDocuments(queryObject);
        const numOfPage = Math.ceil(totalJobs / limit);

        queryResult = queryResult.skip(skip).limit(limit);

        const jobs = await queryResult;

        res.status(200).json({
            success: true,
            totalJobs,
            data: jobs,
            page,
            numOfPage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get Job by ID
export const getJobById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const job = await Jobs.findById(id).populate({
            path: "company",
            select: "-password",
        });

        if (!job) {
            return res.status(404).json({ message: "Job post not found" });
        }

        // Get similar job posts
        const similarJobs = await Jobs.find({
            $or: [
                { jobTitle: { $regex: job.jobTitle, $options: "i" } },
                { jobType: { $regex: job.jobType, $options: "i" } },
            ],
        })
            .populate({
                path: "company",
                select: "-password",
            })
            .sort({ _id: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            data: job,
            similarJobs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Delete Job Post
export const deleteJobPost = async (req, res, next) => {
    const { id } = req.params;

    try {
        await Jobs.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Job post deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
