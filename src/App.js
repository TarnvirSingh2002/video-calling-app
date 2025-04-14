import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import "./App.css";
import Cont from "./Cont.js"
import Room from "./Components/Room";
function App() {
  return (
    <>
    <BrowserRouter>
      <Cont>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/room/:roomId" element={<Room/>}/>
        </Routes>
      </Cont>
    </BrowserRouter>
      
    </>
  );
}

export default App;
