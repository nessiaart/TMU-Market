const io = require('socket.io')(3002, {
    cors: {
        origin: "http://localhost:3000",
    }
});

// Holds online users
let activeUsers = [];

//Handles app messages 
io.on("connection", (socket) => {
    
    // Add new user, add user onto the socket
    socket.on("new-user-add", (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            });
        }
        // Send users to clientside 
        console.log("Connected Users", activeUsers);
        io.emit('get-users', activeUsers);
    });

        // Remove user from the active users 
        socket.on("disconnect", () => {
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            console.log("User disconnected!", activeUsers);
            io.emit('get-users', activeUsers);
        });
    

    // Send Message
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
        console.log("Sending from socket to :", receiverId);
        console.log("Data", data);
        if (user) {
            io.to(user.socketId).emit("receive-message", data);
        }
    });

});