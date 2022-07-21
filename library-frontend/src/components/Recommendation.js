import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_BOOKS, ME } from '../queries';
import BookList from './BookList';

const Recommendation = (props) => {
  const [books, setBooks] = useState([]);
  const result = useQuery(ALL_BOOKS);
  const me = useQuery(ME);

  useEffect(() => {
    console.log(me);
    if (!result.loading && !me.loading) {
      if (!me.data.me) return;
      const filteredBooks = result.data.allBooks.filter((b) =>
        b.genres.includes(me.data.me.favoriteGenre)
      );
      setBooks(filteredBooks);
    }
  }, [result, me]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  if (result.loading || me.loading) {
    return <div>loading...</div>;
  }

  if (!me.data.me) return null;

  return (
    <div>
      <h2>recommendation</h2>
      <div>
        books in your favorite genre <b>{me.data.me.favoriteGenre}</b>
      </div>
      <BookList books={books} />
    </div>
  );
};

export default Recommendation;
