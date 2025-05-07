import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import axios from 'axios';  // Axios for making API requests

// Setup the localizer for react-big-calendar using moment.js
const localizer = momentLocalizer(moment);

const TrainingCalendar = () => {
    // State to track the current calendar view (month, week, day)
    const [view, setView] = useState('month');

    // State for holding the trainings data
    const [trainings, setTrainings] = useState([]);

    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch trainings data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings'
                );
                setTrainings(response.data); // Set the trainings with associated customer data
                setLoading(false);  // Set loading to false once data is fetched
            } catch (err) {
                setError('Failed to load training data');
                setLoading(false);  // Set loading to false if there's an error
            }
        };

        fetchData();
    }, []);  // Empty dependency array means this will run once when the component mounts

    /**
     * Convert trainings to calendar events format
     * Each training becomes an event with:
     * - title combining activity and customer name
     * - start time from training date
     * - end time calculated by adding duration minutes to start time
     */
    const events = trainings.map(training => {
        const customerName = training.customer
            ? `${training.customer.firstname} ${training.customer.lastname}`
            : 'Unknown';
        const start = new Date(training.date);
        const end = new Date(start);
        // Calculate end time by adding duration minutes
        end.setMinutes(end.getMinutes() + training.duration);

        return {
            id: training.id,
            title: `${training.activity} – ${customerName}`,
            start,
            end
        };
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Training Calendar</h1>

            {/* View selector buttons */}
            <div className="view-selector" style={{ marginBottom: '1rem' }}>
                <button
                    className={`btn-secondary ${view === 'month' ? 'active' : ''}`}
                    onClick={() => setView('month')}
                >
                    Month
                </button>
                <button
                    className={`btn-secondary ${view === 'week' ? 'active' : ''}`}
                    onClick={() => setView('week')}
                >
                    Week
                </button>
                <button
                    className={`btn-secondary ${view === 'day' ? 'active' : ''}`}
                    onClick={() => setView('day')}
                >
                    Day
                </button>
            </div>

            {/* Calendar component from react-big-calendar */}
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={setView}
                    views={['month', 'week', 'day']}
                    step={60} // Time slot increments in minutes
                    showMultiDayTimes
                    defaultDate={new Date()} // Current date as default view
                />
            </div>
        </div>
    );
};

export default TrainingCalendar;
