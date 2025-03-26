import React, { lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

const BookRecommend = lazy(() => import("./pages/Book"))


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BookRecommend />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;