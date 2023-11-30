import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Button, Flex } from 'antd';


function DataTable() {
    const [data, setData] = useState(null);
    const fetchData = () => {
        // const url = process.env.REACT_APP_API_URL_1;
        const url = "http://localhost:8000/api2/my-api/things/";
        const username = process.env.REACT_APP_USERNAME;
        const password = process.env.REACT_APP_PASSWORD;
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

    const columns = [
        {
            title: 'Thing ID',
            dataIndex: 'thingId',
            key: 'thingId',
        },
        {
            title: 'Power',
            dataIndex: ['features', 'measurements', 'properties', 'power'],
            key: 'power',
        },
        {
            title: 'Voltage',
            dataIndex: ['features', 'measurements', 'properties', 'voltage'],
            key: 'voltage',
        },
        {
            title: 'Current',
            dataIndex: ['features', 'measurements', 'properties', 'current'],
            key: 'current',
        },
    ];

    const handleUpdatePower = () => {
        const newData = [...data];
        newData[2].features.measurements.properties.power += 5;
        setData(newData);
    }
    return (
        <div>
            <div>
                <p>PowerMeterRanking</p>
            </div>
            <div>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                />
                <Button type="primary" onClick={handleUpdatePower}>Data test</Button>
            </div>
        </div>
    );
};

export default DataTable;


// function ChildComponent(props) {
//     const { data } = props;
//     const [showModal, setShowModal] = useState(false);


//     const modalContent = (
//         <div>
//             <TimeInputComponent /> {/* Include the TimeInputComponent here */}
//         </div>
//     );
//     const openModal = () => {

//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);

//     };

//     if (!data) {
//         return <p>Data is not available.</p>;
//     }

//     return (
//         <div>
//             <Table>
//                 <thead>
//                     <tr>
//                         <th>Thing Id</th>
//                         <th>Power</th>
//                         <th>Voltage</th>
//                         <th>Current</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((item, index) => (
//                         <tr key={index}>
//                             <td>
//                                 <Button variant="link" onClick={() => openModal(item.thingId)}>
//                                     {item.thingId}
//                                 </Button>
//                             </td>
//                             {/* Render other cells */}
//                             <td>{item.features.measurements.properties.power}</td>
//                             <td>{item.features.measurements.properties.voltage}</td>
//                             <td>{item.features.measurements.properties.current}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//             <Modal show={showModal} onHide={closeModal}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Modal Content</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>{modalContent}</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={closeModal}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// }
