import Contact from "../models/contactModel.js";

export const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContact = await Contact.create({
            name,
            email,
            message
        });

        res.status(201).json({ 
            message: "Message received and stored securely. We will get back to you soon!", 
            contact: newContact 
        });
    } catch (error) {
        console.error("Contact submission error:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};
