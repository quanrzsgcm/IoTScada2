import React, { Component, useState } from 'react';
import { Checkbox, Divider } from 'antd';

const CheckboxGroup = Checkbox.Group;

const ElectricalParameterCheckbox = ( {setdefaultCheckedList, plainOptions, defaultCheckedList} ) => {
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
    const onChange = (list) => {
        setCheckedList(list);
        setdefaultCheckedList(list);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
    };
    return (
        <>
            <div>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                    All
                </Checkbox>
            </div>
            <div>
                <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
            </div>
        </>
    );
};
export default ElectricalParameterCheckbox;