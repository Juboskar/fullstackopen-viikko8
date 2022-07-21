import { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendation from './components/Recommendation';
import { useApolloClient, useSubscription } from '@apollo/client';
import { ALL_BOOKS, BOOK_ADDED } from './queries';

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('authors');
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const bookAdded = subscriptionData.data.bookAdded
      window.alert('new book added: ' + bookAdded.title);
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(bookAdded),
        }
      })
    },
  });

  useEffect(() => {
    setToken(localStorage.getItem('user_token'));
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('login');
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
            <button onClick={() => setPage('recommendation')}>
              recommendation
            </button>
          </>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendation show={page === 'recommendation'} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
