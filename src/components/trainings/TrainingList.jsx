/**
 * TrainingList component
 * Displays a list of training sessions with search, sort, and CRUD capabilities
 */
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import TrainingForm from './TrainingForm';

const TrainingList = ({ customers }) => {
    const [trainings, setTrainings] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings');
                const data = await response.json();
                setTrainings(data); // Directly use customer data embedded in the training object
            } catch (error) {
                console.error('Error fetching trainings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    const getCustomerName = (training) => {
        return training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : 'Unknown';
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const filteredTrainings = trainings.filter((training) => {
        const customerName = getCustomerName(training).toLowerCase();
        const activity = training.activity.toLowerCase();
        const query = search.toLowerCase();
        return customerName.includes(query) || activity.includes(query);
    });

    const sortedTrainings = [...filteredTrainings].sort((a, b) => {
        if (sortField === 'customer') {
            const aCustomer = getCustomerName(a).toLowerCase();
            const bCustomer = getCustomerName(b).toLowerCase();
            if (aCustomer < bCustomer) return sortAsc ? -1 : 1;
            if (aCustomer > bCustomer) return sortAsc ? 1 : -1;
            return 0;
        } else if (sortField === 'date') {
            const aDate = new Date(a.date).getTime();
            const bDate = new Date(b.date).getTime();
            return sortAsc ? aDate - bDate : bDate - aDate;
        } else {
            const aValue = a[sortField]?.toString().toLowerCase() || '';
            const bValue = b[sortField]?.toString().toLowerCase() || '';
            return aValue < bValue ? (sortAsc ? -1 : 1) : (sortAsc ? 1 : -1);
        }
    });

    const handleAddTraining = (newTraining) => {
        setTrainings([...trainings, newTraining]);
        setShowAddForm(false);
    };

    const handleDeleteTraining = async (id) => {
        if (window.confirm('Are you sure you want to delete this training session?')) {
            try {
                await fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${id}`, {
                    method: 'DELETE',
                });
                setTrainings(trainings.filter((training) => training.id !== id));
            } catch (error) {
                console.error('Error deleting training:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Training Sessions</h1>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search trainings..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                    Add Training
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('date')}>
                                Date
                                {sortField === 'date' && (
                                    <span className="sort-indicator">{sortAsc ? ' ▲' : ' ▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('activity')}>
                                Activity
                                {sortField === 'activity' && (
                                    <span className="sort-indicator">{sortAsc ? ' ▲' : ' ▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('duration')}>
                                Duration (min)
                                {sortField === 'duration' && (
                                    <span className="sort-indicator">{sortAsc ? ' ▲' : ' ▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('customer')}>
                                Customer
                                {sortField === 'customer' && (
                                    <span className="sort-indicator">{sortAsc ? ' ▲' : ' ▼'}</span>
                                )}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTrainings.map((training, index) => (
                            <tr key={training.id || index /* Ensure a unique key */}>
                                <td>{dayjs(training.date).format('DD.MM.YYYY HH:mm')}</td>
                                <td>{training.activity}</td>
                                <td>{training.duration}</td>
                                <td>{getCustomerName(training)}</td>
                                <td>
                                    <button className="btn-danger" onClick={() => handleDeleteTraining(training.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showAddForm && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <TrainingForm
                            onSave={handleAddTraining}
                            onCancel={() => setShowAddForm(false)}
                            customers={customers}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingList;