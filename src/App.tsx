import { BrowserRouter } from "react-router-dom";
import AppRoute from "./routes/AppRoute";
import { SearchProvider } from "./context/searchContext";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";

function App() {
  
  return (
    <SearchProvider>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;
