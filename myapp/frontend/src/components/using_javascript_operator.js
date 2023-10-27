import React, { useState } from 'react';

function DataForm() {
    const [formData, setFormData] = useState({
        id: '',
        manufacturer: '',
        serialNumber: '',
        location: '',
        power: '',
        voltage: '',
        current: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        const jsonData = JSON.stringify(formData, null, 2);
        console.log(jsonData);
        try {
            // Send a PUT request with jsonData to the web server
            await fetch('http://example.com/api/endpoint', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form>
                <label>
                    ID:
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Manufacturer:
                    <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Serial Number:
                    <input
                        type="text"
                        name="serialNumber" {/* Fix the name attribute here */}
                        value={formData.serialNumber}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Location:
                    <input
                        type="text"
                        name="location" {/* Fix the name attribute here */}
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Power:
                    <input
                        type="text"
                        name="power" {/* Fix the name attribute here */}
                        value={formData.power}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Voltage:
                    <input
                        type="text"
                        name="voltage" {/* Fix the name attribute here */}
                        value={formData.voltage}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Current:
                    <input
                        type="text"
                        name="current" {/* Fix the name attribute here */}
                        value={formData.current}
                        onChange={handleInputChange}
                    />
                </label>
                <br />

                <button type="button" onClick={handleSubmit}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default DataForm;
