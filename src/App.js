import React, { useContext } from 'react';

import Todos from './components/Todos/Todos';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  const authContext = useContext(AuthContext);
  console.log(process.env.FIRE_BASE_URL)
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Todos />;
  }

  return content;
};

export default App;
