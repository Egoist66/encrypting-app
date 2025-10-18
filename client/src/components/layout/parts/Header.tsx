import { useAuth } from '../../../context/AuthContext';

export const Header = ({ loading, message }: { loading: boolean, message: string }) => {
  const { user, logout } = useAuth();

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="header-title">
          <h1>🔐 Приложение для магических сообщений</h1>
          <p className={loading ? "loading" : "status"}>
            {loading ? "Соединение..." : message}
          </p>
        </div>
        
        {user && (
          <div className="user-profile">
            <img 
              src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
              alt={user.name}
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="logout-button">
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
