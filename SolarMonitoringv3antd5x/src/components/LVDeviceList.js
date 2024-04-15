import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Checkbox, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import '../assets/styles/customscrollbar2.css'

const data = [];
for (let i = 0; i < 100; i++) {
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
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const columns = [
        {
            title: 'Inverter Name',
            dataIndex: 'name',
            width: 100,
            fixed: 'left',
            // Add filterDropdown and filterIcon for search box
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
            (
                <div style={{ padding: 8 }}>
                    <Input
                        id="search-input"
                        placeholder={`Search Inverter Name`}
                        value={selectedKeys[0]}
                        // onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, 'name')}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, 'name')}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => document.getElementById('search-input').select(), 100);
                }
            },
            render: (text) => searchedColumn === 'name' ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : text,
        },
        {
            title: 'Label',
            dataIndex: 'label',
            width: 100,
            fixed: 'left',
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
            sorter: (a, b) => a.meter_read_total_energy - b.meter_read_total_energy,
        },
        {
            title: 'Active Power(kW)',
            dataIndex: 'active_power',
            sorter: (a, b) => a.active_power - b.active_power,
        },
        {
            title: 'Input Power(kW)',
            dataIndex: 'input_power',
            sorter: (a, b) => a.input_power - b.input_power,
        },
        {
            title: 'Efficiency',
            dataIndex: 'efficiency',
            sorter: (a, b) => a.efficiency - b.efficiency,
        },
        {
            title: 'Grid Freq. (Hz)',
            dataIndex: 'grid_freq',
            sorter: (a, b) => a.grid_freq - b.grid_freq,
        },
        {
            title: 'Production Today (kWh)',
            dataIndex: 'production_today',
            sorter: (a, b) => a.production_today - b.production_today,
        },
        {
            title: 'Yield Today (h)',
            dataIndex: 'yield_today',
            sorter: (a, b) => a.yield_today - b.yield_today,
        },

    ];

    const defaultCheckedList = columns.map((item) => item.dataIndex);
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
    

    return (
        <>          
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* // i want to create another input, but it actually use filterDropdown to function */}
            {/* <Input
                    placeholder="Search Inverter Name"
                    style={{ width: 200, marginRight: 8 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onPressEnter={() => handleSearch([searchText], () => {}, 'name')}
                />
                <Button type="primary" onClick={() => handleSearch([searchText], () => {}, 'name')}>
                    Search
                </Button>
                <Button onClick={() => handleReset(() => {})}>Reset</Button>
                <span> Action level: </span>
                <Input placeholder="2" style={{width: 100, marginRight: 8 }} />
                <Input placeholder="3" style={{width: 100, marginRight: 8 }}/>
            </div> */}

            <Input
                id="search-input"
                placeholder={`Search Inverter Name`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={() => handleSearch(searchText, () => { }, 'name')}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(searchText, () => { }, 'name')}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button onClick={() => handleReset(() => { })} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </Space>
            <Table style={{ marginTop: '100px', width: '100%' }}
                pagination={{
                    position: [top, bottom],
                }}
                columns={newColumns}
                dataSource={hasData ? data : []}
                scroll={{ x: 'max-content',}}
            />
        </>
    );
};
export default LVDeviceList;