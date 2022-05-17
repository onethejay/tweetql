import {ApolloServer, gql} from 'apollo-server';

let tweets = [
    {
        id: "1",
        text: "first one",
        userId: "2"
    },
    {
        id: "2",
        text: "second one",
        userId: "1"
    },
]

let users = [
    {
        id: "1",
        firstName: "Jay",
        lastName: "Jang",
    },
]

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        """
        Is the sum of firstName + lastName.
        """
        fullName: String!
    }

    type Movie {
        id: Int!
        title: String!
        rating: Float!
    }

    """
    Tweet object represents a resource for a Tweet
    """
    type Tweet {
        id: ID!
        text: String!
        author: User
    }

    type Query {
        allMovies: [Movie!]!
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }

    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        """ 
        Deletes a Tweet if found, else returns false
        """
        deleteTweet(id: ID!): Boolean!
    }
`

const resolvers = {
    Query: {       
        allMovies() {

        },
        allTweets() {
            return tweets;
        },
        tweet(root, args) {
            console.log(args);
            return tweets.find((tweet) => tweet.id === args.id);
        },
        allUsers() {
            console.log("allUsers called");
            return users;
        }
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, {id}) {
            const tweet = tweets.find((tweet) => tweet.id === id)
            if(!tweet) return false;
            tweets = tweets.filter((tweet) => tweet.id !== id)
            return true;
        }
    },
    User: {        
        fullName({firstName, lastName}) {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        author({userId}) {
            return users.find((user) => user.id === userId);
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) => {
    console.log(`Running on ${url}`); 
})