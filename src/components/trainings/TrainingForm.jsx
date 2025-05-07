/**
 * TrainingForm component
 * Form for adding/editing training sessions
 */
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const activityOptions = [
    "Yoga",
    "Running",
    "Swimming",
    "Gym",
    "Cycling",
    "Boxing"
];

const TrainingForm = ({ onSave, onCancel, training }) => {
    const [formData, setFormData] = useState({
        date: dayjs().format('YYYY-MM-DDTHH:mm'),
        activity: '',
        duration: 30,
        customer: ''
    });
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch customers on component mount
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers');
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data._embedded.customers || []);
                } else {
                    console.error('Error fetching customers:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Initialize form when editing existing training
    useEffect(() => {
        if (training) {
            setFormData({
                date: dayjs(training.date).format('YYYY-MM-DDTHH:mm'),
                activity: training.activity,
                duration: training.duration,
                customer: training.customer?._links?.self.href || ''
            });
        }
    }, [training]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'duration') {
            const durationValue = parseInt(value, 10);
            if (!isNaN(durationValue)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: Math.max(1, durationValue)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let dateStr = formData.date;
        if (!dateStr.includes('T')) {
            dateStr += 'T00:00:00';
        }

        const trainingToSave = {
            date: new Date(dateStr).toISOString(),
            activity: formData.activity,
            duration: formData.duration,
            customer: formData.customer,
        };

        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
                method: training ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trainingToSave),
            });

            if (response.ok) {
                const newTraining = await response.json();

                // Fetch customer details using the link
                if (newTraining._links?.customer?.href) {
                    const customerResponse = await fetch(newTraining._links.customer.href);
                    if (customerResponse.ok) {
                        const customerData = await customerResponse.json();
                        newTraining.customer = customerData; // Add customer details to the training object
                    }
                }

                onSave(newTraining); // Pass the updated training object to the parent component
            } else {
                console.error('Error saving training:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving training:', error);
        }

        onCancel(); // Close the form after saving
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="form-title">{training ? 'Edit Training' : 'Add New Training'}</h2>

            {/* Customer selection */}
            <div className="form-group">
                <label htmlFor="customer">Customer</label>
                {loading ? (
                    <p>Loading customers...</p>
                ) : (
                    <select
                        id="customer"
                        name="customer"
                        value={formData.customer}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="" disabled>Select a customer</option>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <option
                                    key={customer._links.self.href}
                                    value={customer._links.self.href}
                                >
                                    {customer.firstname} {customer.lastname}
                                </option>
                            ))
                        ) : (
                            <option value="">No customers available</option>
                        )}
                    </select>
                )}
            </div>

            {/* Date and time selection */}
            <div className="form-group">
                <label htmlFor="date">Date and Time</label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
            </div>

            {/* Activity selection */}
            <div className="form-group">
                <label htmlFor="activity">Activity</label>
                <select
                    id="activity"
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    required
                    className="form-control"
                >
                    <option value="" disabled>Select an activity</option>
                    {activityOptions.map((activity) => (
                        <option key={activity} value={activity}>
                            {activity}
                        </option>
                    ))}
                </select>
            </div>

            {/* Duration input */}
            <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    required
                    className="form-control"
                />
            </div>

            {/* Form action buttons */}
            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn-save">
                    {training ? 'Update' : 'Save'}
                </button>
            </div>
        </form>
    );
};

export default TrainingForm;