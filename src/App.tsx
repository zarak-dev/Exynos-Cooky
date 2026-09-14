import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRoute from "./routes/AppRoute";
import { restoreSessionRequest, restoreSessionSuccess } from "./store/slices/authSlice";
import { fetchInventoryRequest } from "./store/slices/inventorySlice";
import { supabase, isSupabaseConfigured } from "./services/supabase/client";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSessionRequest());
    dispatch(fetchInventoryRequest());

    if (isSupabaseConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          dispatch(restoreSessionRequest());
        } else if (event === "SIGNED_OUT") {
          dispatch(restoreSessionSuccess(null));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;
