import Users from "../models/userModel.js";

export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate fields
    if (!firstName) return next("First Name is required");
    if (!email) return next("Email is required");
    if (!lastName) return next("Last Name is required");
    if (!password) return next("Password is required");

    try {
        const userExist = await Users.findOne({ email });
        if (userExist) return next("Email Address already exists");

        const user = await Users.create({ firstName, lastName, email, password });

        // Create user token
        const token = await user.createJWT();

        res.status(201).send({
            success: true,
            message: "Account created successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accountType: user.accountType,
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
        // Find user by email
        const user = await Users.findOne({ email }).select("+password");
        if (!user) return next("Invalid email or password");

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return next("Invalid email or password");

        user.password = undefined;

        const token = user.createJWT();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
