
import './header.scss';
import { LocalStorageService } from "../../services"
import { useUser } from '../../hooks'
import { useNavigate } from 'react-router-dom';

const localStorageService = new LocalStorageService()
export function Header() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  
  const exit = () => {
    localStorageService.removeUser();
    setUser(undefined);
  }

  const login = () => {
    navigate("/user/login")
  }

  const userActions = [{name: 'Login', action: login, mustBeUser: false}, {name: 'exit', action: exit, mustBeUser: true}]
  return (
    <div className="header">
      <div className="user-info">
        <h1 className='user-name'>{user?.name ?? "Ви не увійшли в акаунт"}</h1>
        <div className="dropdown">
          <ul>
            {
              userActions.map((action, index) => {
                if (!action.mustBeUser && !user) {
                  return  <li onClick={action.action} key={index}>{action.name}</li>
                } else if (action.mustBeUser && user) {
                 return <li onClick={action.action} key={index}>{action.name}</li>
                } else {
                  return null
                }
              }      
              )
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

