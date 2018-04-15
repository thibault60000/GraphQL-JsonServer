const express = require("express");
const expressGraphQL = require("express-graphql");
const userSchema = require("./schemas/schema");
const server = express();


// Utilise graphiql en passant par le middleWare "expressGraphQL"
server.use("/salutGraphQl", expressGraphQL({
    graphiql: true,
    schema: userSchema
}));

// Serveur écoute sur le port 4000
server.listen(4000, () => {
    console.log("Server listening 4000"); 
});