import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRoute from "./routes/AppRoute";
import { restoreSessionRequest } from "./store/slices/authSlice";
import { fetchInventoryRequest } from "./store/slices/inventorySlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSessionRequest());
    dispatch(fetchInventoryRequest());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;
