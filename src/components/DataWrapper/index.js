import React, { useState, useEffect } from "react";
import defaults from '../../config/defaults';
import { Dropdown, Container, Menu, Grid} from 'semantic-ui-react';
import DataTable from '../Table';
import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import './style.css';

const DataWrapper = props => {

    const [layout, setLayout] = useState(defaults.layout);
    const [serviceID, setServiceID] = useState(0);
    const [sortField, setSortField] = useState('NAME');
    const [sortOrder, setSortOrder] = useState('lohi');
    const [sumLevel, setSumLevel] = useState('County');
    const [plngRegion, setPlngRegion] = useState('*')
    const [fields, setFields] = useState(['NAME', 'GEOID'])
    const [fieldOptions, setFieldOptions] = useState();
    const [data, setData] = useState();

    const getData = (baseurl, categoryID, geo) => {
        console.log(geo)
        setData();
        // setFieldOptions();
        const url = `${baseurl}${categoryID}/query?where=SumLevel='${geo}'&geometry=false&outFields=*&f=json`;
        API.getData(url)
            .then(res => {
                console.log(res);
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

    const handleSortField = (fieldAlias, sortOrder) => {
        setSortField(fieldAlias);
        setSortOrder(sortOrder);
    }

    useEffect(() => getData(defaults.data.baseUrl, serviceID, sumLevel), [serviceID, sumLevel]);
    
    return (
        <Container fluid>
            <Grid.Row>

            <Menu fixed={'top'} style={{height: '12vh'}}>


            { defaults.categoryOptions ? 
                <Dropdown style={{margin: '5px', height:'50px'}} id='cat-selector' value={serviceID} onChange={(event, data) => setServiceID(data.value)} placeholder='Select Data Category' selection options={defaults.categoryOptions} />
                : null }
            { sumLevel ? 
                <Dropdown style={{margin: '5px', height:'50px'}} id='cat-selector' value={sumLevel} onChange={(event, data) => setSumLevel(data.value)} placeholder='Select Data Category' selection options={defaults.geoOptions} />
                : null }
            { fieldOptions ? 
                <Dropdown style={{margin: '5px'}} id='field-selector' value={fields} onChange={(event, data) => setFields(data.value)} placeholder='Select Fields' multiple search selection options={fieldOptions} />
                : null }
             </Menu>
             </Grid.Row>

            <Grid.Row style={{marginTop: '12vh'}}>
            { layout.mapView ? <div>Map Component</div> : null }
            { layout.tableView && data ?
               <DataTable
                    fields={fields} 
                    data={data}
                    sortField={sortField}
                    handleSortField={handleSortField}
                    sortOrder={sortOrder}
                    /> 
                : <div 
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
            </Grid.Row>
        </Container>
        );
}

export default DataWrapper;