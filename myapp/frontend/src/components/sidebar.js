import React, { useState } from 'react';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="sidebar">
      <div className="tab" onClick={() => handleTabClick('tab1')}>
        Tab 1
      </div>
      <div className="tab" onClick={() => handleTabClick('tab2')}>
        Tab 2
      </div>
      <div className="tab" onClick={() => handleTabClick('tab3')}>
        Tab 3
      </div>
    </div>
  );
};

const Content = ({ activeTab }) => {
  return (
    <div className="content">
      {activeTab === 'tab1' && <div>Content for Tab 1</div>}
      {activeTab === 'tab2' && <div>Content for Tab 2</div>}
      {activeTab === 'tab3' && <div>Content for Tab 3</div>}
    </div>
  );
};

const App2 = () => {
  return (
    <div className="app">
      <Sidebar />
      <Content />
    </div>
  );
};

export default App2;
