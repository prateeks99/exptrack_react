import {React, useState} from 'react';
import Report from './Report.js';
import Login from './Login.js';
import Register from './Register.js';
import './App.css';

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [registering, setRegistering] = useState(false);
    
    const handleLogin = (username) => {
      setLoggedInUser(username);
      fetchUserData(username)
      setRegistering(false); 
    };
  
    const handleLogout = () => {
      setLoggedInUser(null);
    };

    const handleRegister = () => {
      setRegistering(true);
    };

    const [userData, setUserData] = useState([])

    const fetchUserData = (username) => {
      fetch(`http://localhost:8080/users/${username}`)
      .then((response)  => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error('Error fetching user data:', error));
      console.log(userData)
    }

    return(
      <div>
        <div className={`bg-teal-500 text-white mb-4 justify-between align-middle ${loggedInUser ? "flex" : ""}`}>
        <h1 className="text-3xl  px-8 py-4 font-semibold text-center">
          Expense Tracker
        </h1>
        {loggedInUser &&
          <div className='h-full align-middle my-4'>
            Hello {userData.first_name} {userData.last_name}
            <button onClick={handleLogout} className="rounded-lg align-middle h-8 mx-8 px-3 text-sm text-black bg-white font-semibold cursor-pointer">
              Logout
            </button>
          </div>
          
        }
        </div>
        {loggedInUser ? (
          <div>
            <Report username={loggedInUser} />
          </div>
        ) : (
          <div className="max-w-xl mx-auto mt-8 bg-white p-8 rounded-lg">
            {registering ? (
              <Register onRegister={() => setRegistering(false)} />
            ) : (
              <Login onLogin={handleLogin} onRegister={handleRegister} />
            )}
          </div>
        )}
      </div>
    )
}

export default App;
