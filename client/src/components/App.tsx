import { Header } from "./layout/parts/Header";
import { AppMain } from "./layout/parts/AppMain";
import { Layout as AppLayout } from "./layout/layout";
import { useEncryption } from "../hooks/useEncryption";
import { useAuth } from "../context/AuthContext";
import { Login } from "./auth/Login";

function App() {
  const { message, loading } = useEncryption();
  const { user, loading: authLoading } = useAuth();

  // Показываем загрузку пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем экран входа
  if (!user) {
    return <Login />;
  }

  // Если авторизован, показываем приложение
  return (
    <AppLayout>
      <Header loading={loading} message={message} />
      <AppMain />
    </AppLayout>
  );
}

export default App;
