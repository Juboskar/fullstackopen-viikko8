const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../utils');

const resolvers = {
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          author = await new Author({ name: args.author });
          author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }

      try {
        return (await new Book({ ...args, author: author.id }).save()).populate(
          'author'
        );
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) return null;

      author.born = args.setBornTo;

      try {
        author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let params = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        params.author = author.id;
      }
      if (args.genre) {
        params.genres = args.genre;
      }
      return Book.find(params).populate('author');
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      console.log(context.currentUser);
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root.id }),
  },
};

module.exports = resolvers;
