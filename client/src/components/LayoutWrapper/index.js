import React, { useState, useEffect } from 'react';
// import ReactGridLayout from 'react-grid-layout';
import {Grid, Row, Col} from 'react-flexbox-grid';
import { Button, Header, Modal } from 'semantic-ui-react'
import defaults from '../../config/defaults';
// import DataTable from '../Table';
import TableSE from '../Table-SE';
import DataSelector from '../DataSelector';
import MapWrapper from '../MapWrapper';
import ChartWrapper from '../ChartWrapper';
import { ExportToCsv } from 'export-to-csv';
import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import './style.css';
import ColorRamp from '../Legends/ColorRamp';
import NewUserForm from '../NewUserForm';
// import DataManifest from '../../config/DataManifest.json'
import OpenDataManifest from '../../config/OpenDataManifest';

const LayoutWrapper = props => {

    // console.log(DataManifest);

    const [layout, setLayout] = useState({
        mapVisible: defaults.layout.mapView.visible,
        tableVisible: defaults.layout.tableView.visible,
        chartVisible: defaults.layout.chartView.visible,
        colorMap: 'spring',
        numberOfBins: 72,
        colorMapReverse: false,
        // chartType: 'scatterplot',
        colorOpacity: .8,
        tableBanding: ['#c8e4d6', '#f3eeeb']
    });

    const [serviceID, setServiceID] = useState(0);
    const [labelManifest, setLabelManifest] = useState('Change');
    const [sortField, setSortField] = useState('NAME');
    const [sortOrder, setSortOrder] = useState('lohi');
    const [sumLevel, setSumLevel] = useState('County');
    // const [plngRegion, setPlngRegion] = useState('ARC 10')
    const [selectedFields, setSelectedFields] = useState(['NAME', 'GEOID']);
    const [hoverField, setHoverField] = useState('GEOID');
    const [hoverID, setHoverID] = useState();
    const [fieldOptions, setFieldOptions] = useState();
    const [mapField, setMapField] = useState('TotPop_00')
    const [data, setData] = useState();
    const [csvData, setCSVData] = useState();
    const [csvStatus, setCSVStatus] = useState('nodata');
    const [fileType, setFileType] = useState('geojson');


    const getData = (baseurl, categoryID, geo, fields) => {
        // console.log(geo)
        setData();

        // setSelectedFields(['NAME','GEOID']);

        // const excludeFields = [
        //     'GEOID_1',
        //     'GlobalID',
        //     'LogRecNo',
        //     'GEOID',
        //     'SumLevel',
        //     'NAME',
        //     'County10',
        //     'County20',
        //     'PLNG_REGIO',
        //     'created_date',
        //     'created_user',
        //     'last_edited_data',
        //     'last_edited_user'
        // ];


        setFieldOptions();
        setSelectedFields(['NAME', 'GEOID'])
        
        const url = `${baseurl}${categoryID}/query?where=SumLevel='${geo}'&outFields=${fields}&f=${fileType}`;
        
        API.getData(url)
            .then(res => {
                // console.log(labelManifest);
                console.log(res);
                // console.log(fileType)
                const optionsArray = fileType === 'json' ?
                res.data.fields.map(field => 
                    ({
                        key : field.name,
                        text : field.alias,
                        value : field.name
                    })
                ) : fileType === 'geojson' ? 
                    OpenDataManifest[labelManifest]
                        .filter(fieldObject => 
                            labelManifest === 'RaceX' ? 
                            fieldObject.Category === 'N/A' ||
                            fieldObject.Category === defaults.categoryOptions.find(item => item.value === serviceID).subcategory 
                            : true )
                        .map(fieldObj => 
                            ({
                                key : fieldObj.Variable,
                                text : fieldObj.Long, 
                                value : fieldObj.Variable 
                            })
                ) : fieldOptions;
                                        
                // console.log(optionsArray);
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
                // console.log(res.data.features);
                const dataArray = res.data.features.map(feature => feature.attributes);
                // console.log(dataArray);
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
                <Col 
                        sm={12} 
                        lg={1}
                    >
                    <Modal 
                        style={{backgroundColor: 'rgb(230, 226, 213)'}}
                        trigger={
                            <Button
                            basic
                            color='red' 
                            style={{
                                margin: '10px',
                                float: 'left',
                                height: '50px'}}>
                                Add New User
                            </Button>}>
                        <Modal.Header style={{backgroundColor: 'rgb(230, 226, 213)'}}>
                            New User Form
                        </Modal.Header>
                        <Modal.Content style={{backgroundColor: 'rgb(230, 226, 213)'}}>
                            <NewUserForm/>
                        </Modal.Content>
                    </Modal>
                </Col>
                <Col 
                    sm={12} 
                    lg={11}
                >
                    <DataSelector
                        setServiceID={setServiceID}
                        setSelectedFields={setSelectedFields}
                        setFieldOptions={setFieldOptions}
                        setLabelManifest={setLabelManifest}
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
                </Col>
            </Row>
            <Row style={{height: '80vh'}}>
                <Col sm={12} lg={6} style={{height: '100%', width: '100%'}}>
                    <Row className='no-scrollbar' middle='sm' style={{padding: '0px 30px 0px 30px', height: '50%', width: '100%', overflow: 'scroll'}}>
                        { layout.tableVisible && data ?
                        // <DataTable
                        //     selectedFields={selectedFields} 
                        //     data={data}
                        //     sortField={sortField}
                        //     handleSortField={handleSortField}
                        //     sortOrder={sortOrder}
                        //     hoverID={hoverID}
                        //     handleHover={handleHover}
                        //     hoverField={hoverField}
                        // /> 
                        <TableSE
                            selectedFields={selectedFields} 
                            data={data}
                            sortField={sortField}
                            handleSortField={handleSortField}
                            sortOrder={sortOrder}
                            hoverID={hoverID}
                            handleHover={handleHover}
                            hoverField={hoverField}
                            labelManifest={labelManifest}
                            layout={layout}
                        />
                        : 
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
                        layout={layout} 
                        data={data}
                        labelManifest={labelManifest} /> 
                    : <h1>Map not loading</h1> }
                    <ColorRamp selectedVariable={mapField} data={data} layout={layout} />
                </Col>
            </Row>
        </Grid>
    );
}

export default LayoutWrapper;