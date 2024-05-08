const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors");
const mongoose = require('mongoose');
const UserSchema = require('./mongodb/db');

const uri = "mongodb+srv://flutter:BZqqSIJBabjEpHl6@cluster0.ltnn1rh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());

// Connect to MongoDB with specific database name
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'flutter', // Specify the database name
});

// Create a Mongoose model with specific collection name
const User = mongoose.model('User', UserSchema, 'Users'); // Specify the collection name as 'Users'

// MongoDB connection error handling
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB successfully!");
});


app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email address already in use' });
        }
        // Create a new user instance
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});

app.get("/",(req,res)=>{
    res.send("Hellowroldl ");
    })
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Search for a user with the provided email
        const user = await User.findOne({ email });

        // Check if user exists and if the password matches
        if (!user || user.password !== password) {
            // If user doesn't exist or password doesn't match, return error
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If user exists and password matches, login successful
        res.status(200).json({ message: 'Login successful', user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to login user' });
    }
});

 

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
