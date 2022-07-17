const Book = require('../models/book');
const Author = require('../models/author');

const resolvers = {
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          new Author({ name: args.author }).save();
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
    editAuthor: async (root, args) => {
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
  },
  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root.id }),
  },
};

module.exports = resolvers;
