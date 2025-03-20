import { AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks';
import { LocalStorageService } from "../../services";

const localStorageService = new LocalStorageService()
const pages = ['Events'];
export function Header() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  
  const exit = () => {
    localStorageService.removeUser();
    setUser(undefined);
    handleNavigateTo('')
  }

  const login = () => {
    handleNavigateTo('user/login')
  }
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = (fun?) => {
    setAnchorElUser(null);
    if(fun) fun();
  };

  const handleNavigateTo = (page: string) => {
    navigate(`${page.toLowerCase()}`)
  }
  const userActions = [{name: 'Login', action: login, mustBeUser: false}, {name: 'exit', action: exit, mustBeUser: true}]
  return (
    <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="a"
          onClick={() => handleNavigateTo('/')}
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          LOGO
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => handleNavigateTo(page)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <Button onClick={handleOpenUserMenu} sx={{ p: 0 }}  color="secondary" variant='text'>
              {user ? user.name : 'Не авторизований користувач'}
            </Button>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {userActions.map((action, index) => {
              if (!action.mustBeUser && !user) {
                return  <MenuItem key={index} onClick={() => handleCloseUserMenu(action.action)}>
                         <Typography sx={{ textAlign: 'center' }}>{action.name}</Typography>
                        </MenuItem>
              } else if (action.mustBeUser && user) {
               return <MenuItem key={index} onClick={() => handleCloseUserMenu(action.action)}>
                        <Typography sx={{ textAlign: 'center' }}>{action.name}</Typography>
                     </MenuItem>
              } else {
                return null
              }
             
          })}
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  )
}

