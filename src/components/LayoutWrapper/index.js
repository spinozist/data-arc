import React, { useState, useEffect } from 'react';
import ReactGridLayout from 'react-grid-layout';
import defaults from '../../config/defaults';
import { Dropdown, Container, Menu, Grid, Button } from 'semantic-ui-react';
import DataTable from '../Table';
import { ExportToCsv } from 'export-to-csv';
import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import './style.css';

const DataWrapper = props => {

    const [layout, setLayout] = useState({
        mapVisible: defaults.mapView.visible,
        tableVisible: defaults.tableView.visible,
        chartVisible: defaults.chartView.visible
    });
    const [serviceID, setServiceID] = useState(0);
    const [sortField, setSortField] = useState('NAME');
    const [sortOrder, setSortOrder] = useState('lohi');
    const [sumLevel, setSumLevel] = useState('County');
    const [plngRegion, setPlngRegion] = useState('*')
    const [selectedFields, setSelectedFields] = useState(['NAME', 'GEOID'])
    const [fieldOptions, setFieldOptions] = useState();
    const [data, setData] = useState();
    const [csvData, setCSVData] = useState();
    const [csvStatus, setCSVStatus] = useState('nodata');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [cols, setCols] = useState(12); 
    const [rows, setRows] = useState(10);


    const rowHeight = screenHeight/rows;


    console.log(rowHeight);
    console.log(screenWidth);
    console.log(screenHeight);
    // layout is an array of objects, see the demo for more complete usage
    const boxLayout = [
        {
            i: 'table-box', 
            x: defaults.tableView.x, 
            y: defaults.tableView.y, 
            w: defaults.tableView.w, 
            h: defaults.tableView.h, 
            minW: defaults.tableView.minW, 
            maxH: defaults.tableView.maxH
        },
        {
            i: 'data-selector-box', 
            x: defaults.dataSelector.x, 
            y: defaults.dataSelector.y, 
            w: defaults.dataSelector.w, 
            h: defaults.dataSelector.h, 
            minW: defaults.dataSelector.minW, 
            maxH: defaults.dataSelector.maxH
        },
        {
            i: 'map-box', 
            x: defaults.mapView.x, 
            y: defaults.mapView.y, 
            w: defaults.mapView.w, 
            h: defaults.mapView.h, 
            minW: defaults.mapView.minW, 
            maxH: defaults.mapView.maxH
        }
    ];

    const getData = (baseurl, categoryID, geo, fields) => {
        // console.log(geo)
        setData();
        // setFieldOptions();
        const url = `${baseurl}${categoryID}/query?where=SumLevel='${geo}'&returnGeometry=false&outFields=${fields}&f=json`;
        API.getData(url)
            .then(res => {
                // console.log(res);
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

    // For CSV Export

    const handleCSVData = (baseurl, categoryID, geo, fields) => {
        const url = `${baseurl}${categoryID}/query?where=SumLevel='${geo}'&returnGeometry=false&outFields=${fields}&f=json`;

        API.getData(url)
            .then(res => {
                console.log(res.data.features);
                const dataArray = res.data.features.map(feature => feature.attributes);
                console.log(dataArray);
                setCSVData(dataArray);
                setCSVStatus('ready');
            })
            .catch(err => console.log(err))
    }

    const downloadCSV = () => {
        const csvFilename = sumLevel + '-' + serviceID.toString() +  '-download';
        const csvTitle = 'Test';
        // const fieldIDs = Object.keys(csvData[0]);
    
    //    const csvFilename = dataTitle
    
        const csvOptions = 
            { 
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                filename: csvFilename, 
                showTitle: false,
                title: csvTitle,
                useTextFile: false,
                useKeysAsHeaders: true,
                // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
            };

        const csvExporter = new ExportToCsv(csvOptions);

        csvExporter.generateCsv(csvData);
        
        setCSVData();
        setCSVStatus('nodata');
    }


    useEffect(() => getData(defaults.data.baseUrl, serviceID, sumLevel, '*'), [serviceID, sumLevel]);
    
    return (
        <ReactGridLayout autoSize className="layout" layout={boxLayout} cols={cols} rowHeight={rowHeight} width={screenWidth}>
            <div key="data-selector-box">

            { defaults.categoryOptions ? 
                <Dropdown 
                    style={{float: 'left', margin: '5px', height:'50px'}} 
                    id='cat-selector' 
                    value={serviceID} 
                    onChange={(event, data) => setServiceID(data.value)} 
                    placeholder='Select Data Category' 
                    selection 
                    options={defaults.categoryOptions}
                />
                : null }
            { sumLevel ? 
                <Dropdown 
                    selection 
                    style={{ float: 'left', margin: '5px', height:'50px'}} 
                    id='cat-selector' 
                    value={sumLevel} 
                    onChange={(event, data) => setSumLevel(data.value)} 
                    placeholder='Select Data Category' 
                    options={defaults.geoOptions}
                />
                : null }
            { fieldOptions ? 
                <Dropdown
                    multiple search selection 
                    style={{ float: 'left', margin: '5px'}} 
                    id='field-selector' 
                    value={selectedFields} 
                    onChange={(event, data) => setSelectedFields(data.value)} 
                    placeholder='Select Fields' 
                    options={fieldOptions} 
                />
                : null }
            { data ?
                <Button 
                    className={csvStatus === 'ready' ? 'pulse' : null } 
                    onClick={() => csvStatus === 'nodata' ? handleCSVData(defaults.data.baseUrl, serviceID, sumLevel, selectedFields) : downloadCSV() } 
                    style={{margin: '5px', float: 'right', height: '50px'}}
                >
                    {csvStatus === 'nodata' ? 'Create CSV' : 'Download CSV'}
                </Button>
                : null }
            {csvStatus === 'ready' ? 
                <Button
                    color='red' 
                    onClick={() => {
                        setCSVData()
                        setCSVStatus('nodata')
                    }} 
                    style={{margin: '5px', float: 'right', height: '50px'}}
                >
                Cancel
                </Button>
                : null}
            </div>
            <div key="map-box">
            { layout.mapVisible ? 'Map Component' : null }
            </div>

            <div key="table-box">
                <div id='table-box'>

            { layout.tableVisible && data ?
            <DataTable
                    selectedFields={selectedFields} 
                    data={data}
                    sortField={sortField}
                    handleSortField={handleSortField}
                    sortOrder={sortOrder}
                    /> 
                : <Grid verticalAlign="middle">
                        <Grid.Column width={16}  textAlign="center">
                        <Loader type='Grid'/>
                        </Grid.Column>
                  </Grid> 
            }
            { layout.chartVisible ? <div>Chart Component</div> : null }
                </div>       
            </div>
        </ReactGridLayout>
    );
}

export default DataWrapper;