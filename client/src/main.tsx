import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux';
import { store } from './features/store.ts';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import UserLoginPage from './page/login/user.LoginPage.tsx';
import Home from './page/home/index.tsx';
import UserSignUpPage from './page/SignUp/index.tsx';
import SearchComponent from './page/home/search.tsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <UserLoginPage />
  },

  {
    path: "/",
    element: <Home />
  },
  {
    path: "/search",
    element: <SearchComponent />
  },
  {
    path: "/signup",
    element: <UserSignUpPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
