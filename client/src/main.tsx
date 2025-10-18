import ReactDOM from 'react-dom/client';
import App from './components/App';
import { AuthProvider } from './context/AuthContext';
import './style/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

