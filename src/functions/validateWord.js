exports.handler = function(event, context, callback) {
  console.log("My first netlify function!");
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
};
