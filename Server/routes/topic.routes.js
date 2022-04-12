const controller = require("../controllers/topic.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

app.get("/api/topic/all", controller.allTopics);

app.post("/api/topic/addTopic", controller.addTopic);

app.post("/api/topic/editTopic/:id", controller.editTopic);

app.delete("/api/topic/delete/:id", controller.deleteTopic);

};