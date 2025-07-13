import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { TasksProvider } from './context/TasksContext';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TasksProvider>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div">
                Менеджер задач
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<TaskList />} />
              <Route path="/task/:id" element={<TaskDetails />} />
            </Routes>
          </Box>
        </Router>
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
