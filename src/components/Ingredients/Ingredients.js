import React, { useReducer, useState, useEffect, useCallback } from 'react';
import IngredientList from "../Ingredients/IngredientList";
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import Axios from 'axios';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
  }
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...httpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.msg }
    case 'CLEAR':
      return { ...httpState, error: null }
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, [])
  const [httpState, httpDispatch] = useReducer(httpReducer, { loading: false, error: null })
  // const [ingredients, setIngredients] = useState([])
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState('')


  useEffect(() => {
    // setLoading(true)
    httpDispatch({ type: 'SEND' })
    Axios.get('https://temp-d2a95.firebaseio.com/ingredients.json').then(res => {

      let ingredientsData = [];
      for (const key in res.data) {
        ingredientsData.push({
          id: key,
          title: res.data[key].title,
          amount: res.data[key].amount,
        })
      }
      // setIngredients(ingredientsData)
      dispatch({ type: 'SET', ingredients: ingredientsData })
      // setLoading(false)
      httpDispatch({ type: 'RESPONSE' })
    })
  }, [])

  const searchIngredientsHandler = useCallback(filteredIngredients => {
    // setIngredients(filteredIngredients)
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, [])

  const removeIngredient = ingredientId => {
    // setLoading(true)
    httpDispatch({ type: 'SEND' })
    Axios.delete(`https://temp-d2a95.firebaseio.com/ingredients/${ingredientId}.jon`).then(res => {
      console.log(res);
      // setLoading(false)
      httpDispatch({ type: 'RESPONSE' })
      // setIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({ type: 'DELETE', id: ingredientId })
    }).catch(error => {
      console.log(error);
      // setError(error.message)
      httpDispatch({ type: 'ERROR',msg:'something went wronggggg' })
    })
  }

  const clearError = () => {
    // setLoading(false)
    // setError(null)
    httpDispatch({ type: 'CLEAR', errorMsg: 'something went wrong' })
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={() => clearError()}>{httpState.error}</ErrorModal>}
      <IngredientForm
        addIngredient={(ingredient) => {
          // setLoading(true)
          httpDispatch({ type: 'SEND' })
          Axios.post('https://temp-d2a95.firebaseio.com/ingredients.json', ingredient).then(res => {
            console.log(res)
            // setLoading(false)
            httpDispatch({ type: 'RESPONSE' })
            // setIngredients(prevIngredients => [
            //   ...prevIngredients, { id: Math.random().toString(), ...ingredient }
            // ])
            dispatch({ type: 'ADD', ingredient: { id: res.data.name, ...ingredient } })
          })
        }}
        loading={httpState.loading} />
      <section>
        <Search onFilterIngredients={searchIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
