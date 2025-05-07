import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { groupBy, sumBy } from 'lodash';

const StatisticsPage = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all trainings
    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await axios.get(
                    'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings'
                );
                setTrainings(response.data); // Set the trainings data
                setLoading(false);
            } catch (err) {
                setError('Failed to load training data');
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []); // Run only once when the component mounts

    // Handle loading or error states
    if (loading) {
        return <div>Loading statistics...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Group trainings by activity and calculate total duration per activity
    const activityDurations = Object.entries(
        groupBy(trainings, 'activity') // Group by activity type
    ).map(([activity, trainings]) => ({
        activity,
        totalDuration: sumBy(trainings, 'duration') // Sum the duration of each grouped activity
    }));

    // Prepare the data for the BarChart
    const chartData = activityDurations.map(item => ({
        name: item.activity,
        duration: item.totalDuration
    }));

    return (
        <div>
            <h1>Training Activity Statistics</h1>

            {/* Bar Chart showing total duration per activity */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="duration" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatisticsPage;
