import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Example() {
    var PMtwin = {
        policyId: "my.test:policy",
        attributes: {
            manufacturer: "",
            "serial number": "",
            location: ""
        },
        features: {
            measurements: {
                properties: {
                    power: 0,
                    voltage: 0,
                    current: 0
                }
            }
        }
    }

    const [show, setShow] = useState(false);
    const [id, setID] = useState('');
    const [serial_number, setSerial] = useState('');
    const [location, setLocation] = useState('');
    const [manufacturer, setManufacturer] = useState('');

    const handleClose = () => {
        setShow(false);
        // Reset form fields when the modal is closed
        setID('');
        setLocation('');
        setManufacturer('');
        setSerial('');
    };

    const handleShow = () => setShow(true);

    const handleSaveChanges = () => {
        // Map the input values to the PMtwin object
        PMtwin.attributes.location = location;
        PMtwin.attributes.manufacturer = manufacturer;
        PMtwin.attributes['serial number'] = serial_number;
        console.log(PMtwin);
        handleSubmit();

        handleClose(); // Close the modal after saving the changes
    };
    const handleSubmit = async () => {
        const jsonData = JSON.stringify(PMtwin, null, 2);
        console.log(jsonData);
        const place = 'pm03';
        try {
            const url = `http://localhost:8080/api/2/things/my.power:${place}`;
            const username = 'ditto';
            const password = 'ditto';

            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            });
            // Send a PUT request with jsonData to the web server
            await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: jsonData,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create new device
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter device properties</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Device ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="001"
                                autoFocus
                                value={id}
                                onChange={(e) => setID(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={1}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Manufacturer</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={1}
                                value={manufacturer}
                                onChange={(e) => setManufacturer(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>serial_number</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={1}
                                value={serial_number}
                                onChange={(e) => setSerial(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Example;
