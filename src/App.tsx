import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import AddTask from './components/AddTask'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

const App : React.FC =()=> { 

  return (
    <>
      <Navbar/>
      <Router>
        <Routes>
          <Route path="/addtask" Component={AddTask}/>
          <Route path='/' Component={Home}/>
        </Routes>
      </Router>      
    </>
  )
}

export default App
