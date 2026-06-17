import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import { SearchProvider } from './context/searchContext';

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