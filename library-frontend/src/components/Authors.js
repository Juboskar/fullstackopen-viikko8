import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const Authors = (props) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: 'http://localhost:4000',
      }),
    });

    const query = gql`
      query {
        allAuthors {
          name
          bookCount
          born
        }
      }
    `;

    client.query({ query }).then((response) => {
      setAuthors(response.data.allAuthors);
    });
  }, []);

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
