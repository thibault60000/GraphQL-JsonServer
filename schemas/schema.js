const graphQL = require("graphql");
const lodash = require("lodash");
const axios = require("axios");

// Définition du schema GraphQL
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphQL;

// Création de faux utilisateurs
/* 
const users = [
    { id: "1" , firstName: 'Robin', age: 25 },
    { id: "2" , firstName: "Catherine", age: 32 }
] */

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    user: {
      type: GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(response => {
            return response.data;
          });
      }
    }
  })
});

// Création du premier Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(response => {
            return response.data;
          });
      }
    }
  })
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .post(`http://localhost:3000/users/`, {
            firstName: args.firstName,
            age: args.age,
            companyId: args.companyId
          })
          .then(response => {
            return response.data;
          });
      }
    },
    deleteUser: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLString)}       
        },
        resolve(parentValue, args){
            return axios
            .delete(`http://localhost:3000/users/${args.id}`)
            .then(response => {
              return response.data;
            });
        }
    }
  }
});

// Définir la RootQuery
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(response => {
            return response.data;
          });
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(response => {
            return response.data;
          });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationType
});
