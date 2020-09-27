import React, { useContext } from 'react';
import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  const authContext = useContext(AuthContext);
  let content = authContext.isAuth ? <Ingredients /> : <Auth />;

  return content;
  // return <Auth />;
};

export default App;
