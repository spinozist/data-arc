import React, { useState, useEffect } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { Grid, Col } from 'react-flexbox-grid';
import defaults from '../../config/defaults';


const DataSelector = props => {
    
        console.log(props)

       return(
        <div style={{width: '100%'}}>
            { defaults.categoryOptions ? 
                <Dropdown 
                    style={{float: 'left', margin: '10px', width: '15%', height:'50px', zIndex: '9999'}} 
                    id='cat-selector' 
                    value={props.serviceID} 
                    onChange={(event, data) => props.setServiceID(data.value)} 
                    placeholder='Select Data Category' 
                    selection 
                    options={defaults.categoryOptions}
                />
                : null }
            { props.sumLevel ? 
                <Dropdown 
                    selection 
                    style={{ float: 'left', margin: '10px', height:'50px', width: '15%', zIndex: '9998'}} 
                    id='geo-selector' 
                    value={props.sumLevel} 
                    onChange={(event, data) => props.setSumLevel(data.value)} 
                    placeholder='Select Geography' 
                    options={defaults.geoOptions}
                />
                : null }
                    { props.data ?
                <Button
                    basic
                    color='teal'
                    className={props.csvStatus === 'ready' ? 'pulse' : null } 
                    onClick={() => props.csvStatus === 'nodata' ? 
                                props.handleCSVData(
                                    defaults.data.baseUrl, 
                                    props.serviceID, 
                                    props.sumLevel, 
                                    props.selectedFields) 
                                    : props.downloadCSV() } 
                    style={{margin: '10px', float: 'left', height: '50px'}}
                >
                    {props.csvStatus === 'nodata' ? 
                    'Create CSV' 
                    : 'Download CSV'}
                </Button>
                : null }
                {props.csvStatus === 'ready' ? 
                    <Button
                        basic
                        color='red' 
                        onClick={() => {
                            props.setCSVData()
                            props.setCSVStatus('nodata')
                        }} 
                        style={{margin: '10px', float: 'left', height: '50px'}}
                    >
                    Cancel
                    </Button>
                    : null}

            { props.fieldOptions ? 
                <Dropdown
                    multiple search selection 
                    style={{ float: 'right', margin: '10px', width: '45%', height: '80%', zIndex: '9999'}} 
                    id='field-selector' 
                    value={props.selectedFields} 
                    onChange={(event, data) => props.setSelectedFields(data.value)} 
                    placeholder='Select Fields' 
                    options={props.fieldOptions}
                    onLabelClick={(event, data) => props.setMapField(data.value)}
                />
                : null }
        </div>

    )
}

export default DataSelector; 