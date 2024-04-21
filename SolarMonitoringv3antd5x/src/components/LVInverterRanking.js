import React from 'react';
import { Table, ConfigProvider } from 'antd';
import '../assets/styles/customscrollbar.scss'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text, record ) => <a href={`http://localhost:3000/site-monitor/${record.key}`} style={{ textDecoration: 'none', color: '#06cdff' }}>{text}</a>,

  },
  {
    title: 'Yield',
    dataIndex: 'chinese',
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
    },
  },
  {
    title: 'Production (kWh)',
    dataIndex: 'math',
    sorter: {
      compare: (a, b) => a.math - b.math,
    },
  },
  {
    title: 'Power Ratio (%)',
    dataIndex: 'english',
    sorter: {
      compare: (a, b) => a.english - b.english,
    },
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    chinese: 98,
    math: 60,
    english: 70,
  },
  {
    key: '2',
    name: 'Jim Green',
    chinese: 98,
    math: 66,
    english: 89,
  },
  {
    key: '3',
    name: 'Joe Black',
    chinese: 98,
    math: 90,
    english: 70,
  },
  {
    key: '4',
    name: 'Jim Red',
    chinese: 88,
    math: 99,
    english: 89,
  },
  {
    key: '5',
    name: 'Alice White',
    chinese: 95,
    math: 70,
    english: 80,
  },
  {
    key: '6',
    name: 'Bob Smith',
    chinese: 92,
    math: 80,
    english: 75,
  },
  {
    key: '7',
    name: 'Emily Johnson',
    chinese: 90,
    math: 85,
    english: 82,
  },
  {
    key: '8',
    name: 'Michael Brown',
    chinese: 85,
    math: 75,
    english: 88,
  },
  {
    key: '9',
    name: 'Sarah Lee',
    chinese: 89,
    math: 95,
    english: 78,
  },
  {
    key: '10',
    name: 'David Wilson',
    chinese: 94,
    math: 88,
    english: 90,
  }
]
const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};



const InverterRanking = () => <div>  
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
        colorBgContainer: "transparent",
        colorText: "white",
        colorTextHeading: "rgb(154,175,157)",
        headerSortHoverBg: "linear-gradient(to right, #05323e, #053e4d)",
        headerSortActiveBg: "linear-gradient(to right, #05323e, #053e4d)",
        // stickyScrollBarBg: "rgba(255,255,255,0.7)",
        // stickyScrollBarBorderRadius: 100,
      },
    },
  }}
>

  <Table 
    columns={columns} 
    dataSource={data} 
    onChange={onChange}   
    rowClassName={(record, index) => {
      if (index % 2 === 0) {
        return 'even-row'; // Apply a class for even rows
      } else {
        return 'odd-row'; // Apply a class for odd rows
      }
    }}
    pagination={false} // Set the maximum number of records per page
    scroll={{ y: 200 }} // Set the vertical scroll height
    />
    </ConfigProvider>

</div>


export default InverterRanking;