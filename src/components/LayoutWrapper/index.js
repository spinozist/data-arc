import React, { useState, useEffect } from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TableSE from '../Table-SE';
import DataSelector from '../DataSelector';
import MapWrapper from '../MapWrapper';
import ChartWrapper from '../ChartWrapper';
import Loader from 'react-loader-spinner';
import API from '../../utils/API';
// import Data from '../../utils/Data';
import ColorRamp from '../Legends/ColorRamp';
import ModalWrapper from '../ModalWrapper';
import { Button, Icon, Popup } from 'semantic-ui-react';
import CSVExportButton from '../CSVExportButton';
import defaults from '../../config/defaults';
import ImageExportButton from '../ImageExportButton';

import table from '@iconify/icons-mdi/table';
import chartScatterPlot from '@iconify/icons-mdi/chart-scatter-plot';
import chartBar from '@iconify/icons-mdi/chart-bar';

import './style.css';
// import { readSync } from 'fs';

const LayoutWrapper = props => {
    // console.log(props.defaults)
    // Initiate state variables and setter functions
    const [dataTray, setDataTray] = useState(defaults.data.tray);


    const [layout, setLayout] = useState(defaults.layout),
     [sumLevel, setSumLevel] = useState(defaults.data.sumLevel),
     [hoverField, setHoverField] = useState(),
     [hoverID, setHoverID] = useState(),
     [MOE, setMOE] = useState(defaults.data.MOE),
     [boundingGEO, setBoundingGEO] = useState(),
     [geoJSON, setGeoJSON] = useState(),
     [data, setData] = useState(),
     [primaryField, setPrimaryField] = useState(() => Object.keys(dataTray)[0]),
     [secondaryField, setSecondaryField] = useState(() => Object.keys(dataTray)[1]),
     [dataSelectorModal, setDataSelectorModal] = useState(false),
     [dataLoaded, setDataLoaded] = useState(),
     [scrollID, setScrollID] = useState();

    const [icons, setIcons] = useState({
        table: {
            visible: layout.tableVisible,
            ref: table
        }, 
        scatterPlot : {
            visible: layout.scatterPlotVisible,
            ref: chartScatterPlot
        },
        barChart: {
            visible: layout.barChartVisible,
            ref: chartBar
        }
    });
    //  [loadStatus, setLoadStatus] = useState();


    const handleData = (geo, dataTray) => {

        const geoAPI = defaults.geoOptions.find(option => 
            option.value === geo).geoAPI;

        const geoAPIInfo = defaults.data.dataAPIs[geoAPI];
        const joinField = geoAPIInfo.joinField;

        // setDataLoaded(false);
        
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
        const addData = (dataObj, geo) =>  {;

            // console.log(geo);

            const baseURL = geoAPIInfo.url
            const otherFields = geoAPIInfo.otherFields;
        
            const serviceIDs = [];
            const APIs = [];

            // Pushes to array of serviceIDs, 
            // necessary for creating multiple API calls
            const getServiceIDs = () => dataTray ?
                Object.values(dataTray).forEach(result => 
                    serviceIDs.includes(result.api_param) === false ? 
                        serviceIDs.push(result.api_param) : null
                ) : null;

            const getAPIs = () => dataTray ?
            Object.values(dataTray).forEach(result => 
                APIs.includes(result.api) === false ? 
                    APIs.push(result.api) : null
            ) : null;
        
            getAPIs();
            getServiceIDs();
            
            // Makes multiple API calls using array of
            // API urls and serviceIDs along with arrays of field keys 
            // filtered from the data tray
            APIs.filter(api => api === geoAPI )
                .map(api => {
                    const singleAPI = () => {
                        // console.log(dataTray)
                        const fields = 
                            Object.entries(dataTray)
                                .filter(([key, value]) => 
                                    value.api === geoAPI)
                                    .map(([key, value]) => key);
    
                        fields.push(joinField);
                        otherFields.map(field => fields.push(field));
                        
                        // console.log('INSIDE ALTERNATE GET DATA')
                        // console.log(fields);
                        const dataURL = `${baseURL}`;
                        const queryString = `query?where=1%3D1&outFields=${fields}&outSR=4326&f=geojson`
                        
                        fields ?
    
                        API.getData(dataURL + queryString)
                            .then(res => {
                                // console.log(res);
                                res.data.features.map(feature => {
                                    const propertiesObj = feature.properties;
                                    const featureID = propertiesObj[joinField];
                                    Object.entries(propertiesObj)
                                        .map(([key, value]) => dataObj[featureID][key] = value)
                                });
                                setHoverField(joinField);
                                // console.log(dataObj);
                                return dataObj
                            })
                            .then(dataObj => {
                                setData(dataObj)
                                // setDataLoaded(true);
                            })
                            .catch(err => console.log(err))
    
                        : console.log('No fields selected for this geog')
    
                    }

                
                defaults.data.dataAPIs[api].apiParam ?

                serviceIDs
                    .filter(serviceID => serviceID !== '')
                    .map(serviceID => {
                    // console.log('INSIDE OPENDATA GET DATA')
                    const fields = 
                        Object.entries(dataTray)
                            .filter(([key, value]) => 
                                value.api_param === serviceID &&
                                value.api === api)
                                .map(([key, value]) => key);

                    fields.push(joinField);
                    otherFields.map(field => fields.push(field));
                    const dataURL = `${baseURL}${serviceID}`;
                    const queryString =
                    `/query?where=SumLevel='${geo}'&outFields=${fields}&returnGeometry=false&f=geojson`
            

                    API.getData(dataURL + queryString)
                        .then(res => {
                            res.data.features.map(feature => {
                                const propertiesObj = feature.properties;
                                const featureID = propertiesObj.GEOID;
                                Object.entries(propertiesObj)
                                    .map(([key, value]) => dataObj[featureID][key] = value)
                            });
                            setHoverField(joinField);
                            // console.log(dataObj);
                            return dataObj
                        })
                        .then(dataObj => {
                            setData(dataObj)
                            // setDataLoaded(true);
                        })
                        .catch(err => console.log(err))
                }) : singleAPI()

            })
        }

        // API for geoJSON

        const geoJSONFields = [joinField];
        const geoJSONURL = defaults.data.geoAPIs[geoAPI].url;
        
        const geoJSONQuery = 
        geoAPI === 'OpenDataMain' ?
        `0/query?where=SumLevel='${geo}'&outSR=4326&outFields=${geoJSONFields}&f=geojson`
        : `query?where=1%3D1&outFields=${geoJSONFields}&outSR=4326&f=geojson`

        API.getData(geoJSONURL + geoJSONQuery)
            .then(res => {

                // Initiate dataObj
                var dataObj = {};

                console.log(res)

                // Map returned keys along wtih empty 
                // valueObjects to the dataOj
                res.data.features.forEach(feature =>
                    dataObj[feature.properties[geoJSONFields[0]]] = {});
                
                // set GeoJSON state without data
                setGeoJSON(res.data);

                // console.log(dataObj)
                
                // Pass along dataObj for data to be added to it
                return dataObj
            })
            .then(dataObj => addData(dataObj,geo))
            .catch(err => console.error(err)); 
    }

    useEffect(() => handleData(sumLevel, dataTray) , [sumLevel, dataTray]);
    useEffect(() => {}, [layout]);

    return (
        <Grid fluid style={{padding: '20px', height: '100vh'}}>
            
            <Row style={{height: '100%'}}>
                
                {/* Map Container */}
                
                <Col 
                    id='map-col' 
                    sm={layout.mapWidth.sm} 
                    lg={layout.mapWidth.lg} 
                    style={{
                        padding: '0',
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        height: '100%'
                    }}
                > 
                <div className='chart-control-bar-map'>
                {/* <Icon name='download' size={'large'} inverted style={{float: 'right'}} /> */}
                <Popup
                    pinned
                    hoverable
                    on='hover'
                    position='bottom right'
                    children={
                        <div
                        style={{textAlign: 'center'}}>
                            <h5>Export Image</h5>
                            <ImageExportButton
                            elementID={'map-wrapper-box'}
                            type={'png'}
                            text={'PNG'}
                            imageBGColor={'white'}
                            imageFileName={'test'}
                            />
                            <ImageExportButton
                            elementID={'map-wrapper-box'}
                            type={'jpg'}
                            text={'JPG'}
                            imageBGColor={'white'}
                            imageFileName={'test'}
                            />
                        </div>
                    }
                    trigger={
                        <Icon name='image' size={'big'} inverted style={{float: 'right'}} />
                }
                />
                </div> 
                    { layout.mapVisible ? 
                    <div id='map-wrapper-box' style={{height: '100%', width: '100%'}}>
                    <MapWrapper
                        icons={icons}
                        setIcons={setIcons}
                        scrollID={scrollID}
                        setScrollID={setScrollID}
                        setLayout={setLayout}
                        layout={layout}
                        boundingGEO={boundingGEO}
                        geo={sumLevel}
                        hoverID={hoverID}
                        handleHover={setHoverID}
                        hoverField={hoverField} 
                        primaryField={primaryField}
                        secondaryField={secondaryField}
                        setPrimaryField={setPrimaryField} 
                        data={data}
                        dataTray={dataTray}
                        geoJSON={geoJSON}
                        setSumLevel={setSumLevel}
                        colorRamp={
                            data && geoJSON ?
                            <ColorRamp 
                                primaryField={primaryField} 
                                data={data} 
                                layout={layout}
                            /> : null

                        }
                        dataButton={                
                            <ModalWrapper
                            size={'large'}
                            open={dataSelectorModal}
                            centered={false}
                            header={<h2>Browse Data</h2>}
                            trigger={
                                <Button
                                    className={ 'pulse'}
                                    onClick={() => setDataSelectorModal(true)} 
                                    color='teal'
                                >
                                    Gather Data
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
                    /> 
                    </div> : 
                        <div style={{zIndex: '99999', color: 'teal', position: 'absolute', bottom: '50%', width: '100%', textAlign: 'center'}}>
                            <h2>Map Loading...</h2>
                            <Loader id='loader-box' color='teal' type='Circles' />
                        </div> 
                    }
                    {
                        !data ?
                        <div style={{zIndex: '99999', color: 'teal', position: 'absolute', bottom: '50%', width: '100%', textAlign: 'center'}}>
                        <h2>Data Layer Loading...</h2>
                        <Loader id='loader-box' color='teal' type='Circles' />
                        </div>
                        : null
                    }
                </Col>

                {/* Side Bar */}

                {   layout.sideBarWidth.sm > 0 || 
                    layout.sideBarWidth.lg > 0 ?

                <Col 
                    className='no-scrollbar' 
                    sm={layout.sideBarWidth.sm} lg={layout.sideBarWidth.lg} 
                    style={{padding: '0 10px 0 10px', height: '100%', width: '100%', overflow: 'scroll'}}>
                
                {/* Table */}
                
                { layout.tableVisible && primaryField ? 
                    
                    data ?
                    
                    <div className='table-box'>
                        <div className='chart-control-bar' style={{marginTop: '0'}}>
                            <Icon 
                            name='close' 
                            size={'large'} 
                            inverted 
                            style={{ marginTop: '3px', float: 'left'}}
                            onClick={() => {
                                setLayout({
                                ...layout,
                                tableVisible : false
                                });
                                setIcons({
                                    ...icons,
                                    table: {
                                    ref: icons.table.ref,
                                    visible: false
                                    }
                                }) 
                            }}
                            />
                            <Popup
                            pinned
                            hoverable
                            on='hover'
                            position='bottom right'
                            children={
                                <div style={{textAlign: 'center'}}>
                                <h5>Export Data</h5>
                                <CSVExportButton
                                // {...props}
                                data={data}
                                // selectedFields={props.selectedFields}
                                text={'.CSV'}
                                color='violet'
                                basic={true}
                                // float='center'
                                height='40px'
                                // borderRadius='50%'
                                margin={'5px'}
                                />
                                </div>
                            }
                            trigger={
                                <Icon name='download' size={'large'} inverted style={{float: 'right'}} />
                            }
                            />
                            </div>
                        <div className='no-scrollbar' middle='sm' 
                            style={{
                                // margin: '0 15px 0 10px',
                                borderRadius: '0 0 10px 10px',
                                height: '90%',
                                width: '100%',
                                overflow: 'scroll',
                                backgroundColor: 'white',
                                // paddingBottom: '10px'
                            }}> 
                        
                            <TableSE
                                geo={sumLevel}
                                data={data}
                                dataTray={dataTray}
                                hoverID={hoverID}
                                handleHover={setHoverID}
                                hoverField={hoverField}
                                layout={layout}
                                MOE={MOE}
                            /> 
                        </div>
                    </div> : 
                    <div style={{position: 'relative', height: '50vh', paddingTop: '30%',width: '100%', textAlign: 'center'}}>
                        <Loader id='loader-box' color={'grey'} type='ThreeDots' />
                    </div>
                    : null
                }
                { layout.scatterPlotVisible && primaryField ? 

                    <Row center='sm' middle='sm' style={{ marginBottom: '20px', height: '40vh', width: '100%'}}>
                        { data  ? 
                        <ChartWrapper
                        icons={icons}
                        setIcons={setIcons}
                        setLayout={setLayout}
                        dataTray={dataTray}
                        dataLoaded={dataLoaded} 
                        primaryField={primaryField}
                        setPrimaryField={setPrimaryField}
                        secondaryField={secondaryField}
                        setSecondaryField={setSecondaryField}
                        data={data}
                        geo={sumLevel} 
                        layout={layout}
                        handleHover={setHoverID}
                        hoverID={hoverID} 
                        chartType={'scatterplot'}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                        <Loader id='loader-box' color={'grey'} type='ThreeDots' />
                    </div>}
                        
                    </Row> : null }
                { layout.barChartVisible && primaryField ? 

                    <Row center='sm' middle='sm' style={{ height: '40vh', width: '100%'}}>
                        { data ?
                        <ChartWrapper
                            icons={icons}
                            setIcons={setIcons}
                            setLayout={setLayout}
                            geo={sumLevel} 
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
                            <Loader id='loader-box' color={'grey'} type='ThreeDots' />
                        </div>}
                    </Row> : null }
                </Col>
                : null }
            </Row>
        </Grid>
    );
}

export default LayoutWrapper;