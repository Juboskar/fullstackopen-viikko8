import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      born
    }
  }
`;

export const SET_BIRTHYEAR = gql`
  mutation editAuthor($author: String!, $bornTo: Int!) {
    editAuthor(name: $author, setBornTo: $bornTo) {
      name
      born
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const LOGIN = gql`
  mutation login($name: String!, $password: String!) {
    login(username: $name, password: $password) {
      value
    }
  }
`;
