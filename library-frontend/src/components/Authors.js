import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries';
import { useEffect, useState } from 'react';

const Authors = (props) => {
  const [author, setAuthor] = useState('');
  const [bornTo, setBornTo] = useState(2000);
  const [authorList, setAuthorList] = useState([]);

  const result = useQuery(ALL_AUTHORS);
  const [addBornYear] = useMutation(SET_BIRTHYEAR);

  useEffect(() => {
    if (!result.loading) {
      const authors = result.data.allAuthors;
      setAuthorList(authors);
      setAuthor(authors[0].name);
    }
  }, [result]);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const addNewBornYear = async (event) => {
    event.preventDefault();

    const res = await addBornYear({ variables: { author, bornTo } });

    setAuthor(authorList[0].name);
    setBornTo(2000);
    const authorToUpadte = authorList.find(
      (a) => a.name === res.data.editAuthor.name
    );
    console.log(authorToUpadte);
    const updatedAuthor = { ...authorToUpadte, born: res.data.editAuthor.born };
    console.log(updatedAuthor);

    setAuthorList(
      authorList.map((a) => (a.name === updatedAuthor.name ? updatedAuthor : a))
    );
  };

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
          {authorList.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>set birthyear</h3>
      <form onSubmit={addNewBornYear}>
        <div>
          author
          <select
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          >
            {authorList.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born year
          <input
            type="number"
            value={bornTo}
            onChange={({ target }) => setBornTo(Number(target.value))}
          />
        </div>
        <button type="submit">set</button>
      </form>
    </div>
  );
};

export default Authors;
