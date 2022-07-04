import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const Books = (props) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: 'http://localhost:4000',
      }),
    });

    const query = gql`
      query {
        allBooks {
          title
          author
          published
        }
      }
    `;

    client.query({ query }).then((response) => {
      setBooks(response.data.allBooks);
    });
  }, []);

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
