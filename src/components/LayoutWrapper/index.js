import React, { useState, useEffect } from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TableSE from '../Table-SE';
import DataSelector from '../DataSelector';
import MapWrapper from '../MapWrapper';
import ChartWrapper from '../ChartWrapper';
import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import ColorRamp from '../Legends/ColorRamp';
import ModalWrapper from '../ModalWrapper';
import { Button } from 'semantic-ui-react';
import CSVExportButton from '../CSVExportButton';
// import NewUserForm from '../NewUserForm';
// import DataManifest from '../../config/DataManifest.json'
import OpenDataManifest from '../../config/OpenDataManifest';
import defaults from '../../config/defaults';

import './style.css';
import { readSync } from 'fs';

const LayoutWrapper = props => {

    // console.log(DataManifest);

    const [layout, setLayout] = useState(defaults.layout);

    const [serviceID, setServiceID] = useState(0);
    // const [prevServiceID, setPreviousServiceID] = useState();
    const [labelManifest, setLabelManifest] = useState('Change since 2000');
    const [sortField, setSortField] = useState('NAME');
    const [sortOrder, setSortOrder] = useState('hilo');
    const [sumLevel, setSumLevel] = useState(defaults.data.sumLevel);
    const [selectedFields, setSelectedFields] = useState(defaults.data.selectedFields);
    const [hoverField, setHoverField] = useState(defaults.data.hoverField);
    const [hoverID, setHoverID] = useState();
    const [fieldOptions, setFieldOptions] = useState();

    const [data, setData] = useState();

    const [MOE, setMOE] = useState(defaults.data.MOE);
    const [boundingGEO, setBoundingGEO] = useState();

    const [geoJSON, setGeoJSON] = useState();
    const [testData, setTestData] = useState();
    const [dataTray, setDataTray] = useState(defaults.data.tray);
    const [primaryField, setPrimaryField] = useState(defaults.categoryOptions[0].primaryField)
    const [secondaryField, setSecondaryField] = useState(defaults.categoryOptions[0].secondaryField);
    const [dataSelectorModal, setDataSelectorModal] = useState(false);
    const [dataLoaded, setDataLoaded] = useState()


    const handleData = (baseurl, geo) => {
       
        setDataLoaded(false);
        
        setTestData();
        setGeoJSON();
        
        
        handleBoundingGeo(defaults.geoOptions.find(option => 
            option.value === geo).boundingGeo);

        // API for geoJSON

        const geoJSONFields = ['GEOID'];

        API.getData(`${baseurl}/0/query?where=SumLevel='${geo}'&outFields=${geoJSONFields}&f=geojson`)
            .then(res => {

                var dataObj = {};
                res.data.features.forEach(feature => 
                    dataObj[feature.properties[geoJSONFields[0]]] = {});
                console.log(dataObj);
                setGeoJSON(res.data)
                return dataObj
            })
            .then(dataObj => addData(dataObj, baseurl, geo))
            .catch(err => console.log(err));    

    }

    // API for data (without geometry)

    const addData = (dataObj, baseurl, geo) =>  {
        const serviceIDs = [];

        console.log(dataTray)

        const getServiceIDs = () => dataTray ?
            Object.values(dataTray).forEach(result => 
                serviceIDs.includes(result.serviceID) === false ? serviceIDs.push(result.serviceID) : null
            ) : null;
        
        getServiceIDs();

        console.log(serviceIDs);
        
        serviceIDs.map(serviceID => {

            const fields = Object.entries(dataTray).filter(([key, value]) => value.serviceID === serviceID).map(([key, value]) => key);

            console.log(fields);
            console.log(dataObj);

            fields.push('GEOID', 'NAME');

            const dataURL = `${baseurl}${serviceID}/query?where=SumLevel='${geo}'&outFields=${fields}&returnGeometry=false&f=geojson`;

            API.getData(dataURL)
                .then(res => {
                    // handleOptionsArray(res.data, categoryID, MOE);
                    // console.log(res.data);
                    res.data.features.map(feature => {
                        const propertiesObj = feature.properties;
                        const featureID = propertiesObj.GEOID;
                        Object.entries(propertiesObj)
                            .map(([key, value]) => dataObj[featureID][key] = value);
                    })

                    return dataObj
                })
                .then(dataObj => {
                    setTestData(dataObj)
                    setDataLoaded(true);
                })
                .catch(err => console.log(err))
                
        });

    }

    const handleBoundingGeo = boundingGEO => {
        
        const url = defaults.boundingGeoURL[boundingGEO];

        API.getData(url)
            .then(res => setBoundingGEO(res.data))
            .catch(err => console.error(err))
    }

    const handleSortField = (fieldAlias, sortOrder) => {
        setSortField(fieldAlias);
        setSortOrder(sortOrder);
    }
    
    useEffect(() => handleData(defaults.data.baseUrl, sumLevel),[dataTray,sumLevel]);
    
    return (
        <Grid fluid style={{padding: '20px', height: '100vh'}}>

            <Row style={{height: '100%'}}>
                <Col 
                    id='map-col' 
                    sm={layout.mapWidth.sm} 
                    lg={layout.mapWidth.lg} 
                    style={{
                        padding: '5px',
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        height: '100%'
                    }}
                >  
                    { layout.mapVisible ? 
                    <MapWrapper
                        dataLoaded={dataLoaded}
                        colorRamp={
                            testData && dataLoaded && geoJSON ?
                            <ColorRamp 
                                primaryField={primaryField} 
                                data={testData} 
                                layout={layout}
                            /> : 
                            <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                                <Loader id='loader-box' type='ThreeDots' height={40} width={100} />
                            </div>
                        }
                        setLayout={setLayout}
                        layout={layout}
                        dataButton={                
                            <ModalWrapper
                            open={dataSelectorModal}
                            centered={false}
                            header={<h2>Browse Data</h2>} 
                            trigger={
                                <Button 
                                    onClick={() => setDataSelectorModal(true)} 
                                    color='teal'
                                >
                                    Browse Data
                                </Button>} 
                            content={
                                <DataSelector
                                    setGlobalDataTray={setDataTray}
                                    setModalStatus={setDataSelectorModal}
                                    GlobalDataTray={dataTray}
                                    setSumLevel={setSumLevel}
                                    setPrimaryField={setPrimaryField}
                                    primaryField={primaryField}
                                    sumLevel={sumLevel}
                                    data={data}
                                    hoverField={hoverField}
                                    MOE={MOE}
                                />
                            }
                        />}
                        boundingGEO={boundingGEO}
                        geo={sumLevel}
                        hoverID={hoverID}
                        handleHover={setHoverID}
                        hoverField={hoverField} 
                        primaryField={primaryField}
                        setPrimaryField={setPrimaryField} 
                        data={testData}
                        dataTray={dataTray}
                        geoJSON={geoJSON}
                        setSumLevel={setSumLevel}
                        /> 
                    : <h1>Map not loading</h1> }
                    {
                        !dataLoaded && !testData ?
                        <div style={{zIndex: '99999', color: 'teal', position: 'absolute', bottom: '50%', width: '100%', textAlign: 'center'}}>
                        <h2>Data Layer Loading...</h2>
                        <Loader id='loader-box' color='teal' type='Circles' />
                        </div>
                        : null
                    }
                </Col>
                {layout.sideBarWidth.sm > 0 || layout.sideBarWidth.lg > 0 ?
                <Col className='no-scrollbar' sm={layout.sideBarWidth.sm} lg={layout.sideBarWidth.lg} style={{height: '100%', width: '100%', overflow: 'scroll'}}>
                    { testData && layout.tableVisible ?
                    <div 
                        style={{
                            float: 'left',
                            width: '100%',
                            margin: '0 10px -10px 10px',
                            backgroundColor: 'white',
                            borderRadius: '10px 10px 0 0'}}>

                    <CSVExportButton
                    // {...props}
                    data={testData}
                    // selectedFields={props.selectedFields}
                    text={<small>Download CSV</small>}
                    color='teal'
                    basic={false}
                    float='right'
                    // height='20px'
                    // borderRadius='50%'
                    // margin= <= default set to '10px'
                    />
                    </div>    

                        : null
                         
                } 
                { layout.tableVisible && primaryField ?

                    <Row className='no-scrollbar' middle='sm' 
                        style={{
                            margin: '0 15px 10px 10px',
                            borderRadius: '0 0 10px 10px',
                            height: '50%',
                            width: '100%',
                            overflow: 'scroll',
                            backgroundColor: 'white',
                            padding: '10px'
                        }}>

                        {testData ? 
                        <TableSE
                            selectedFields={selectedFields} 
                            data={testData}
                            dataTray={dataTray}
                            sortField={sortField}
                            handleSortField={handleSortField}
                            sortOrder={sortOrder}
                            hoverID={hoverID}
                            handleHover={setHoverID}
                            hoverField={hoverField}
                            labelManifest={labelManifest}
                            layout={layout}
                            MOE={MOE}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='ThreeDots' />
                        </div>
                        }

                    </Row> :  null 
                }
                
                { layout.scatterPlotVisible && primaryField ? 

                    <Row center='sm' middle='sm' style={{margin: '5px', height: '40%', width: '100%'}}>
                        { testData && dataLoaded  ? 
                        <ChartWrapper
                        dataTray={dataTray}
                        dataLoaded={dataLoaded} 
                        primaryField={primaryField}
                        setPrimaryField={setPrimaryField}
                        secondaryField={secondaryField}
                        setSecondaryField={setSecondaryField}
                        data={testData} 
                        layout={layout}
                        handleHover={setHoverID}
                        hoverID={hoverID} 
                        chartType={'scatterplot'}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                        <Loader id='loader-box' type='ThreeDots' />
                    </div>}
                        
                    </Row> : null }
                { layout.barChartVisible && primaryField ? 

                    <Row center='sm' middle='sm' style={{position: 'relative', top: layout.scatterPlotVisible ? '60px' : null, margin: '5px', height: '40%', width: '100%'}}>
                        { testData && dataLoaded ?
                        <ChartWrapper 
                            primaryField={primaryField}
                            secondaryField={secondaryField}
                            data={testData}
                            dataTray={dataTray} 
                            layout={layout}
                            handleHover={setHoverID}
                            hoverID={hoverID} 
                            chartType={'bar-chart'}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='ThreeDots' />
                        </div>}
                    </Row> : null }
                </Col>
                : null }
            </Row>
        </Grid>
    );
}

export default LayoutWrapper;