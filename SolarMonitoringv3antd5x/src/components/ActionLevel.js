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
      icon: selectedOptions.includes(sourceitems.key) ? <MdOutlineCheckBox style={{ fontSize: '20px', color: 'blue' }} /> : <MdOutlineCheckBoxOutlineBlank style={{ fontSize: '20px', color: 'blue' }} />
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
            defaultHoverBg: '#043b3e'
          },
          Dropdown: {
            colorBgElevated: "black",
            controlItemBgHover: 'rgb(2,36,46)',
            controlItemBgActive: 'red',
            colorText: 'white'
          },
        },
      }}  >

      <Dropdown menu={menuProps} trigger={['click']} >
        <Button >
          <Space>
            Select
            <DownOutlined color="red" />
          </Space>
        </Button>
      </Dropdown>

    </ConfigProvider>
  );
};

export default CheckboxDropdown;
