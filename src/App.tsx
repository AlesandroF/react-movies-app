import { BrowserRouter } from 'react-router-dom';
import Routes from '../src/routes';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </>
  );
}

export default App;
