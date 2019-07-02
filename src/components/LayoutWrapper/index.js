import React, { useState, useEffect } from 'react';
// import ReactGridLayout from 'react-grid-layout';
import {Grid, Row, Col} from 'react-flexbox-grid';
import defaults from '../../config/defaults';
import DataTable from '../Table';
import DataSelector from '../DataSelector';
import MapWrapper from '../MapWrapper';
import ChartWrapper from '../ChartWrapper';
import { ExportToCsv } from 'export-to-csv';
import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import './style.css';
import ColorRamp from '../Legends/ColorRamp';
import DataManifest from '../../config/DataManifest.json'

const LayoutWrapper = props => {

    // console.log(DataManifest);

    const [layout, setLayout] = useState({
        mapVisible: defaults.layout.mapView.visible,
        tableVisible: defaults.layout.tableView.visible,
        chartVisible: defaults.layout.chartView.visible,
        colorMap: 'temperature',
        numberOfBins: 72,
        colorMapReverse: false,
        // chartType: 'scatterplot',
        colorOpacity: .8
    });

    const [serviceID, setServiceID] = useState(0);
    const [sortField, setSortField] = useState('NAME');
    const [sortOrder, setSortOrder] = useState('lohi');
    const [sumLevel, setSumLevel] = useState('County');
    const [plngRegion, setPlngRegion] = useState('ARC 10')
    const [selectedFields, setSelectedFields] = useState(['NAME', 'GEOID']);
    const [hoverField, setHoverField] = useState('GEOID');
    const [hoverID, setHoverID] = useState();
    const [fieldOptions, setFieldOptions] = useState();
    const [mapField, setMapField] = useState('TotPop_00')
    const [data, setData] = useState();
    const [csvData, setCSVData] = useState();
    const [csvStatus, setCSVStatus] = useState('nodata');
    const [fileType, setFileType] = useState('geojson')


    const getData = (baseurl, categoryID, geo, fields) => {
        // console.log(geo)
        setData();

        // setSelectedFields(['NAME','GEOID']);

        // setFieldOptions();
        const url = `${baseurl}${categoryID}/query?where=SumLevel='${geo}'&outFields=${fields}&f=${fileType}`;
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
                        .map(field =>  ({
                            key : field,
                            text : DataManifest.map(item => field === item.Variable ? item.Long : null), 
                            value : field
                        })) : fieldOptions;
                                        
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

    const handleHover = featureID => {
        setHoverID(featureID);
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
        <Grid fluid style={{height: '100vh'}}>
            <Row style={{height: '15vh'}}>
                <DataSelector
                    setServiceID={setServiceID}
                    setSelectedFields={setSelectedFields}
                    setFieldOptions={setFieldOptions}
                    handleCSVData={handleCSVData}
                    downloadCSV={downloadCSV}
                    setCSVStatus={setCSVStatus}
                    setCSVData={setCSVData}
                    setSumLevel={setSumLevel}
                    setMapField={setMapField}
                    serviceID={serviceID}
                    sumLevel={sumLevel}
                    data={data}
                    selectedFields={selectedFields}
                    csvStatus={csvStatus}
                    fieldOptions={fieldOptions}
                    hoverField={hoverField}
                />
            </Row>
            <Row style={{height: '80vh'}}>
                <Col sm={12} lg={6} style={{height: '100%', width: '100%'}}>
                    <Row className='no-scrollbar' middle='sm' style={{marginTop: '30px', height: '50%', width: '100%', overflow: 'scroll'}}>
                        { layout.tableVisible && data ?
                        <DataTable
                            selectedFields={selectedFields} 
                            data={data}
                            sortField={sortField}
                            handleSortField={handleSortField}
                            sortOrder={sortOrder}
                            hoverID={hoverID}
                            handleHover={handleHover}
                            hoverField={hoverField}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='Grid' />
                        </div>}
                    </Row>
                    <Row center='sm' middle='sm' style={{height: '50%', width: '100%', zIndex: '99999'}}>
                        { layout.chartVisible && data ? 
                        <ChartWrapper 
                            selectedVariable={mapField}
                            data={data} 
                            layout={layout}
                            handleHover={handleHover}
                            hoverID={hoverID} 
                        />  : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='Audio' />
                        </div> }
                    </Row>
                </Col>
                <Col sm={12} lg={6} style={{height: '100%'}}>  
                    { layout.mapVisible ? 
                    <MapWrapper
                        hoverID={hoverID}
                        handleHover={handleHover}
                        hoverField={hoverField} 
                        selectedVariable={mapField} 
                        layout={layout} data={data} /> 
                    : <h1>Map not loading</h1> }
                    <ColorRamp selectedVariable={mapField} data={data} layout={layout} />
                </Col>
            </Row>
        </Grid>
    );
}

export default LayoutWrapper;