import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
    ConfigProvider
} from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const FormInverter = () => {
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
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    style={{
                        maxWidth: 600,
                    }}
                >                    
                    <Form.Item label="Name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Manufacturer">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Model">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Serial Number">
                        <Input />
                    </Form.Item>                                        
                </Form>
            </ConfigProvider>

        </>
    );
};
export default () => <FormInverter />;