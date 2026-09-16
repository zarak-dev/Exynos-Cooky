import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRoute from "./routes/AppRoute";
import {
  restoreSessionRequest,
  restoreSessionSuccess,
  resetAuthLoading,
} from "./store/slices/authSlice";
import { fetchInventoryRequest } from "./store/slices/inventorySlice";
import { supabase, isSupabaseConfigured } from "./services/supabase/client";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSessionRequest());
    dispatch(fetchInventoryRequest());

    // Reset stuck OAuth/login spinners if user navigates back via browser Back button (bfcache) or refocuses window
    const handlePageShow = () => {
      dispatch(resetAuthLoading());
    };
    const handleFocus = () => {
      dispatch(resetAuthLoading());
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handleFocus);

    let unsubscribeAuth: (() => void) | undefined;
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

      unsubscribeAuth = () => {
        subscription.unsubscribe();
      };
    }

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;
