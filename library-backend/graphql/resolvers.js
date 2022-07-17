const { v1: uuid } = require('uuid');

const resolvers = {
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() };
      books.push(book);
      if (!authors.map((a) => a.name).includes(args.author)) {
        authors.push({ name: args.author, id: uuid() });
      }

      return book;
    },
    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name);
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      return author;
    },
  },
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let booksToReturn = books;
      if (args.author) {
        booksToReturn = books.filter((b) => b.author === args.author);
      }
      if (args.genre) {
        booksToReturn = booksToReturn.filter((b) =>
          b.genres.includes(args.genre)
        );
      }
      return booksToReturn;
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (root) => books.filter((b) => b.author === root.name).length,
  },
};

module.exports = resolvers;
