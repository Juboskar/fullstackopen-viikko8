import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_BOOKS, ME } from '../queries';

const Recommendation = (props) => {
  const [books, setBooks] = useState([]);
  const result = useQuery(ALL_BOOKS);
  const me = useQuery(ME);

  useEffect(() => {
    if (!result.loading && !me.loading) {
      const filteredBooks = result.data.allBooks.filter((b) =>
        b.genres.includes(me.data.me.favoriteGenre)
      );
      setBooks(filteredBooks);
    }
  }, [result, me]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  if (result.loading && !me.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>recommendation</h2>
      <div>
        books in your favorite genre <b>{me.data.me.favoriteGenre}</b>
      </div>

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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendation;
