import { AppBar, Button, Checkbox, FormControlLabel, Menu, MenuItem, TextField, Toolbar } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventsList } from '../../components';

export function Events() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    title: '',
    priority: [],
    dueDate: ''
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const create = () => {
    navigate('create-update-event');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleDueDateChange = (date: string) => {
    setFilter({...filter, dueDate: date });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePriorityChange = (priority: string) => {
    const isSelected = filter.priority.includes(priority);
    if (isSelected) {
      setFilter({ ...filter, priority: filter.priority.filter((p) => p !== priority) });
    } else {
      setFilter({ ...filter, priority: [...filter.priority, priority] });
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Пошук..."
            name="title"
            value={filter.title}
            onChange={handleFilterChange}
          />

          <Button
            color='primary'
            variant="contained"
            onClick={handleClick}
            style={{ marginLeft: '16px' }}
            aria-controls="priority-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            Пріоритет
          </Button>

          <Menu
            id="priority-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {['NORMAL', 'IMPORTANT', 'CRITICAL'].map((priority) => (
              <MenuItem key={priority}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filter.priority.includes(priority)}
                      onChange={() => handlePriorityChange(priority)}
                    />
                  }
                  label={priority}
                />
              </MenuItem>
            ))}
          </Menu>

          <Button variant="contained" color="primary" style={{ marginLeft: 'auto' }} onClick={create}>
            Створити
          </Button>
        </Toolbar>
      </AppBar>

      <EventsList filter={filter} setDayForFilter={handleDueDateChange}/>
    </>
  );
}