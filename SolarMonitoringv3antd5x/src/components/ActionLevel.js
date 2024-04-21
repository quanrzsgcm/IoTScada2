import { Dropdown, Checkbox, Button, message, ConfigProvider, Space } from 'antd';
import { DownOutlined, CheckSquareOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { GrCheckbox } from "react-icons/gr";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";

const CheckboxDropdown = ({ }) => {
  const sourceitems = [
    {
      label: 'No Label',
      key: '1',
    },
    {
      label: 'Pay attention',
      key: '2',
    },
    {
      label: 'Take action',
      key: '3',
    }
  ]

  const [selectedOptions, setSelectedOptions] = useState(['1']);


  const handleOptionsChange = (checkedValues) => {
    const index = selectedOptions.indexOf(checkedValues);
    if (index === -1) {
      // Key is not present, add it
      setSelectedOptions([...selectedOptions, checkedValues]);
    } else {
      // Key is present, remove it
      const updatedOptions = [...selectedOptions];
      updatedOptions.splice(index, 1);
      setSelectedOptions(updatedOptions);
    }
  };

  const handleMenuClick = (e) => {
    message.info('Click on menu item.' + e.key);
    handleOptionsChange(e.key);
  };

  const menuProps = {
    items: sourceitems.map(sourceitems => ({
      ...sourceitems,
      icon: selectedOptions.includes(sourceitems.key) ? <MdOutlineCheckBox style={{ fontSize: '20px', color: 'rgb(0,204,255)' }} /> : <MdOutlineCheckBoxOutlineBlank style={{ fontSize: '20px', color: 'rgb(0,204,255)' }} />
    })),
    onClick: handleMenuClick,
  };



  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: '#043b3e',
            defaultBorderColor: '#009bc4',
            borderRadius: '0px',
            defaultHoverBg: '#043b3e',
            colorText: 'rgb(117,117,117)',
            defaultHoverBorderColor: 'rgb(0,204,255)',
            defaultHoverColor: 'rgb(0,204,255)'
          },
          Dropdown: {
            colorBgElevated: "black",
            controlItemBgHover: 'rgb(2,36,46)',
            controlItemBgActive: 'red',
            colorText: 'white',
            borderRadiusLG: 0,
            colorPrimary: 'red',
            colorPrimaryBorder: 'red',
            colorSplit: 'red',
          },
        },
      }}  >

      <Dropdown menu={menuProps} trigger={['click']} overlayStyle={{
        width: '160px',
        border: '1px solid rgb(0,204,255)',
        // Add any additional styles as needed
      }} >
        <Button style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '160px', 
          textAlign: 'left',
        }}>
       
          <span>Select</span>
          <span style={{ marginLeft: 'auto' }}><DownOutlined color="red" /></span>
            
       
        </Button>
      </Dropdown>

    </ConfigProvider>
  );
};

export default CheckboxDropdown;
