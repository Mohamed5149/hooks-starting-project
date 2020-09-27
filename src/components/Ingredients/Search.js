import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios'
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const [filterSearch, setFilterSearch] = useState('');
  const { onFilterIngredients } = props;
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterSearch === inputRef.current.value) {
        const query = filterSearch.length === 0 ? '' :
          `?orderBy="title"&equalTo="${filterSearch}"`
        Axios.get('https://temp-d2a95.firebaseio.com/ingredients.json' + query).then(res => {
          let ingredientsData = [];
          for (const key in res.data) {
            ingredientsData.push({
              id: key,
              title: res.data[key].title,
              amount: res.data[key].amount,
            })
          }
          onFilterIngredients(ingredientsData);
        })
      }
    }, 1500);
    return () => { clearTimeout(timer) }
  } , [filterSearch, onFilterIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={filterSearch} onChange={event => { setFilterSearch(event.target.value) }} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
