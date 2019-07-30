import React from 'react';
import { Dropdown, Radio } from 'semantic-ui-react';
import defaults from '../../config/defaults';
import CSVExportButton from '../CSVExportButton';
import './style.css';


const DataSelector = props =>
    
    <div style={{width: '100%'}}>
        { defaults.categoryOptions ? 
            <Dropdown 
                style={{
                    float: 'left',
                        margin: '10px',
                        width: '15%',
                        height:'50px',
                        zIndex: '999'
                }} 
                id='cat-selector' 
                value={props.serviceID} 
                onChange={(event, data) => {
                    event.preventDefault()
                    // console.log(data);
                    const optionObject = data.options.find(option =>
                        option.value === data.value)
                    props.setServiceID(optionObject.value)
                }} 
                placeholder='Select Data Category' 
                selection 
                options={defaults.categoryOptions}
            />
            : null }
        { props.sumLevel ? 
            <Dropdown 
                selection 
                style={{ 
                    float: 'left', 
                    margin: '10px', 
                    height:'50px', 
                    width: '15%', 
                    zIndex: '998'
                }} 
                id='geo-selector' 
                value={props.sumLevel} 
                onChange={(event, data) => props.setSumLevel(data.value)} 
                placeholder='Select Geography' 
                options={defaults.geoOptions}
            />
            : null }
        { props.data && props.selectedFields ?
            <CSVExportButton
                // {...props}
                data={props.data}
                selectedFields={props.selectedFields}
                text='CSV'
                color='teal'
                basic='true'
                // margin= <= default set to '10px'
            />
            : null }
        { props.fieldOptions ? 
        <Radio 
            toggle
            checked={props.MOE ? true : false} 
            style={{
                float: 'right',
                marginTop: '10px'
            }} 
            label={'MOE'}
            // onClick={event => console.log(props.MOE)}
            onClick={() => props.handleOptionsArray(props.data, props.serviceID, 
                props.MOE ? false : true)}
        /> 
        : null}

        { props.fieldOptions ? 
            <Dropdown
                multiple search selection 
                style={{ 
                    float: 'right', 
                    margin: '10px', 
                    width: '45%', 
                    height: '80%', 
                    zIndex: '999'
                }} 
                id='field-selector' 
                value={props.selectedFields} 
                onChange={(event, data) => props.setSelectedFields(data.value)} 
                placeholder='Select Fields' 
                options={props.fieldOptions}
                onLabelClick={(event, data) => props.setPrimaryField(data.value)}
            />
            : null }
    </div>


export default DataSelector; 