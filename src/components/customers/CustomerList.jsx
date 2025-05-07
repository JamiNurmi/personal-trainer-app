/**
 * CustomerList component
 * Displays a list of customers with search, sort, and CRUD capabilities
 */
import { useState, useEffect } from 'react';
import CustomerForm from './CustomerForm';
import { CSVLink } from 'react-csv';

const API_BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false); // New loading state
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // Define headers for CSV export
    const headers = [
        { label: 'First Name', key: 'firstname' },
        { label: 'Last Name', key: 'lastname' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
    ];

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const response = await fetch(API_BASE_URL);
                const data = await response.json();
                console.log(data._embedded.customers); // Debugging: Log the customers data
                setCustomers(data._embedded.customers);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchCustomers();
    }, []);

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

    const filteredCustomers = customers.filter((customer) =>
        `${customer.firstname} ${customer.lastname} ${customer.email}`.toLowerCase()
            .includes(search.toLowerCase())
    );

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        const aValue = a[sortField]?.toString().toLowerCase() || '';
        const bValue = b[sortField]?.toString().toLowerCase() || '';

        if (aValue < bValue) return sortAsc ? -1 : 1;
        if (aValue > bValue) return sortAsc ? 1 : -1;
        return 0;
    });

    const handleAddCustomer = (newCustomer) => {
        fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCustomer)
        })
            .then((response) => response.json())
            .then((createdCustomer) => setCustomers([...customers, createdCustomer]))
            .catch((error) => console.error('Error adding customer:', error));
        setShowAddForm(false);
    };

    const handleUpdateCustomer = (customer) => {
        const url = customer.self;

        if (!url) {
            console.error("Customer self-link is missing:", customer);
            return;
        }

        // Remove 'self' field before sending the payload
        const { self, ...payload } = customer;

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update customer");
                return res.json();
            })
            .then(data => {
                console.log("Customer updated:", data);
                fetch(API_BASE_URL) // Refresh the list
                    .then((response) => response.json())
                    .then((data) => setCustomers(data._embedded.customers));
                setEditingCustomer(null); // <-- Hide the form after update
            })
            .catch(err => console.error("Error updating customer:", err));
    };

    const handleDeleteCustomer = (id) => {
        const customerUrl = customers.find((customer) => customer._links.self.href.endsWith(id))._links.self.href;
        if (window.confirm('Are you sure you want to delete this customer?')) {
            fetch(customerUrl, { method: 'DELETE' })
                .then(() => setCustomers(customers.filter((customer) => !customer._links.self.href.endsWith(id))))
                .catch((error) => console.error('Error deleting customer:', error));
        }
    };

    const handleExportCSV = () => {
        exportToCSV(customers, 'customers.csv');
    };

    const handleResetDatabase = () => {
        if (window.confirm('Are you sure you want to reset the database? This will delete all data and restore demo data.')) {
            fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset', {
                method: 'POST',
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Database reset successfully.');
                        return fetch(API_BASE_URL)
                            .then((response) => response.json())
                            .then((data) => setCustomers(data._embedded.customers));
                    } else {
                        throw new Error('Failed to reset database.');
                    }
                })
                .catch((error) => console.error('Error resetting database:', error));
        }
    };

    return (
        <div>
            <h1>Customers</h1>

            {/* Show loading indicator */}
            {loading && <p>Loading customers...</p>}

            {/* Search and action buttons */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                    Add Customer
                </button>
                <CSVLink
                    data={customers}
                    headers={headers} // Use the defined headers
                    filename="customers.csv">
                    <button className="btn-secondary">
                        Export to CSV
                    </button>
                </CSVLink>
                <button className="btn-danger" onClick={handleResetDatabase}>
                    Reset Database
                </button>
            </div>

            {/* Customer data table */}
            {!loading && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                {/* Column headers with sort indicators */}
                                <th onClick={() => handleSort('firstname')}>
                                    First Name
                                    {sortField === 'firstname' && (
                                        <span className="sort-indicator">
                                            {sortAsc ? ' ▲' : ' ▼'}
                                        </span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('lastname')}>
                                    Last Name
                                    {sortField === 'lastname' && (
                                        <span className="sort-indicator">
                                            {sortAsc ? ' ▲' : ' ▼'}
                                        </span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('email')}>
                                    Email
                                    {sortField === 'email' && (
                                        <span className="sort-indicator">
                                            {sortAsc ? ' ▲' : ' ▼'}
                                        </span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('phone')}>
                                    Phone
                                    {sortField === 'phone' && (
                                        <span className="sort-indicator">
                                            {sortAsc ? ' ▲' : ' ▼'}
                                        </span>
                                    )}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Map through sorted customers to create table rows */}
                            {sortedCustomers.map((customer) => (
                                <tr key={customer._links.self.href}>
                                    <td>{customer.firstname}</td>
                                    <td>{customer.lastname}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td className='btn-group'>
                                        {/* Edit and Delete buttons */}
                                        <button
                                            className="btn-secondary"
                                            onClick={() => setEditingCustomer(customer)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDeleteCustomer(customer._links.self.href.split('/').pop())}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Customer Form Modal - conditionally rendered */}
            {showAddForm && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <CustomerForm
                            onSave={handleAddCustomer}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* Edit Customer Form Modal - conditionally rendered */}
            {editingCustomer && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <CustomerForm
                            customer={editingCustomer}
                            onSave={handleUpdateCustomer}
                            onCancel={() => setEditingCustomer(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;