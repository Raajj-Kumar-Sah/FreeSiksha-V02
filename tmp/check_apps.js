const mongoose = require('mongoose');
const MONGO_URL = "mongodb+srv://rajkumar68580_db_user:admin@freesiksha.cyoqegl.mongodb.net";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    status: String
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function check() {
    try {
        await mongoose.connect(MONGO_URL);
        const trainers = await User.find({ role: "trainer" });
        console.log(`Found ${trainers.length} users with role: trainer`);
        trainers.forEach(t => {
            console.log(`- ${t.name} (${t.email}): status=${t.status}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
check();
