import React, { useEffect, useState } from 'react';
import { Button } from 'antd'

const PowerMeterDetails = ({ showState,  selectedThing, updateThing}) => {
    const [show, setShow] = useState(showState);
    const [localselectedThing, setlocalSelectedThing] = useState(selectedThing);

    useEffect(() => {
        setShow(showState);
    }, [showState]);

    useEffect(() => {
        setlocalSelectedThing(selectedThing);
        console.log("from details1", localselectedThing);
        console.log("from details2", selectedThing);
    }, [selectedThing]);


    if (show === true) {
        return (
            <div>
                <div>PowerMeterDetails</div>
                <pre>{localselectedThing}</pre>
            </div>
        )
    }
    else return null;
}

export default PowerMeterDetails