import withAuth from '../../auth/withAuth';
import { useUser } from '../../auth/useUser';

const Private = () => {
  const { user, logout } = useUser();

  return (
    <div className="flex-1 pt-7 pb-2">
      <div>Private</div>
      {
        user?.email &&
        <div>
          <div>Email: {user.email}</div>
          <button onClick={() => logout()}>Logout</button>
        </div>
      }
    </div>
  )
}

export default withAuth(Private);
