/**
 * seedAdmin.js — Run ONCE to create the admin user in MongoDB
 *
 * Usage:
 *   cd backend
 *   node scripts/seedAdmin.js
 *
 * After running successfully, delete or gitignore this file.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB");

    const email = "admin@chaitheory.in";
    const plainPassword = "ChaiAdmin@2024"; // Change this before running!

    // Avoid creating duplicates
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️  Admin user already exists:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const admin = new User({ email, password: hashedPassword, role: "admin" });
    await admin.save();

    console.log("🎉 Admin user created successfully!");
    console.log("   Email   :", email);
    console.log("   Password:", plainPassword);
    console.log(
      "\n IMPORTANT: Delete or gitignore this file after running!",
    );
    process.exit(0);
  } catch (err) {
    console.error(" Seeding failed:", err.message);
    process.exit(1);
  }
}

seedAdmin();
