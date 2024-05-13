import React, { useEffect, useState } from 'react';
import '../assets/styles/MiniList2.scss';

const ScrollableDiv2 = ({ data }) => {
  console.log(data)
  const [sortedData, setSortedData] = useState([...data]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Function to sort data based on production
  const sortData = (order) => {
    const sorted = [...sortedData].sort((a, b) => {
      const productionA = parseFloat(a.production);
      const productionB = parseFloat(b.production);
      return order === 'asc' ? productionA - productionB : productionB - productionA;
    });
    setSortedData(sorted);
    setSortOrder(order);
  };

  useEffect(() => {
    sortData('desc'); // Call sortData only once when component mounts
  }, []); // Empty dependency array ensures this effect runs only once


  // Find the maximum production
  const maxProduction = Math.max(...sortedData.map(item => parseFloat(item.production)));

  return (
    <div className="scrollable-div2">
      {/* <div className="sort-buttons">
        <button onClick={() => sortData('asc')}>Sort Ascending</button>
        <button onClick={() => sortData('desc')}>Sort Descending</button>
      </div> */}
      {sortedData.map((item, index) => (
        <div key={index} className="element2">
          <div style={{ color: 'rgb(102,119,141)', fontSize: '14px',}}>{`${item.inverter}`}</div>
          <div className="progress-bar">
            <span
              className="progress2"
              style={{ width: `${(parseFloat(item.production) / maxProduction) * 80}%` }} />
            <span style={{ marginLeft: '10px', color: 'rgb(51,190,133)', fontSize: '14px' }}>{`${item.production}`}kWh</span>
          </div>
        </div>



      ))}
    </div>
  );
};

export default ScrollableDiv2;
{/* <span style={{ marginLeft: '5px', color: 'rgb(102,119,141)', fontSize: '14px' }}>{item.yield}</span> */ }