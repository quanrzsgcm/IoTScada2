import React, { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Typography } from 'antd';
import { message, Space } from 'antd';
import MainviewLayout from '../layouts/MainviewLayout';

const PmForm = () => {
    const [pwtwin, setPwtwin] = useState({
        id: "99",
        policyId: "my.test:policy",
        attributes: {
            manufacturer: "Well known producer",
            "serial number": "01",
            location: "Not specified"
        },
        features: {
            measurements: {
                properties: {
                    power: 0,
                    voltage: 0,
                    current: 0,
                    energy: 0
                }
            }
        }
    });

    const success = (mymessage) => {
        message.success(mymessage);
    };

    const { Title } = Typography;

    const fetchData = () => {
        // const url = process.env.REACT_APP_API_URL_1;
        const url = "http://localhost:8000/api2/my-api/create-things/";

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(pwtwin),
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // success(data.message); // something wrong here
                message.success("palce");
                console.log("Data:", data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const onFinish = (values) => {
        pwtwin.attributes.location = values.location ?? pwtwin.attributes.location;
        pwtwin.attributes.manufacturer = values.manufacturer ?? pwtwin.attributes.manufacturer;
        pwtwin.attributes['serial number'] = values['serial number'] ?? pwtwin.attributes['serial number'];
        pwtwin.id = values.id ?? pwtwin.id;
        console.log(JSON.stringify(pwtwin, null, 2));
        fetchData();
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <MainviewLayout>
            <div>
                <Title level={2}> Add new device</Title>

                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 400,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="ID"
                        name="id"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your device id!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Manufacturer"
                        name="manufacturer"
                        rules={[
                            {
                                required: false,
                                message: '',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Location"
                        name="location"
                        rules={[
                            {
                                required: false,
                                message: '',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Serial number"
                        name="serial number"
                        rules={[
                            {
                                required: false,
                                message: '',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </MainviewLayout>
    );
}
export default PmForm;
