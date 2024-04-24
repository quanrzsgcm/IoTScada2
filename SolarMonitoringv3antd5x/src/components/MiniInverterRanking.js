import React, { useEffect, useState } from 'react';
import '../assets/styles/MiniList.scss';

const ScrollableDiv = ({ data }) => {
  console.log(data)
  const [sortedData, setSortedData] = useState([...data]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Function to sort data based on yield
  const sortData = (order) => {
    const sorted = [...sortedData].sort((a, b) => {
      const yieldA = parseFloat(a.yield);
      const yieldB = parseFloat(b.yield);
      return order === 'asc' ? yieldA - yieldB : yieldB - yieldA;
    });
    setSortedData(sorted);
    setSortOrder(order);
  };

  useEffect(() => {
    sortData('desc'); // Call sortData only once when component mounts
  }, []); // Empty dependency array ensures this effect runs only once


  // Find the maximum yield
  const maxYield = Math.max(...sortedData.map(item => parseFloat(item.yield)));

  return (
    <div className="scrollable-div">
      {/* <div className="sort-buttons">
        <button onClick={() => sortData('asc')}>Sort Ascending</button>
        <button onClick={() => sortData('desc')}>Sort Descending</button>
      </div> */}
      {sortedData.map((item, index) => (
        <div key={index} className="element">
          <div style={{ color: 'rgb(102,119,141)', fontSize: '14px',}}>{`${item.inverter}`}</div>
          <div className="progress-bar">
            <span
              className="progress"
              style={{ width: `${(parseFloat(item.yield) / maxYield) * 80}%` }} />
            <span style={{ marginLeft: '10px', color: 'rgb(0,204,255)', fontSize: '14px' }}>{`${item.yield}`}</span>
          </div>
        </div>



      ))}
    </div>
  );
};

export default ScrollableDiv;
{/* <span style={{ marginLeft: '5px', color: 'rgb(102,119,141)', fontSize: '14px' }}>{item.yield}</span> */ }