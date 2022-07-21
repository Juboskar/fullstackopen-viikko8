import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_BOOKS } from '../queries';
import BookList from './BookList';
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
      <BookList books={books} />
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
