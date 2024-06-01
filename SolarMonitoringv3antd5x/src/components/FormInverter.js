import React, { useState, useEffect} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    ConfigProvider
} from 'antd';

const FormInverter = ({ onFormSubmit }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Form values:', values);
    };
    useEffect(() => {
        if (onFormSubmit) {
            onFormSubmit(form);
        }
    }, [form, onFormSubmit]);

    const validateIP = (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        // Regular expression to validate IPv4 address
        const ipRegExp = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
        if (ipRegExp.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('Invalid IP address format!');
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Form: {
                            labelColor: 'white',
                            colorBorder: 'blue',
                            colorTextDescription: 'red',
                            colorBgContainer: 'red',
                            labelColonMarginInlineEnd: 8,
                            margin: 0,
                            paddingSM: 0,
                        },
                        Input: {
                        }
                    },
                }}
            >
                <Form
                    form={form}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    style={{
                        maxWidth: 650,
                    }}
                    onFinish={onFinish}
                    preserve={false}
                >                    
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Manufacturer"
                        name="manufacturer"
                        rules={[{ required: false, message: 'Please input the manufacturer!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Model"
                        name="model"
                        rules={[{ required: false, message: 'Please input the model!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Serial Number"
                        name="serialNumber"
                        rules={[{ required: false, message: 'Please input the serial number!' }]}
                    >
                        <Input />
                    </Form.Item>     
                    <Form.Item
                        label="IP Address"
                        name="ipaddress"
                        rules={[
                            { required: true, message: 'Please input the IP address!' },
                            { validator: validateIP }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </>
    );
};

export default FormInverter;
