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
// import { readSync } from 'fs';

const LayoutWrapper = props => {

    // Initiate state variables and setter functions

    const [layout, setLayout] = useState(defaults.layout),
     [sumLevel, setSumLevel] = useState(defaults.data.sumLevel),
     [hoverField, setHoverField] = useState(defaults.data.hoverField),
     [hoverID, setHoverID] = useState(),
     [MOE, setMOE] = useState(defaults.data.MOE),
     [boundingGEO, setBoundingGEO] = useState(),
     [geoJSON, setGeoJSON] = useState(),
     [data, setData] = useState(),
     [dataTray, setDataTray] = useState(defaults.data.tray),
     [primaryField, setPrimaryField] = useState(defaults.categoryOptions[0].primaryField),
     [secondaryField, setSecondaryField] = useState(defaults.categoryOptions[0].secondaryField),
     [dataSelectorModal, setDataSelectorModal] = useState(false),
     [dataLoaded, setDataLoaded] = useState();


    const handleData = (baseurl, geo) => {
       
        setDataLoaded(false);
        
        // Empty Data and GeoJSON states
        setData();
        setGeoJSON();
        
        //  Get bounding geography based on geo
        const handleBoundingGeo = boundingGEO => {
        
            const url = defaults.boundingGeoURL[boundingGEO];
    
            API.getData(url)
                .then(res => setBoundingGEO(res.data))
                .catch(err => console.error(err))
        }

        handleBoundingGeo(defaults.geoOptions.find(option => 
            option.value === geo).boundingGeo);

        // Calls data using dataTray, maps it to dataObj 
        // created by returned GeoJSON, and then sets 
        const addData = (dataObj, baseurl, geo) =>  {
        
            const serviceIDs = [];

            // Pushes to array of serviceIDs, 
            // necessary for creating multiple API calls
            const getServiceIDs = () => dataTray ?
                Object.values(dataTray).forEach(result => 
                    serviceIDs.includes(result.serviceID) === false ? 
                        serviceIDs.push(result.serviceID) : null
                ) : null;
            
            getServiceIDs();

            // Makes multiple API calls using array of
            // serviceIDs along with arrays of field keys 
            // filtered from the data tray
            serviceIDs.map(serviceID => {

                const fields = 
                    Object.entries(dataTray)
                        .filter(([key, value]) => 
                            value.serviceID === serviceID)
                            .map(([key, value]) => key);

                fields.push('GEOID', 'NAME');

                const dataURL = `${baseurl}${serviceID}/query?where=SumLevel='${geo}'&outFields=${fields}&returnGeometry=false&f=geojson`;

                API.getData(dataURL)
                    .then(res => {
                        res.data.features.map(feature => {
                            const propertiesObj = feature.properties;
                            const featureID = propertiesObj.GEOID;
                            Object.entries(propertiesObj)
                                .map(([key, value]) => dataObj[featureID][key] = value)
                        });

                        return dataObj
                    })
                    .then(dataObj => {
                        setData(dataObj)
                        setDataLoaded(true);
                    })
                    .catch(err => console.log(err))
            });

        }



        // API for geoJSON

        const geoJSONFields = [hoverField];
        const dataURL = `${baseurl}/0/query?where=SumLevel='${geo}'&outFields=${geoJSONFields}&f=geojson`

        API.getData(dataURL)
            .then(res => {

                // Initiate dataObj
                var dataObj = {};

                // Map returned keys along wtih empty 
                // valueObjects to the dataOj
                res.data.features.forEach(feature =>
                    dataObj[feature.properties[geoJSONFields[0]]] = {});
                
                // set GeoJSON state without data
                setGeoJSON(res.data)
                
                // Pass along dataObj for data to be added to it
                return dataObj
            })
            .then(dataObj => addData(dataObj, baseurl, geo))
            .catch(err => console.log(err));    
    }
    
    useEffect(() => handleData(defaults.data.baseUrl, sumLevel) ,[dataTray, sumLevel]);

    
    return (
        <Grid fluid style={{padding: '20px', height: '100vh'}}>
            
            <Row style={{height: '100%'}}>
                
                {/* Map Container */}
                
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
                        setLayout={setLayout}
                        layout={layout}
                        boundingGEO={boundingGEO}
                        geo={sumLevel}
                        hoverID={hoverID}
                        handleHover={setHoverID}
                        hoverField={hoverField} 
                        primaryField={primaryField}
                        setPrimaryField={setPrimaryField} 
                        data={data}
                        dataTray={dataTray}
                        geoJSON={geoJSON}
                        setSumLevel={setSumLevel}
                        colorRamp={
                            data && dataLoaded && geoJSON ?
                            <ColorRamp 
                                primaryField={primaryField} 
                                data={data} 
                                layout={layout}
                            /> : 
                            <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                                <Loader id='loader-box' type='ThreeDots' height={40} width={100} />
                            </div>
                        }
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
                                    setSecondaryField={setSecondaryField}
                                    primaryField={primaryField}
                                    secondaryField={secondaryField}
                                    sumLevel={sumLevel}
                                    hoverField={hoverField}
                                    MOE={MOE}
                                />
                            }
                        />}
                    /> : 
                        <div style={{zIndex: '99999', color: 'teal', position: 'absolute', bottom: '50%', width: '100%', textAlign: 'center'}}>
                            <h2>Map Loading...</h2>
                            <Loader id='loader-box' color='teal' type='Circles' />
                        </div> 
                    }
                    {
                        !dataLoaded && !data ?
                        <div style={{zIndex: '99999', color: 'teal', position: 'absolute', bottom: '50%', width: '100%', textAlign: 'center'}}>
                        <h2>Data Layer Loading...</h2>
                        <Loader id='loader-box' color='teal' type='Circles' />
                        </div>
                        : null
                    }
                </Col>

                {/* Side Bar */}

                {layout.sideBarWidth.sm > 0 || layout.sideBarWidth.lg > 0 ?
                <Col className='no-scrollbar' sm={layout.sideBarWidth.sm} lg={layout.sideBarWidth.lg} style={{height: '100%', width: '100%', overflow: 'scroll'}}>
                
                {/* Table */}
                
                { layout.tableVisible && primaryField ?
                    
                    
                    <Row className='no-scrollbar' middle='sm' 
                        style={{
                            margin: '0 15px 0 10px',
                            borderRadius: '10px 10px 0 0',
                            height: '50%',
                            width: '100%',
                            overflow: 'scroll',
                            backgroundColor: 'white',
                            padding: '10px'
                        }}>    
                        {data ? 
                        <TableSE
                            data={data}
                            dataTray={dataTray}
                            hoverID={hoverID}
                            handleHover={setHoverID}
                            hoverField={hoverField}
                            layout={layout}
                            MOE={MOE}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='ThreeDots' />
                        </div>
                        }

                    </Row> :  null 
                }
                {/* Table export bar */}
                { data && layout.tableVisible ?
                    <div 
                        style={{
                            float: 'left',
                            width: '100%',
                            // height: '20px',
                            margin: '0 10px 5px 10px',
                            backgroundColor: 'white',
                            borderRadius: '0 0 10px 10px'}}>

                    <CSVExportButton
                    // {...props}
                    data={data}
                    // selectedFields={props.selectedFields}
                    text={<small>Download CSV</small>}
                    color='red'
                    basic={true}
                    float='right'
                    height='30px'
                    // borderRadius='50%'
                    margin={'5px'}
                    />
                    </div>    

                        : null
                         
                } 
                
                { layout.scatterPlotVisible && primaryField ? 

                    <Row center='sm' middle='sm' style={{margin: '5px', height: '40%', width: '100%'}}>
                        { data && dataLoaded  ? 
                        <ChartWrapper
                        dataTray={dataTray}
                        dataLoaded={dataLoaded} 
                        primaryField={primaryField}
                        setPrimaryField={setPrimaryField}
                        secondaryField={secondaryField}
                        setSecondaryField={setSecondaryField}
                        data={data} 
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
                        { data && dataLoaded ?
                        <ChartWrapper 
                            primaryField={primaryField}
                            secondaryField={secondaryField}
                            data={data}
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