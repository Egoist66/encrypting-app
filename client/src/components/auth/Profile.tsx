import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-dropdown">
      <img 
        src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
        alt={user.name}
        className="profile-avatar"
      />
      <div className="profile-info">
        <span className="profile-name">{user.name}</span>
        <span className="profile-email">{user.email}</span>
      </div>
      <button onClick={logout} className="logout-btn">
        Выйти
      </button>
    </div>
  );
};

