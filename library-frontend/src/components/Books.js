import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_BOOKS } from '../queries';
import _ from 'lodash';

const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const result = useQuery(ALL_BOOKS);

  useEffect(() => {
    if (!result.loading) {
      setBooks(result.data.allBooks);
    }
  }, [result]); // eslint-disable-line

  useEffect(() => {
    const genre_list = books.reduce((L, book) => _.union(book.genres, L), []);
    setGenres(genre_list);
  }, [books]);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const filterByGenres = (genre) => {
    const filteredBook = result.data.allBooks.filter((b) =>
      b.genres.includes(genre)
    );
    setBooks(filteredBook);
  };

  const reset = () => {
    setBooks(result.data.allBooks);
  };

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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={g} onClick={() => filterByGenres(g)}>
          {g}
        </button>
      ))}
      <button onClick={reset}>all genres</button>
    </div>
  );
};

export default Books;
