import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Checkbox } from 'antd';
const data = [];

for (let i = 0; i < 10; i++) {
    const record = {
        key: i.toString(),
        name: `Inverter ${i + 1}`,
        label: `Label ${i + 1}`,
        stage: i % 2 === 0 ? 'Running' : 'Init',
        stage_start_on: `2024-04-13T12:${i < 10 ? '0' + i : i}:00`,
        stage_duration: `${Math.floor(Math.random() * 24)}`, // Random duration between 0 and 24 hours
        meter_read_total_energy: `${Math.random() * 1000}`, // Random total energy value
        active_power: `${Math.random() * 100}`, // Random active power value
        input_power: `${Math.random() * 100}`, // Random input power value
        efficiency: `${Math.random() * 100}`, // Random efficiency value
        grid_freq: `${Math.random() * 60}`, // Random grid frequency value
        production_today: `${Math.random() * 100}`, // Random production today value
        yield_today: `${Math.random() * 24}`, // Random yield today value
    };
    data.push(record);
}

console.log(data);






const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';
const LVDeviceList = () => {
    
const columns = [
    {
        title: 'Inverter Name',
        dataIndex: 'name',
    },
    {
        title: 'Label',
        dataIndex: 'label',
    },
    {
        title: 'Stage',
        dataIndex: 'stage',
        sorter: (a, b) => {
            // Define numerical values for each stage
            const stageOrder = {
                Running: 1,
                Init: 2,
            };

            // Get the numerical value of the stage for each row
            const stageA = stageOrder[a.stage];
            const stageB = stageOrder[b.stage];

            // Compare the numerical values
            return stageA - stageB;
        },
    },
    {
        title: 'Stage start on',
        dataIndex: 'stage_start_on',
    },
    {
        title: 'Stage duration (h)',
        dataIndex: 'stage_duration ',
    },
    {
        title: 'Meter-read Total Energy',
        dataIndex: 'meter_read_total_energy',
    },
    {
        title: 'Active Power(kW)',
        dataIndex: 'active_power',
    },
    {
        title: 'Input Power(kW)',
        dataIndex: 'input_power',
    },
    {
        title: 'Efficiency',
        dataIndex: 'efficiency',
    },
    {
        title: 'Grid Freq. (Hz)',
        dataIndex: 'grid_freq',
    },
    {
        title: 'Efficiency',
        dataIndex: 'efficiency',
    },
    {
        title: 'Production Today (kWh)',
        dataIndex: 'production_today',
    },
    {
        title: 'Yield Today (h)',
        dataIndex: 'yield_today',
    },

];
    const defaultCheckedList = columns.map((item) => item.dataIndex);
    console.log("defaultCheckedList")
    console.log(defaultCheckedList)
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const options = columns.map(({ dataIndex, title }) => ({
        label: title,
        value: dataIndex,
    }));
    const newColumns = columns.map((item) => ({
        ...item,
        hidden: !checkedList.includes(item.dataIndex),
    }));
    const [bordered, setBordered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState('large');
    const [showTitle, setShowTitle] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [showFooter, setShowFooter] = useState(true);
    const [rowSelection, setRowSelection] = useState({});
    const [hasData, setHasData] = useState(true);
    const [tableLayout, setTableLayout] = useState();
    const [top, setTop] = useState('none');
    const [bottom, setBottom] = useState('bottomRight');
    const [ellipsis, setEllipsis] = useState(false);
    const [yScroll, setYScroll] = useState(false);
    const [xScroll, setXScroll] = useState();
    const handleBorderChange = (enable) => {
        setBordered(enable);
    };
    const handleLoadingChange = (enable) => {
        setLoading(enable);
    };
    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const handleTableLayoutChange = (e) => {
        setTableLayout(e.target.value);
    };

    const handleEllipsisChange = (enable) => {
        setEllipsis(enable);
    };
    const handleTitleChange = (enable) => {
        setShowTitle(enable);
    };
    const handleHeaderChange = (enable) => {
        setShowHeader(enable);
    };
    const handleFooterChange = (enable) => {
        setShowFooter(enable);
    };
    const handleRowSelectionChange = (enable) => {
        setRowSelection(enable ? {} : undefined);
    };
    const handleYScrollChange = (enable) => {
        setYScroll(enable);
    };
    const handleXScrollChange = (e) => {
        setXScroll(e.target.value);
    };
    const handleDataChange = (newHasData) => {
        setHasData(newHasData);
    };
    const scroll = {};
    if (yScroll) {
        scroll.y = 240;
    }
    if (xScroll) {
        scroll.x = '100vw';
    }
    const tableColumns = columns.map((item) => ({
        ...item,
        ellipsis,
    }));
    if (xScroll === 'fixed') {
        tableColumns[0].fixed = true;
        tableColumns[tableColumns.length - 1].fixed = 'right';
    }
    const tableProps = {
        bordered,
        loading,
        size,
        title: showTitle ? defaultTitle : undefined,
        showHeader,
        footer: showFooter ? defaultFooter : undefined,
        rowSelection,
        scroll,
        tableLayout,
    };
    return (
        <>
            <Checkbox.Group
                value={checkedList}
                options={options}
                onChange={(value) => {
                    setCheckedList(value);
                }}
            />
            <Form
                layout="inline"
                className="components-table-demo-control-bar"
                style={{
                    marginBottom: 16,
                }}
            >
                <Form.Item label="Bordered">
                    <Switch checked={bordered} onChange={handleBorderChange} />
                </Form.Item>
                <Form.Item label="loading">
                    <Switch checked={loading} onChange={handleLoadingChange} />
                </Form.Item>
                <Form.Item label="Title">
                    <Switch checked={showTitle} onChange={handleTitleChange} />
                </Form.Item>
                <Form.Item label="Column Header">
                    <Switch checked={showHeader} onChange={handleHeaderChange} />
                </Form.Item>
                <Form.Item label="Footer">
                    <Switch checked={showFooter} onChange={handleFooterChange} />
                </Form.Item>


                <Form.Item label="Checkbox">
                    <Switch checked={!!rowSelection} onChange={handleRowSelectionChange} />
                </Form.Item>
                <Form.Item label="Fixed Header">
                    <Switch checked={!!yScroll} onChange={handleYScrollChange} />
                </Form.Item>
                <Form.Item label="Has Data">
                    <Switch checked={!!hasData} onChange={handleDataChange} />
                </Form.Item>
                <Form.Item label="Ellipsis">
                    <Switch checked={!!ellipsis} onChange={handleEllipsisChange} />
                </Form.Item>
                <Form.Item label="Size">
                    <Radio.Group value={size} onChange={handleSizeChange}>
                        <Radio.Button value="large">Large</Radio.Button>
                        <Radio.Button value="middle">Middle</Radio.Button>
                        <Radio.Button value="small">Small</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Table Scroll">
                    <Radio.Group value={xScroll} onChange={handleXScrollChange}>
                        <Radio.Button value={undefined}>Unset</Radio.Button>
                        <Radio.Button value="scroll">Scroll</Radio.Button>
                        <Radio.Button value="fixed">Fixed Columns</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Table Layout">
                    <Radio.Group value={tableLayout} onChange={handleTableLayoutChange}>
                        <Radio.Button value={undefined}>Unset</Radio.Button>
                        <Radio.Button value="fixed">Fixed</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Pagination Top">
                    <Radio.Group
                        value={top}
                        onChange={(e) => {
                            setTop(e.target.value);
                        }}
                    >
                        <Radio.Button value="topLeft">TopLeft</Radio.Button>
                        <Radio.Button value="topCenter">TopCenter</Radio.Button>
                        <Radio.Button value="topRight">TopRight</Radio.Button>
                        <Radio.Button value="none">None</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Pagination Bottom">
                    <Radio.Group
                        value={bottom}
                        onChange={(e) => {
                            setBottom(e.target.value);
                        }}
                    >
                        <Radio.Button value="bottomLeft">BottomLeft</Radio.Button>
                        <Radio.Button value="bottomCenter">BottomCenter</Radio.Button>
                        <Radio.Button value="bottomRight">BottomRight</Radio.Button>
                        <Radio.Button value="none">None</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
            <Table
                {...tableProps}
                pagination={{
                    position: [top, bottom],
                }}
                columns={tableColumns}
                dataSource={hasData ? data : []}
                scroll={scroll}
            />
        </>
    );
};
export default LVDeviceList;