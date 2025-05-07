/**
 * CustomerForm component
 * Form for adding new customers or editing existing ones
 */
import { useState, useEffect } from 'react';

const CustomerForm = ({ customer, onSave, onCancel }) => {
    // Form data state with default empty values
    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: '',
        self: null
    });

    /**
     * Initialize form with customer data if editing an existing customer
     * This effect runs when the customer prop changes
     */
    useEffect(() => {
        if (customer) {
            setFormData({
                id: customer.id || '', // <-- important for PUT
                firstName: customer.firstname || '',
                lastName: customer.lastname || '',
                email: customer.email || '',
                phone: customer.phone || '',
                streetaddress: customer.streetaddress || '',
                postcode: customer.postcode || '',
                city: customer.city || '',
                self: customer.self || null // Preserve self link if available
            });
        }
    }, [customer]);

    /**
     * Handle form input changes
     * Updates the formData state when any field changes
     * 
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handle form submission
     * Either updates an existing customer or creates a new one
     * 
     * @param {Event} e - Form submit event
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const customerToSave = {
            id: formData.id, // Pass the ID for PUT
            firstname: formData.firstName,
            lastname: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            streetaddress: formData.streetaddress,
            postcode: formData.postcode,
            city: formData.city,
            self: customer?._links?.self?.href || null // <-- Added self field
        };

        onSave(customerToSave);
        onCancel(); // <-- Close the form after saving
    };

    // Determine form title based on whether we're adding or editing
    const formTitle = customer ? 'Edit Customer' : 'Add New Customer';

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="form-title">{formTitle}</h2>

            {/* First Name field */}
            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Last Name field */}
            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Email field */}
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Phone field */}
            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Street Address field */}
            <div className="form-group">
                <label htmlFor="streetaddress">Street Address</label>
                <input
                    type="text"
                    id="streetaddress"
                    name="streetaddress"
                    value={formData.streetaddress}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Postcode field */}
            <div className="form-group">
                <label htmlFor="postcode">Postcode</label>
                <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* City field - optional */}
            <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                />
            </div>

            {/* Form action buttons */}
            <div className="button-group">
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary">
                    Save
                </button>
            </div>
        </form>
    );
};

export default CustomerForm;