/**
 * Main application component
 * Handles routing, layout, and shared state management
 */
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { fetchData } from './data/api';
import CustomerList from './components/customers/CustomerList';
import TrainingList from './components/trainings/TrainingList';
import TrainingCalendar from './components/calendar/TrainingCalendar';
import TrainingStats from './components/stats/TrainingStats';

// Determine basename for GitHub Pages deployment
// This ensures correct URL paths when deployed to a subdirectory
const basename = process.env.NODE_ENV === 'production'
  ? '/personalTrainerApp' // Production path - should match repo name
  : '/'; // Local development path

function App() {
  // Shared state for customers and trainings
  const [customers, setCustomers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const customersData = await fetchData('customers');
        setCustomers(Array.isArray(customersData) ? customersData : []);
        const trainingsData = await fetchData('trainings');
        setTrainings(Array.isArray(trainingsData) ? trainingsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading text or spinner
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <BrowserRouter basename={basename}>
      {/* Navigation bar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* App title/logo with link to home */}
          <Link to="/" className="navbar-brand">
            Personal Trainer App
          </Link>

          {/* Main navigation links */}
          <div className="navbar-nav">
            <NavLink to="/customers" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"}>
              Customers
            </NavLink>
            <NavLink to="/trainings" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"}>
              Trainings
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"}>
              Calendar
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"}>
              Statistics
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content container */}
      <div className="container">
        {/* Route configuration */}
        <Routes>
          {/* Home route - shows customer list */}
          <Route path="/" element={<CustomerList
            customers={customers}
            setCustomers={setCustomers}
          />} />

          {/* Customer management route */}
          <Route path="/customers" element={<CustomerList
            customers={customers}
            setCustomers={setCustomers}
          />} />

          {/* Training management route */}
          <Route path="/trainings" element={<TrainingList
            trainings={trainings}
            setTrainings={setTrainings}
            customers={customers}
          />} />

          {/* Calendar view route */}
          <Route path="/calendar" element={<TrainingCalendar
            trainings={trainings}
            customers={customers}
          />} />

          {/* Statistics route */}
          <Route path="/stats" element={<TrainingStats
            trainings={trainings}
          />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
