import React, { createContext, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { io } from 'socket.io-client';
const root = ReactDOM.createRoot(document.getElementById('root'));

export const context = createContext();

const Bin =()=>{
  const socket = useMemo(()=>io("http://localhost:5000"),
  []);// here useMemo hook returning the io where as useEffect can not return anything
 return(
 <context.Provider value={{socket}}>
  <App/>
 </context.Provider>)
}

root.render(
  <React.StrictMode>
    <Bin />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
