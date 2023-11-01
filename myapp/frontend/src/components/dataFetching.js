import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimeInputComponent from './timeInput';


function DataFetchingComponent() {
    const [data, setData] = useState(null);
    const fetchData = () => {
        const url = `http://localhost:8080/api/2/things`;
        const username = 'ditto';
        const password = 'ditto';
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ':' + password),
        });
        fetch(url, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);            
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        // fetch data first time
        fetchData();
               
        // set up a time interval
        const intervalID = setInterval(fetchData, 2000);

        // clean up the interval when the component unmounts
        return () => clearInterval(intervalID);
    }, []);
    

    return (
        <ChildComponent data={data} />
      );
        
}
function ChildComponent(props) {
    const { data } = props;
    const [showModal, setShowModal] = useState(false);
    
  
    const modalContent = (
      <div>
        <TimeInputComponent /> {/* Include the TimeInputComponent here */}
      </div>
    );
    const openModal = () => {
    
      setShowModal(true);
    };
  
    const closeModal = () => {
      setShowModal(false);
    
    };
  
    if (!data) {
      return <p>Data is not available.</p>;
    }
  
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Thing Id</th>
              <th>Power</th>
              <th>Voltage</th>
              <th>Current</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  <Button variant="link" onClick={() => openModal(item.thingId)}>
                    {item.thingId}
                  </Button>
                </td>
                {/* Render other cells */}
                <td>{item.features.measurements.properties.power}</td>
              <td>{item.features.measurements.properties.voltage}</td>
              <td>{item.features.measurements.properties.current}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal Content</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalContent}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  

export default DataFetchingComponent;
