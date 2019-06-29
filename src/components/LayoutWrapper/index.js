import React, { useState, useEffect } from 'react';
import ReactGridLayout from 'react-grid-layout';
import defaults from '../../config/defaults';
import { Dropdown, Grid, Button } from 'semantic-ui-react';
import DataTable from '../Table';
import DataSelector from '../DataSelector';
import MapWrapper from '../MapWrapper';
import { ExportToCsv } from 'export-to-csv';
import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import './style.css';

const LayoutWrapper = props => {

    const [layout, setLayout] = useState({
        mapVisible: defaults.layout.mapView.visible,
        tableVisible: defaults.layout.tableView.visible,
        chartVisible: defaults.layout.chartView.visible,
        colorMap: 'viridis',
        numberOfBins: 72,
        colorMapReverse: false,
        // chartType: 'scatterplot',
        colorOpacity: .9
    });
    const [serviceID, setServiceID] = useState(0);
    const [sortField, setSortField] = useState('NAME');
    const [sortOrder, setSortOrder] = useState('lohi');
    const [sumLevel, setSumLevel] = useState('County');
    const [plngRegion, setPlngRegion] = useState('*')
    const [selectedFields, setSelectedFields] = useState(['NAME', 'GEOID']);
    const [hoverField, setHoverField] = useState('GEOID')
    const [fieldOptions, setFieldOptions] = useState();
    const [mapField, setMapField] = useState('TotPop_00')
    const [data, setData] = useState();
    const [csvData, setCSVData] = useState();
    const [csvStatus, setCSVStatus] = useState('nodata');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [cols, setCols] = useState(defaults.layout.columns); 
    const [rows, setRows] = useState(defaults.layout.rows);
    const [fileType, setFileType] = useState('geojson')


    const rowHeight = screenHeight/rows;


    console.log(rowHeight);
    console.log(screenWidth);
    console.log(screenHeight);
    
    const boxLayout = [
        {
            i: 'table-box', 
            x: defaults.layout.tableView.x, 
            y: defaults.layout.tableView.y, 
            w: defaults.layout.tableView.w, 
            h: defaults.layout.tableView.h, 
            minW: defaults.layout.tableView.minW, 
            maxH: defaults.layout.tableView.maxH
        },
        {
            i: 'data-selector-box', 
            x: defaults.layout.dataSelector.x, 
            y: defaults.layout.dataSelector.y, 
            w: defaults.layout.dataSelector.w, 
            h: defaults.layout.dataSelector.h, 
            minW: defaults.layout.dataSelector.minW, 
            maxH: defaults.layout.dataSelector.maxH
        },
        {
            i: 'map-box', 
            x: defaults.layout.mapView.x, 
            y: defaults.layout.mapView.y, 
            w: defaults.layout.mapView.w, 
            h: defaults.layout.mapView.h, 
            minW: defaults.layout.mapView.minW, 
            maxH: defaults.layout.mapView.maxH,
            static: defaults.layout.mapView.static
        }
    ];


    const getData = (baseurl, categoryID, geo, fields) => {
        // console.log(geo)
        setData();
        // setFieldOptions();
        const url = `${baseurl}${categoryID}/query?where=SumLevel='${geo}'&returnGeometry=true&outFields=${fields}&f=${fileType}`;
        API.getData(url)
            .then(res => {
                console.log(res);
                const optionsArray = fileType === 'json' ? res.data.fields.map(field => 
                    ({
                        key : field.name,
                        text : field.alias,
                        value : field.name
                    })
                ) : fileType === 'geojson' ? 
                    Object.keys(res.data.features[0].properties)
                        .map(field => 
                        ({
                            key : field,
                            text : field,
                            value : field
                        }) ) : fieldOptions;
                                        
                console.log(optionsArray);
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
        <ReactGridLayout className="layout" layout={boxLayout} cols={cols} rowHeight={rowHeight} width={screenWidth}>
            <div key="data-selector-box">
                <DataSelector
                    setServiceID={setServiceID}
                    setSelectedFields={setSelectedFields}
                    setFieldOptions={setFieldOptions}
                    handleCSVData={handleCSVData}
                    downloadCSV={downloadCSV}
                    setCSVStatus={setCSVStatus}
                    setCSVData={setCSVData}
                    setSumLevel={setSumLevel}
                    serviceID={serviceID}
                    sumLevel={sumLevel}
                    data={data}
                    selectedFields={selectedFields}
                    csvStatus={csvStatus}
                    fieldOptions={fieldOptions}
                    hoverField={hoverField}
                    setMapField={setMapField}
                    />
            </div>

            <div 
            key="map-box">
            { layout.mapVisible ? <MapWrapper hoverField={hoverField} selectedVariable={mapField} layout={layout} data={data} /> : null }
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
                        <Grid.Column style={{marginTop: '50%'}} width={16}  textAlign="center">
                        <Loader type='Grid' />
                        </Grid.Column>
                  </Grid> 
            }
            { layout.chartVisible ? <div>Chart Component</div> : null }
                </div>       
            </div>
        </ReactGridLayout>
    );
}

export default LayoutWrapper;