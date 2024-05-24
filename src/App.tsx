import React,{useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import AddTask from './components/AddTask'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import updateTask from './components/updateTask'
import { DataContext } from './context/dataContext'


const App : React.FC =()=> { 
  const [task, setTask] = useState<any[]>([]);
  const allTodo = async () => {
    const response = await fetch("http://127.0.0.1:8000/");
    const res = await response.json();
    // console.log(res);
    setTask(res);
  };
  useEffect(()=>{
    allTodo();
  },[])
  return (
    <>
    <DataContext.Provider value={task}>
      <Navbar/>
      <Router>
        <Routes>
          <Route path="/addtask" Component={AddTask}/>
          <Route path='/' Component={Home}/>
          <Route path='/update-task/:id' Component={updateTask}/>
        </Routes>
      </Router>  
      </DataContext.Provider>    
    </>
  )
}

export default App
