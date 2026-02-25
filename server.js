// 1. IMPORT PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/user');
const Ticket = require('./models/Ticket');
const HotelBooking = require('./models/HotelBooking');

// 2. INITIALIZE EXPRESS
const app = express();

// 3. MIDDLEWARE
app.use(express.json());
app.use(express.static('public'));

// 4. CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// 5. REGISTER ROUTE
app.post('/register', async (req, res) => {
    try {
        // 1. Check if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password (10 "salt rounds" is the standard)
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // 3. Create and save the user
        const newUser = new User({
            firstName: req.body.firstName,        
            lastName: req.body.lastName,        
            email: req.body.email,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth,
            loyaltyPoints: 0
        });

        // 4. Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'Account created successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// 6. LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        // 1. Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 2. Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (isMatch) {
            // Success! Send back the user ID so the frontend can remember who logged in
            res.json({
                message: 'Login successful',
                userId: user._id,
                email: user.email,
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
});


// GET USER DATA BY ID
app.get('/api/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, '-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// 7. BOOK ZOO TICKET ROUTE
app.post('/api/book-zoo', async (req, res) => {
    try {
        const { userId, ticketType, price, visitDate } = req.body;

        // 1. Create the Ticket in the database
        const newTicket = new Ticket({
            userId,        // Links the ticket to the user
            ticketType,
            price,
            visitDate
        });
        await newTicket.save();

        // 2. Calculate points (10 points per £1)
        const earnedPoints = price * 10;

        // 3. Update the User's loyalty points using $inc
        // $inc is a Mongoose command that adds to the existing number
        await User.findByIdAndUpdate(userId, {
            $inc: { loyaltyPoints: earnedPoints }
        });

        res.status(200).json({
            message: "Ticket booked!",
            pointsAdded: earnedPoints
        });

    } catch (error) {
        console.error('Zoo booking error:', error);
        res.status(500).json({ message: "Booking failed" });
    }
});

// 8. BOOK HOTEL STAY ROUTE
app.post('/api/book-hotel', async (req, res) => {
    try {
        const { userId, roomType, totalPrice, checkIn, checkOut } = req.body;

        // 1. Save the Hotel Booking
        const newStay = new HotelBooking({
            userId,
            roomType,
            totalPrice,
            checkIn,
            checkOut
        });
        await newStay.save();

        // 2. Calculate points (20 points per £1 for hotels)
        const earnedPoints = totalPrice * 20;

        // 3. Update User points
        await User.findByIdAndUpdate(userId, {
            $inc: { loyaltyPoints: earnedPoints }
        });

        res.status(200).json({
            message: "Hotel Stay Confirmed!",
            pointsAdded: earnedPoints
        });

    } catch (error) {
        console.error('Hotel booking error:', error);
        res.status(500).json({ message: "Hotel booking failed" });
    }
});

// 9. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});