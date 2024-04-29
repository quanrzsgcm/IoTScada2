import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Checkbox, Input, Button, Tooltip, ConfigProvider, Dropdown } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import '../assets/styles/LVDeviceList.scss'
import DeviceStateRadio from './devicestateradiobutton';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import CheckboxDropdown from './ActionLevel';
import ExportCSVButton from './ExportCSVButton';

const { Search } = Input;

const datastate = [
    { name: 'inverter 1', stage: 'noCom' },
    { name: 'inverter 2', stage: 'nonOperative' },
    { name: 'inverter 3', stage: 'fullCapability' }
];

const inverterState = ['noCom', 'connectionFail', 'nonOperative', 'fullCapability', 'nightState'];
///////////////////////    1          2                 3               4                5

// Initialize an object to store the counts for each stage
const stageCounts = {};

// Initialize counts for each stage to 0
inverterState.forEach(stage => {
    stageCounts[stage] = 0;
});

// Iterate over the data array and count the number of inverters in each stage
datastate.forEach(inverter => {
    const stage = inverter.stage;
    if (stageCounts.hasOwnProperty(stage)) {
        stageCounts[stage]++;
    }
});

console.log(stageCounts);

// const data = [
//     {
//         "key": "0",
//         "name": "FULUH_Canteen 1_Inverter 1",
//         "label": "Label 1",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:00:00",
//         "stage_duration": "23",
//         "meter_read_total_energy": "287.13714335272255",
//         "active_power": "50.76452734134318",
//         "input_power": "89.6979114893524",
//         "efficiency": "64.26132623293601",
//         "grid_freq": "20.844591384868913",
//         "production_today": "71.43776763925658",
//         "yield_today": "18.05614809608434"
//     },
//     {
//         "key": "1",
//         "name": "FULUH_Canteen 1_Inverter 2",
//         "label": "Label 2",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:01:00",
//         "stage_duration": "8",
//         "meter_read_total_energy": "311.9361207236964",
//         "active_power": "64.44719667134531",
//         "input_power": "50.78728688615088",
//         "efficiency": "7.844760404781348",
//         "grid_freq": "37.56943854589898",
//         "production_today": "36.13321673454226",
//         "yield_today": "20.432911335168257"
//     },
//     {
//         "key": "2",
//         "name": "FULUH_Canteen 1_Inverter 3",
//         "label": "Label 3",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:02:00",
//         "stage_duration": "3",
//         "meter_read_total_energy": "570.2225488284294",
//         "active_power": "62.987078334865565",
//         "input_power": "25.04553128253686",
//         "efficiency": "11.47885305114733",
//         "grid_freq": "13.612270860505792",
//         "production_today": "82.37855385913619",
//         "yield_today": "16.975817776020303"
//     },
//     {
//         "key": "3",
//         "name": "FULUH_Canteen 1_Inverter 4",
//         "label": "Label 4",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:03:00",
//         "stage_duration": "0",
//         "meter_read_total_energy": "255.87725472218926",
//         "active_power": "87.1526072919285",
//         "input_power": "33.1958030536059",
//         "efficiency": "52.9167777190489",
//         "grid_freq": "41.98545726068942",
//         "production_today": "48.32146539833122",
//         "yield_today": "22.86301869873713"
//     },
//     {
//         "key": "4",
//         "name": "FULUH_Canteen 1_Inverter 5",
//         "label": "Label 5",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:04:00",
//         "stage_duration": "2",
//         "meter_read_total_energy": "200.0264947233048",
//         "active_power": "14.06072428002869",
//         "input_power": "17.95677231604578",
//         "efficiency": "96.12811766864024",
//         "grid_freq": "7.502217178914785",
//         "production_today": "80.04320985594062",
//         "yield_today": "2.7512510609115637"
//     },
//     {
//         "key": "5",
//         "name": "FULUH_Canteen 2_Inverter 1",
//         "label": "Label 6",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:05:00",
//         "stage_duration": "3",
//         "meter_read_total_energy": "27.50304306693141",
//         "active_power": "39.73450994261758",
//         "input_power": "13.702502923521243",
//         "efficiency": "3.3489621358283594",
//         "grid_freq": "7.0164099636581145",
//         "production_today": "51.55444846163802",
//         "yield_today": "3.5487749108458093"
//     },
//     {
//         "key": "6",
//         "name": "FULUH_Canteen 4_Inverter 1",
//         "label": "Label 7",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:06:00",
//         "stage_duration": "2",
//         "meter_read_total_energy": "972.1692556470332",
//         "active_power": "57.76990045158006",
//         "input_power": "52.82895472952238",
//         "efficiency": "86.82604779600422",
//         "grid_freq": "12.305169794162833",
//         "production_today": "95.23247597047377",
//         "yield_today": "13.357238633845874"
//     },
//     {
//         "key": "7",
//         "name": "FULUH_Canteen 4_Inverter 2",
//         "label": "Label 8",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:07:00",
//         "stage_duration": "9",
//         "meter_read_total_energy": "407.6020566051113",
//         "active_power": "63.18680835911743",
//         "input_power": "67.2729301115572",
//         "efficiency": "20.825293317819572",
//         "grid_freq": "56.99161588130671",
//         "production_today": "78.60380482228757",
//         "yield_today": "21.17770631570356"
//     },
//     {
//         "key": "8",
//         "name": "FULUH_Canteen 4_Inverter 3",
//         "label": "Label 9",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:08:00",
//         "stage_duration": "20",
//         "meter_read_total_energy": "817.4440755019083",
//         "active_power": "74.6081675550309",
//         "input_power": "35.50772915429627",
//         "efficiency": "39.69897635834065",
//         "grid_freq": "21.52161163962465",
//         "production_today": "57.19039049474597",
//         "yield_today": "2.6953034365652826"
//     },
//     {
//         "key": "9",
//         "name": "FULUH_Parking Lot 1_Inverter 1",
//         "label": "Label 10",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:09:00",
//         "stage_duration": "17",
//         "meter_read_total_energy": "13.142424695318011",
//         "active_power": "3.6789024227126044",
//         "input_power": "33.92383292923251",
//         "efficiency": "47.79477295991536",
//         "grid_freq": "40.39060952635182",
//         "production_today": "86.53016144155177",
//         "yield_today": "19.67329967057831"
//     },
//     {
//         "key": "10",
//         "name": "FULUH_Parking Lot 1_Inverter 2",
//         "label": "Label 11",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:10:00",
//         "stage_duration": "23",
//         "meter_read_total_energy": "415.36834931952325",
//         "active_power": "12.091297522826139",
//         "input_power": "9.994488079329544",
//         "efficiency": "43.2452489543583",
//         "grid_freq": "23.09021533398194",
//         "production_today": "14.471473230077446",
//         "yield_today": "23.99236026841392"
//     },
//     {
//         "key": "11",
//         "name": "FULUH_Parking Lot 1_Inverter 3",
//         "label": "Label 12",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:11:00",
//         "stage_duration": "4",
//         "meter_read_total_energy": "694.0971014875661",
//         "active_power": "89.9102020224873",
//         "input_power": "87.01662464750997",
//         "efficiency": "66.38678988012481",
//         "grid_freq": "10.62597050517149",
//         "production_today": "3.443772180970095",
//         "yield_today": "8.418913323008649"
//     },
//     {
//         "key": "12",
//         "name": "Inverter 13",
//         "label": "Label 13",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:12:00",
//         "stage_duration": "17",
//         "meter_read_total_energy": "892.8974870331465",
//         "active_power": "79.6951482752934",
//         "input_power": "4.632844184714502",
//         "efficiency": "57.91765840797618",
//         "grid_freq": "12.87520166861285",
//         "production_today": "4.259653775812899",
//         "yield_today": "19.046625038202237"
//     },
//     {
//         "key": "13",
//         "name": "Inverter 14",
//         "label": "Label 14",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:13:00",
//         "stage_duration": "3",
//         "meter_read_total_energy": "480.87007714861716",
//         "active_power": "26.532579759258734",
//         "input_power": "37.73479873486123",
//         "efficiency": "53.05869153837535",
//         "grid_freq": "23.29157721748065",
//         "production_today": "77.71899859681656",
//         "yield_today": "20.657225062264374"
//     },
//     {
//         "key": "14",
//         "name": "Inverter 15",
//         "label": "Label 15",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:14:00",
//         "stage_duration": "17",
//         "meter_read_total_energy": "165.22422856528362",
//         "active_power": "58.70820297940003",
//         "input_power": "41.201720642592285",
//         "efficiency": "47.957402745638774",
//         "grid_freq": "19.662138829400195",
//         "production_today": "87.75210126845153",
//         "yield_today": "7.634848261533184"
//     },
//     {
//         "key": "15",
//         "name": "Inverter 16",
//         "label": "Label 16",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:15:00",
//         "stage_duration": "2",
//         "meter_read_total_energy": "392.88792089239763",
//         "active_power": "36.57967002622333",
//         "input_power": "47.01309508710365",
//         "efficiency": "3.579606713838124",
//         "grid_freq": "25.695985168735124",
//         "production_today": "33.26907388986508",
//         "yield_today": "19.856022603133596"
//     },
//     {
//         "key": "16",
//         "name": "Inverter 17",
//         "label": "Label 17",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:16:00",
//         "stage_duration": "16",
//         "meter_read_total_energy": "83.1771446560683",
//         "active_power": "84.67732057964142",
//         "input_power": "26.18263431546948",
//         "efficiency": "11.91596413270808",
//         "grid_freq": "48.93517650566073",
//         "production_today": "13.262294964903877",
//         "yield_today": "6.747106687239674"
//     },
//     {
//         "key": "17",
//         "name": "Inverter 18",
//         "label": "Label 18",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:17:00",
//         "stage_duration": "0",
//         "meter_read_total_energy": "252.70963456659956",
//         "active_power": "77.01805295620812",
//         "input_power": "37.61770603422874",
//         "efficiency": "10.664996419397",
//         "grid_freq": "47.85436903626377",
//         "production_today": "18.204045015325487",
//         "yield_today": "14.541977334769038"
//     },
//     {
//         "key": "18",
//         "name": "Inverter 19",
//         "label": "Label 19",
//         "stage": "Running",
//         "stage_start_on": "2024-04-13T12:18:00",
//         "stage_duration": "23",
//         "meter_read_total_energy": "276.2259418346946",
//         "active_power": "91.33977107540365",
//         "input_power": "45.78568759982093",
//         "efficiency": "67.21761454564832",
//         "grid_freq": "51.21023664312449",
//         "production_today": "78.58193811404",
//         "yield_today": "12.661352861862687"
//     },
//     {
//         "key": "19",
//         "name": "Inverter 20",
//         "label": "Label 20",
//         "stage": "Init",
//         "stage_start_on": "2024-04-13T12:19:00",
//         "stage_duration": "10",
//         "meter_read_total_energy": "663.7605860625753",
//         "active_power": "69.44461362643028",
//         "input_power": "43.23225573310958",
//         "efficiency": "25.929625194631466",
//         "grid_freq": "2.8692493105051575",
//         "production_today": "83.93278832133389",
//         "yield_today": "0.04609066194748834"
//     }
// ];


// for (let i = 0; i < 20; i++) {
//     const record = {
//         key: i.toString(),
//         name: `Inverter ${i + 1}`,
//         label: `Label ${i + 1}`,
//         stage: i % 2 === 0 ? 'Running' : 'Init',
//         stage_start_on: `2024-04-13T12:${i < 10 ? '0' + i : i}:00`,
//         stage_duration: `${Math.floor(Math.random() * 24)}`, // Random duration between 0 and 24 hours
//         meter_read_total_energy: `${Math.random() * 1000}`, // Random total energy value
//         active_power: `${Math.random() * 100}`, // Random active power value
//         input_power: `${Math.random() * 100}`, // Random input power value
//         efficiency: `${Math.random() * 100}`, // Random efficiency value
//         grid_freq: `${Math.random() * 60}`, // Random grid frequency value
//         production_today: `${Math.random() * 100}`, // Random production today value
//         yield_today: `${Math.random() * 24}`, // Random yield today value
//     };
//     data.push(record);
// }
// console.log(data);

const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';

const LVDeviceList = ({setSelectedThing}) => {

    const [fetchedData, setFetchedData] = useState(null); // Initialize state variable with null

    // Test fetching directly into Ditto (in production must fetch via Backend)
    const username = "ditto";
    const password = "ditto";

    const basicAuth = btoa(`${username}:${password}`);
    console.log(basicAuth)
    console.log("renreder")


    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = () => {
            fetch('http://localhost:8080/api/2/search/things?namespaces=my.inverter&option=size(5)', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched data:', data);

                    const flattenedData = data.items.map(item => {
                        return {
                            thingId: item.thingId,
                            name: item.attributes.name,
                            labels: item.features.label.properties.labels,
                            stage: item.features.runningstatus.properties.stage,
                            stageStartOn: item.features.runningstatus.properties.stageStartOn
                        };
                    });

                    // Update the state with the flattened data
                    setFetchedData(flattenedData);
                    console.log(flattenedData);

                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        // Call fetchData initially
        fetchData();

        // Set interval to call fetchData every 10 seconds
        const interval = setInterval(fetchData, 15000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array means this effect runs once after the initial render
    
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    const [activeSearch, setActiveSearch] = useState(false); // Initialize activeSearch as false


    const [searchResults, setSearchResults] = useState(fetchedData);
    useEffect(() => {
        if (!activeSearch) { // Assuming activeSearch is a boolean state indicating whether there's an active search
            setSearchResults(fetchedData);
        }
    }, [fetchedData, activeSearch]);


    const handleSearch = (value) => {
        setActiveSearch(true); // Set activeSearch to true when search is initiated
        const filteredResults = fetchedData.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        setSearchResults(filteredResults);
        console.log(filteredResults);
        if (value === "") { // Check for an empty string
            setActiveSearch(false);
        }
    };


    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');


    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const columns = [
        {
            title: 'Inverter Name',
            dataIndex: 'name',
            width: 200,
            fixed: 'left',
            // Add filterDropdown and filterIcon for search box
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
            // (
            //     <div style={{ padding: 8 }}>
            //         <Input
            //             id="search-input"
            //             placeholder={`Search Inverter Name`}
            //             value={selectedKeys[0]}
            //             // onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            //             onChange={(e) => {
            //                 setSelectedKeys(e.target.value ? [e.target.value] : []);
            //             }}
            //             onPressEnter={() => handleSearch(selectedKeys, confirm, 'name')}
            //             style={{ width: 188, marginBottom: 8, display: 'block' }}
            //         />
            //         <Space>
            //             <Button
            //                 type="primary"
            //                 onClick={() => handleSearch(selectedKeys, confirm, 'name')}
            //                 icon={<SearchOutlined />}
            //                 size="small"
            //                 style={{ width: 90 }}
            //             >
            //                 Search
            //             </Button>
            //             <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            //                 Reset
            //             </Button>
            //         </Space>
            //     </div>
            // ),
            // filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            // onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
            // onFilterDropdownVisibleChange: (visible) => {
            //     if (visible) {
            //         setTimeout(() => document.getElementById('search-input').select(), 100);
            //     }
            // },
            // render: (text) => searchedColumn === 'name' ? (
            //     <Highlighter
            //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            //         searchWords={[searchText]}
            //         autoEscape
            //         textToHighlight={text.toString()}
            //     />
            // ) : text,


            render: function (text, record, index) {
                const backgroundColor = index % 2 === 0 ? 'rgb(12,62,82)' : 'rgb(12,55,70)';

                return {
                    props: {
                        style: { background: backgroundColor }
                    },
                    children: <div>{text}</div>
                };
            }


        },
        {
            title: 'Label',
            dataIndex: 'labels',
            width: 100,
            fixed: 'left',
            className: 'custom-column',
            render: function (text, record, index) {
                const backgroundColor = index % 2 === 0 ? 'rgb(12,62,82)' : 'rgb(12,55,70)';

                return {
                    props: {
                        style: { background: backgroundColor }
                    },
                    children: <div>{text}</div>
                };
            }
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
            dataIndex: 'stageStartOn',
        },
        {
            title: 'Stage duration (h)',
            dataIndex: 'stage_duration ',
        },
        {
            title: 'Meter-read Total Energy',
            dataIndex: 'meter_read_total_energy',
            sorter: (a, b) => a.meter_read_total_energy - b.meter_read_total_energy,
            className: 'numeric-data'
        },
        {
            title: 'Active Power(kW)',
            dataIndex: 'active_power',
            sorter: (a, b) => a.active_power - b.active_power,
            className: 'numeric-data'
        },
        {
            title: 'Input Power(kW)',
            dataIndex: 'input_power',
            sorter: (a, b) => a.input_power - b.input_power,
            className: 'numeric-data'
        },
        {
            title: 'Efficiency',
            dataIndex: 'efficiency',
            sorter: (a, b) => a.efficiency - b.efficiency,
            className: 'numeric-data'
        },
        {
            title: 'Grid Freq. (Hz)',
            dataIndex: 'grid_freq',
            sorter: (a, b) => a.grid_freq - b.grid_freq,
            className: 'numeric-data'
        },
        {
            title: 'Production Today (kWh)',
            dataIndex: 'production_today',
            sorter: (a, b) => a.production_today - b.production_today,
            className: 'numeric-data'
        },
        {
            title: 'Yield Today (h)',
            dataIndex: 'yield_today',
            sorter: (a, b) => a.yield_today - b.yield_today,
            className: 'numeric-data'
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
        width: 'auto',

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
            <div style={{ width: '100%', height: '45px', border: '1px solid #000', display: 'flex' }}>
                <div style={{ flex: '9', borderRight: '1px solid #000', display: 'flex', alignItems: 'center' }}>
                    <DeviceStateRadio />
                </div>
                <div style={{ flex: '1' }}>
                    {/* Content for the second div (takes 1/10 of the parent's width) */}
                </div>
            </div>
            <div style={{ width: '100%', height: '45px', border: '1px solid #000', display: 'flex' }}>
                <div style={{ flex: '9', borderRight: '1px solid #000', display: 'flex', alignItems: 'center' }}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    colorBgContainer: 'rgb(6,73,77)',
                                    colorBorder: 'rgb(3,151,184)',
                                    colorText: 'white',
                                    colorTextPlaceholder: 'rgb(104,146,136)',
                                    borderRadius: 0,
                                },
                            },
                        }}
                    >
                        <Input
                            style={{ width: 300 }}
                            placeholder="Search by interver name"
                            onPressEnter={(e) => handleSearch(e.target.value)}

                            suffix={
                                <Tooltip title="Search">
                                    <span
                                        onClick={() => handleSearch(document.querySelector('.ant-input').value)}
                                        style={{
                                            cursor: 'pointer',
                                            color: 'rgb(3,151,184)',
                                            marginRight: 5,
                                        }}
                                    >
                                        <SearchOutlined />
                                    </span>
                                </Tooltip>
                            }
                        />
                    </ConfigProvider>
                    <span>Action Level:</span>
                    <CheckboxDropdown />



                </div>
                <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* <ExportCSVButton data={fetchedData} /> */}
                </div>
            </div>

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            borderColor: 'transparent',
                            bodySortBg: 'transparent',
                            cellFontSize: 14,
                            cellPaddingBlock: 8,
                            // headerBg: "linear-gradient(to right, #05323e, #053e4d)",
                            headerBorderRadius: 0,
                            headerSplitColor: "rgba(0,0,0,0)",
                            colorBgContainer: 'transparent',
                            colorText: "white",
                            colorTextHeading: "rgb(154,175,157)",
                            //     headerSortHoverBg: "linear-gradient(to right, #05323e, #053e4d)",
                            //     headerSortActiveBg: "linear-gradient(to right, #05323e, #053e4d)",
                            //     // stickyScrollBarBg: "rgba(255,255,255,0.7)",
                            //     // stickyScrollBarBorderRadius: 100,
                        },
                    },
                }}
            >
                <Table style={{ marginTop: '10px', width: '100%' }}
                    pagination={{
                        position: [top, bottom],
                    }}
                    columns={newColumns}
                    rowClassName={(record, index) => {
                        if (index % 2 === 0) {
                            return 'even-row'; // Apply a class for even rows
                        } else {
                            return 'odd-row'; // Apply a class for odd rows
                        }
                    }}
                    dataSource={hasData ? searchResults : []}

                    scroll={{ x: 'max-content', }}
                    onRow={(record, rowIndex) => ({
                        onClick: () => {
                            setSelectedRowIndex(rowIndex);
                            console.log('record ' + record.thingId);
                            setSelectedThing(record.thingId);
                        }
                    })}
                />
            </ConfigProvider>


        </>
    );
};
export default LVDeviceList;