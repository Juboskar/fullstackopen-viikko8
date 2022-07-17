const Book = require('../models/book');
const Author = require('../models/author');

const resolvers = {
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = await new Author({ name: args.author });
        author.save();
      }
      const book = new Book({ ...args, author: author.id });
      return (await book.save()).populate('author');
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;
      return author.save();
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
