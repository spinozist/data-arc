import React, { useState, useEffect } from "react";
import defaults from '../../config/defaults';
import { Dropdown } from 'semantic-ui-react';
import Table from '../Table';
import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import './style.css';

const DataWrapper = props => {

    const [layout, setLayout] = useState(defaults.layout);
    const [serviceID, setServiceID] = useState(0);
    const [sortField, setSortField] = useState('NAME');
    const [sumLevel, setSumLevel] = useState('NPU');
    const [plngRegion, setPlngRegion] = useState('*')
    const [fields, setFields] = useState(['NAME', 'GEOID'])
    const [fieldOptions, setFieldOptions] = useState();
    const [query, setQuery] = useState()
    const [data, setData] = useState();

    const getData = (baseurl, categoryID, geo) => {
        console.log(geo)
        setData();
        // setFieldOptions();
        const url = baseurl + categoryID + `/query?where=SumLevel='${geo}'&outFields=*&f=json`;
        API.getData(url)
            .then(res => {
                console.log(res.data.fields);
                const optionsArray = res.data.fields.map(field => 
                    ({
                        key : field.name,
                        text : field.alias,
                        value : field.name
                    })
                );
                setData(res.data);
                setFieldOptions(optionsArray);
            })
            .catch(err => console.log(err));

    }

    const geoOptions = [
        {
            key: "geo-0",
            text: "State of Georgia",
            value: 'State' 
        },
        {
            key: "geo-1",
            text: "County",
            value: 'County' 
        },        {
            key: "geo-2",
            text: "City",
            value: 'City' 
        },
        {
            key: "geo-3",
            text: "GA House Districts",
            value: 'GAHouse' 
        },
        {
            key: "geo-4",
            text: "Neighborhood Planning Units (NPU)",
            value: 'NPU' 
        },
    ];

    // const categoryOptions = [
    //     {
    //         key: "serviceID-0",
    //         text: "Change since 2000",
    //         value: 0
    //     },
    //     {
    //         key: "serviceID-1",
    //         text: "Demography",
    //         value: 1
    //     },
    //     {
    //         key: "serviceID-2",
    //         text: "Demography by Race & Ethnicity",
    //         value: 2
    //     },
    //     {
    //         key: "serviceID-3",
    //         text: "Economy",
    //         value: 3
    //     },
    //     {
    //         key: "serviceID-4",
    //         text: "Economy by Race & Ethnicity",
    //         value: 4
    //     },
    //     {
    //         key: "serviceID-5",
    //         text: "Housing",
    //         value: 5
    //     },
    //     {
    //         key: "serviceID-6",
    //         text: "Housing by Race & Ehtnicity",
    //         value: 6
    //     },
    //     {
    //         key: "serviceID-7",
    //         text: "Social",
    //         value: 7
    //     },
    //     {
    //         key: "serviceID-8",
    //         text: "Social by Race & Ethnicity",
    //         value: 8
    //     }
    // ]

    // const handleSortField = event => {
    //     const field = event.target;
    //     console.log(field);
    // }

    // const keyArray = data ? data.features.map(item => Object.keys(item.attributes)) : null;
    // const valueArray = data ? data.features.map(item => Object.values(item.attributes)) : null;

    useEffect(() => getData(defaults.data.baseUrl, serviceID, sumLevel), [serviceID, sumLevel]);
    
    return (
        <div style={{height: '100vh', width: '100%'}}>
            <div style={{position: 'fixed', float: 'left', backgroundColor: 'white', top: '0px', width: "100%", height: '80px', zIndex: '999'}}>
            { defaults.categoryOptions ? 
                <div style={{position: 'fixed', float: 'left', top: '10px', left: "5px"}}>
                <Dropdown id='cat-selector' value={serviceID} onChange={(event, data) => setServiceID(data.value)} style={{position: 'fixed', float : 'left', width: '195'}} placeholder='Select Data Category' selection options={defaults.categoryOptions} />
                {/* <button style={{float: 'right'}} onClick={event => handleFields(event)}>Add Fields to Table</button> */}
                </div> : null }
            { sumLevel ? 
                <div style={{position: 'fixed', float: 'left', top: '10px', left: "205px"}}>
                <Dropdown id='cat-selector' value={sumLevel} onChange={(event, data) => setSumLevel(data.value)} style={{position: 'fixed', float : 'left', width: '195'}} placeholder='Select Data Category' selection options={geoOptions} />
                {/* <button style={{float: 'right'}} onClick={event => handleFields(event)}>Add Fields to Table</button> */}
                </div> : null }
            { fieldOptions ? 
                <div>
                <Dropdown id='field-selector' value={fields} onChange={(event, data) => setFields(data.value)} style={{position: 'fixed', float : 'left', top: '10px', left: '505px'}} placeholder='Select Fields' multiple search selection options={fieldOptions} />
                {/* <button style={{float: 'right'}} onClick={event => handleFields(event)}>Add Fields to Table</button> */}
                </div> : null }
            </div>
            { layout.mapView ? <div>Map Component</div> : null }
            { layout.tableView && data ? 
               <div style={{float: 'left'}}>
               <Table
                    fields={fields} 
                    data={data}
                    sortField={sortField}
                    // sort={handleSortField}
                    /> 
                </div>: 
                    <div 
                        style={{
                            position: 'fixed',
                            height: '100vh', 
                            width: '100%', 
                            textAlign: 'center', 
                            marginTop: '40vh',
                            zIndex: '9999'}}>
                        <Loader type="Grid"/>
                    </div> 
            }
            { layout.chartView ? <div>Chart Component</div> : null }
        </div>);
}

export default DataWrapper;