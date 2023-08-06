// Create web server
var express = require('express');
var app = express();
// Create server
var server = require('http').createServer(app);
// Create socket
var io = require('socket.io')(server);
// Create database
var mongoose = require('mongoose');
// Connect database
mongoose.connect('mongodb://localhost:27017/itplus');
// Create schema
var commentSchema = mongoose.Schema({
    name: String,
    comment: String
});
// Create model
var Comment = mongoose.model('Comment', commentSchema);
// Create public folder
app.use(express.static('./public'));
// Listen port 3000
server.listen(3000, function () {
    console.log('Server is running on port 3000');
});
// Handle event
io.on('connection', function (socket) {
    console.log('Co nguoi ket noi: ' + socket.id);
    // Get all comments from database
    Comment.find(function (err, comments) {
        if (err) return console.error(err);
        // console.log(comments);
        // Send all comments to client
        socket.emit('load comments', comments);
    });
    // Handle event
    socket.on('send comment', function (data) {
        // console.log(data);
        // Create new comment
        var newComment = new Comment({ name: data.name, comment: data.comment });
        // Save comment to database
        newComment.save(function (err, comment) {
            if (err) return console.error(err);
            // console.log(comment);
            // Send comment to client
            io.emit('receive comment', comment);
        });
    });
});
//# sourceMappingURL=comments.js.map