const express = require("express");
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const cors = require('cors'); 
app.use(cors({
    origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());
const bcrypt = require('bcrypt');
require("./userDetails.js");


const multer = require('multer');
app.use('/uploads', express.static('uploads'));

const jwt=require("jsonwebtoken")

const JWT_SECRET= "rhgwajenoejdnnsasssjiwjmsjbfcgahtarers"

const PORT = process.env.PORT || 3001; //Set port to 3001
function isLoggedIn(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assuming Bearer token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = decoded; // Attach the user to the request object
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

mongoose
    .connect("mongodb+srv://Tetsing:123@tmumarket.skiy9lf.mongodb.net/TmuMarket", {
        useNewUrlParser: true,
}) //;
  .then(() => {
    console.log("Connected to database");

    Post.createIndexes({
        title: "text",
        description: "text",
        tags: "text"
      }).then(() => {
        console.log("Indexes created");
    }).catch((error) => {
        console.error("Error creating indexes:", error);
      });
      
  })

  .catch((e) => console.log(e));

const User = mongoose.model("UserInfo");


//Register function
app.post('/register', async(req, res) => {
    const { fname, lname, email, password } = req.body;

    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            // Early return to prevent further execution if the user already exists
            return res.json({ error: "User Exists" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10); //encrypt password, consider using a salt round of 10 for better security
        const user = await User.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
        });

        // Generate a token for the new user
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
        // Return the token with the response
        res.json({ status: "ok", data: token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});


//Login function
app.post("/login", async(req,res) => {
    const { email, password } = req.body;
    
    const user= await User.findOne({email}); //check if user exists using email
    if (!user) {
        return res.json({ error: "User Not found" }); //if user doesn't exist
    }
    //ADDED ID TO VANESSA'S CODE 
    if(await bcrypt.compare(password, user.password)) { //if user exists, decrypt and compare password
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);

        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        }
        else {
            return res.json({ status: "error" });
        }
    }
    res.json({ status: "error", error: "Invalid Password"})
});


//Routes

//post request (to submit user input)
app.post("/dashboard", async(req, res)=>{
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const userEmail= user.email;
        User.findOne({ email: userEmail })
            .then((data) => {
                res.send({ status: "ok", data: data });
            })
            .catch((error) => {
                res.send({ status: "error", data: error});
        });
    }
    catch (error) {}
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
       
        match: [/^[a-zA-Z0-9 ]{3,50}$/, 'Please fill a valid title'],
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'Description is too short'],
    },
    tags: {
        type: [String],
        
    },
    
    images: [String],
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number'],
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo',
        required: true
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;


app.post('/api/posts', isLoggedIn, upload.array('images', 5), async (req, res) => {
    try {
        console.log('Recieved POST request to /api/posts:', req.body);
        let { title, description, price, category, location} = req.body;
        let  tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

        price = Number(price);
        if (isNaN(price)) {
            return res.status(400).json({ error: "Invalid price format" });
        }
        
        console.log(req.user);
        const newPost = new Post({
            title,
            description,
            tags,
            images: req.files.map(file => file.path),
            price,
            category,
            location,
            createdBy: req.user.id
        });

        // Save the new post
        await newPost.save();
        
        // Send a success response
        res.status(201).send({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error handling POST request to /api/posts:', error);
        console.error(error.stack);
        res.status(500).send({error: 'Error creating post', details: error.message});
        
        }
});


app.get('/api/posts', async(req, res) => {
    console.log('Received query params:', req.query);
    const { category, location, price, query } = req.query;
    
    let queryObject = {};
    if (category) {
        queryObject.category = new RegExp(category, 'i');
    }
    if (location) {
        queryObject.location = new RegExp(location, 'i');
    }
    if (price) {
        let priceCondition = {};
        if (price.startsWith('<')) {
            priceCondition.$lt = parseFloat(price.substring(1));
        } else if (price.startsWith('>')) {
            priceCondition.$gt = parseFloat(price.substring(1));
        } else if (price.includes('-')) {
            let [min, max] = price.split('-').map(Number);
            priceCondition.$gte = min;
            priceCondition.$lte = max;
        }
        if (Object.keys(priceCondition).length > 0) {
            queryObject.price = priceCondition;
        }
    }
    if (query) {
        queryObject.$or = [
            { title: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') },
            { tags: { $in: [new RegExp(query, 'i')] } }
        ];
    }
    
    try {
        const posts = await Post.find(queryObject).populate('createdBy', 'fname lname');
        res.json(posts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ message: 'Error fetching posts', error: error.toString() });
    }
});

const ChatModel = require('./models/chat.js');

app.post("/api/chat", async (req, res) => {
    const { senderId, receiverId } = req.body; 
    try {
       
        const existingChat = await ChatModel.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (existingChat) {
            
            return res.status(200).json(existingChat);
        } else {
            const newChat = new ChatModel({
                members: [senderId, receiverId]
            });
            const result = await newChat.save();
            return res.status(201).json(result);
        }
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//Chat Stuff 

const chatRoute = require('./route/chatRoutes.js');
const messageRoute = require('./route/messageRoutes.js');
const ws = require('ws');
const http = require('http');
const server = (http.createServer(app));

const wss = new ws.WebSocketServer({server});

wss.on('connection', (connection, req) => {
    console.log('connected');
});

app.delete('/api/posts/:id', isLoggedIn, async (req, res) => {
    const postId = req.params.id;

    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to fetch user ID based on id
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id; // Get id from URL parameters
    try {
        const user = await User.findById(userId);
        if (user) {
            res.json({user});
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.use("/chat", chatRoute);
app.use('/message', messageRoute);
//End routes

//SOMMIE
// Define route to fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users); // Send the users as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define route to fetch the count of users
app.get('/users/count', async (req, res) => {
    try {
        const count = await User.countDocuments(); // Count the number of documents in the User collection
        res.json({ count }); // Send the count as JSON response
    } catch (err) {
        console.error('Error fetching user count:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define route to update the user's first name
app.put('/users/:email', async (req, res) => {
    const { email } = req.params;
    const { fname } = req.body;

    try {
        // Find the user by email and update the first name
        await User.findOneAndUpdate({ email }, { fname });
        res.status(200).json({ message: 'First name updated successfully' });
    } catch (error) {
        console.error('Error updating first name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define route to delete a user
app.delete('/users/:email', async (req, res) => {
    const { email } = req.params;
    try {
        // Find the user by email and delete it
        await User.findOneAndDelete({ email });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define route to fetch all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all posts from the database
        res.json(posts); // Send the posts as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a post by ID
app.delete('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        await Post.findByIdAndDelete(postId); // Find post by ID and delete it
        res.status(200).json({ message: 'Post deleted successfully' }); // Send success message as JSON response
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Internal server error' }); // Send error message as JSON response
    }
});

// Define route to fetch the count of posts
app.get('/posts/count', async (req, res) => {
    try {
        const count = await Post.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Error fetching post count:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () =>  {
    console.log(`Listening on port, ${PORT}`);
});