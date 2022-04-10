const controller = require("../controllers/message.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
    app.get("/api/message/allMessages", controller.allMessages);
    
    app.get("/api/message/allComments", controller.allComments);

    app.post("/api/message/addMessage", controller.addMessage);
    
    app.post("/api/message/addComment", controller.addComment);
    
    app.post("/api/message/edit/:id", controller.editMessage);
    
    app.post("/api/message/editComment/:id", controller.editComment);
    
    app.delete("/api/message/deleteMessage/:id", controller.deleteMessage);
   
    app.delete("/api/message/deleteComment/:id", controller.deleteComment);

};