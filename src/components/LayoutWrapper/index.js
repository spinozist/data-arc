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
    const [prevServiceID, setPreviousServiceID] = useState();
    const [labelManifest, setLabelManifest] = useState('Change');
    const [sortField, setSortField] = useState('NAME');
    const [sortOrder, setSortOrder] = useState('hilo');
    const [sumLevel, setSumLevel] = useState(defaults.data.sumLevel);
    const [selectedFields, setSelectedFields] = useState(defaults.data.selectedFields);
    const [hoverField, setHoverField] = useState(defaults.data.hoverField);
    const [hoverID, setHoverID] = useState();
    const [fieldOptions, setFieldOptions] = useState();
    const [secondaryField, setSecondaryField] = useState();

    const [data, setData] = useState();

    // Test data state
    const [testData, setTestData] = useState();
    // **

    const [MOE, setMOE] = useState(defaults.data.MOE);
    const [boundingGEO, setBoundingGEO] = useState();

    const [geoJSON, setGeoJSON] = useState();

    const [dataTray, setDataTray] = useState(defaults.data.tray);
    const [primaryField, setPrimaryField] = useState(defaults.categoryOptions[0].primaryField)


    const [fileType, setFileType] = useState('geojson');

    const [dataSelectorModal, setDataSelectorModal] = useState(false);


    const getData = (baseurl, categoryID, geo, fields) => {
       
        // const optionObject = defaults.categoryOptions.find(option =>
        //     option.value === categoryID)

        // setLabelManifest(optionObject.manifest);

        // setPrimaryField(categoryID !== prevServiceID ? 
        //     optionObject.primaryField : primaryField);

        // setSecondaryField(categoryID !== prevServiceID ?
        //     optionObject.secondaryField : secondaryField);
            
        // setSelectedFields(categoryID !== prevServiceID ? 
        //     [ 'NAME', 'GEOID', optionObject.primaryField, optionObject.secondaryField ] 
        //         : selectedFields);
        // setData();
        setTestData();
        setGeoJSON();
        
        
        handleBoundingGeo(defaults.geoOptions.find(option => 
            option.value === geo).boundingGeo);

        // API for geoJSON

        const geoJSONFields = ['GEOID'];

        API.getData(`${baseurl}/0/query?where=SumLevel='${geo}'&outFields=${geoJSONFields}&f=geojson`)
            .then(res => {

                // console.log(res.data)
                var dataObj = new Object();
                res.data.features.forEach(feature => 
                    dataObj[feature.properties[geoJSONFields[0]]] = {});
                console.log(dataObj);
                // setTestData(dataObj);



                setGeoJSON(res.data)
                return dataObj
            })
            .then(dataObj => addData(dataObj))
            .catch(err => console.log(err));    

        // API for data

        console.log(dataTray)
        
        const serviceIDs = [];

        const getServiceIDs = () => dataTray ?
            Object.values(dataTray).forEach(result => 
                serviceIDs.includes(result.serviceID) === false ? serviceIDs.push(result.serviceID) : null
            ) : null;
        
        getServiceIDs();

        console.log(serviceIDs);
        
        const addData = dataObj =>  serviceIDs ?
            serviceIDs.map(serviceID => {

                const fields = Object.entries(dataTray).filter(([key, value]) => value.serviceID === serviceID).map(([key, value]) => key);

                console.log(fields);
                console.log(dataObj);

                fields.push('GEOID', 'NAME');

                const dataURL = `${baseurl}${serviceID}/query?where=SumLevel='${geo}'&outFields=${fields}&returnGeometry=false&f=${fileType}`;

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

                        // setData(res.data);
                        return dataObj
                    })
                    .then(dataObj => 
                        setTestData(dataObj))
                    .catch(err => 
                        console.log(err))
                    

            })
            : null ;
            
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
    
    // const handleOptionsArray = (data, categoryID, MOE) => {
        
    //     setFieldOptions();
    //     setMOE(MOE)

    //     const optionObject = defaults.categoryOptions.find(option =>
    //         option.value === categoryID);
        
    //     const optionsArray = fileType === 'json' ?
    //     data.fields.map(field => 
    //         ({
    //             key : field.name,
    //             text : field.alias,
    //             value : field.name
    //         })
    //     ) : fileType === 'geojson' ? 
    //         OpenDataManifest[optionObject.manifest]
    //             .filter(fieldObject => 
    //                 optionObject.manifest === 'RaceX' ? 
    //                 fieldObject.Category === 'N/A' ||
    //                 fieldObject.Category === optionObject.subcategory 
    //                 : true )
    //             .filter(fieldObject =>
    //                 !MOE ? 
    //                 fieldObject.ESTMOE !== 'MOE'
    //                 : true)
    //             .map((fieldObj, i) => 
    //                 ({
    //                     key : fieldObj.Variable + i,
    //                     text : fieldObj.Long, 
    //                     value : fieldObj.Variable 
    //                 })
    //     ) : fieldOptions;
    
    //     setFieldOptions(optionsArray);
    // }

    useEffect(() => getData(
        defaults.data.baseUrl, 
        serviceID, 
        sumLevel, 
        '*'), [
            dataTray,
            sumLevel]);
    // useEffect(() => handleOptionsArray(data, serviceID, MOE), [MOE]);
    
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
                        colorRamp={
                            testData ?
                            <ColorRamp 
                                primaryField={primaryField} 
                                data={testData} 
                                layout={layout}
                            /> : 
                            <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                                <Loader id='loader-box' type='Audio' height={40} width={100} />
                            </div>
                        }
                        setLayout={setLayout}
                        layout={layout}
                        dataButton={                
                            <ModalWrapper
                            open={dataSelectorModal}
                            centered={false}
                            header={<h2>Browse Data</h2>} 
                            trigger={<Button onClick={() => setDataSelectorModal(true)} color='teal'>Browse Data</Button>} 
                            content={
                                <DataSelector
                                    setGlobalDataTray={setDataTray}
                                    setModalStatus={setDataSelectorModal}
                                    GlobalDataTray={dataTray}
                                    setServiceID={setServiceID}
                                    setSelectedFields={setSelectedFields}
                                    setFieldOptions={setFieldOptions}
                                    setLabelManifest={setLabelManifest}
                                    setSumLevel={setSumLevel}
                                    setPrimaryField={setPrimaryField}
                                    primaryField={primaryField}
                                    serviceID={serviceID}
                                    sumLevel={sumLevel}
                                    data={data}
                                    selectedFields={selectedFields}
                                    fieldOptions={fieldOptions}
                                    hoverField={hoverField}
                                    MOE={MOE}
                                    // handleOptionsArray={handleOptionsArray}
                                    setPreviousServiceID={setPreviousServiceID}
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
                        labelManifest={labelManifest}
                        setPreviousServiceID={setPreviousServiceID}
                        setSumLevel={setSumLevel}
                        serviceID={serviceID} /> 
                    : <h1>Map not loading</h1> }
                </Col>
                {layout.sideBarWidth.sm > 0 || layout.sideBarWidth.lg > 0 ?
                <Col className='no-scrollbar' sm={layout.sideBarWidth.sm} lg={layout.sideBarWidth.lg} style={{height: '100%', width: '100%', overflow: 'scroll'}}>
                { layout.tableVisible && primaryField ?
                    <Row className='no-scrollbar' middle='sm' style={{margin: '5px', height: '50%', width: '100%', overflow: 'scroll'}}>
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
                            <Loader id='loader-box' type='Grid' />
                        </div>
                        }

                    </Row> :  null 
                }
                { layout.scatterPlotVisible && primaryField ? 

                    <Row center='sm' middle='sm' style={{margin: '5px', height: '40%', width: '100%', zIndex: '99999'}}>
                        { data  ? 
                        <ChartWrapper 
                        primaryField={primaryField}
                        secondaryField={secondaryField}
                        data={data} 
                        layout={layout}
                        handleHover={setHoverID}
                        hoverID={hoverID} 
                        chartType={'scatterplot'}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                        <Loader id='loader-box' type='Grid' />
                    </div>}
                        
                    </Row> : null }
                { layout.barChartVisible && primaryField ? 

                    <Row center='sm' middle='sm' style={{margin: '5px', height: '40%', width: '100%', zIndex: '99999'}}>
                        { data ?
                        <ChartWrapper 
                            primaryField={primaryField}
                            secondaryField={secondaryField}
                            data={data} 
                            layout={layout}
                            handleHover={setHoverID}
                            hoverID={hoverID} 
                            chartType={'bar-chart'}
                        /> : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='Grid' />
                        </div>}
                    </Row> : null }
                </Col>
                : null }
            </Row>
        </Grid>
    );
}

export default LayoutWrapper;