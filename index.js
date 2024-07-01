const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL schema
const schema = buildSchema(`
  type Book {
    id: ID!
    title: String!
    author: Author!
  }

  type Author {
    id: ID!
    name: String!
  }

  type Query {
    book(id: ID!): Book
    books: [Book]
    author(id: ID!): Author
  }

  type Mutation {
    addBook(title: String!, authorId: ID!): Book
    updateBook(id: ID!, title: String, authorId: ID): Book
    deleteBook(id: ID!): Book
    createBook(input: BookInput): Book
    createAuthor(input: AuthorInput): Author
  }

  input BookInput {
    title: String
    authorId: ID
  }

  input AuthorInput {
    name: String
  }
`);

// Dummy data
let books = [
  { id: '1', title: '1984', authorId: '1' },
  { id: '2', title: 'To Kill a Mockingbird', authorId: '2' }
];

let authors = [
  { id: '1', name: 'George Orwell' },
  { id: '2', name: 'Harper Lee' }
];

// Root resolver
const root = {
  book: ({ id }) => books.find(book => book.id === id),
  books: () => books,
  author: ({ id }) => authors.find(author => author.id === id),
  addBook: ({ title, authorId }) => {
    const newBook = { id: `${books.length + 1}`, title, authorId };
    books.push(newBook);
    return newBook;
  },
  updateBook: ({ id, title, authorId }) => {
    let book = books.find(book => book.id === id);
    if (book) {
      book.title = title;
      book.authorId = authorId;
    }
    return book;
  },
  deleteBook: ({ id }) => {
    let book = books.find(book => book.id === id);
    if (book) {
      books = books.filter(book => book.id !== id);
    }
    return book;
  },
  createBook: ({ input }) => {
    const book = { id: `${books.length + 1}`, ...input };
    books.push(book);
    return book;
  },
  createAuthor: ({ input }) => {
    const author = { id: `${authors.length + 1}`, ...input };
    authors.push(author);
    return author;
  }
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
