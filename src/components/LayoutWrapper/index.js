import React, { useState, useEffect } from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TableSE from '../Table-SE';
import DataSelector from '../DataSelector';
import MapWrapper from '../MapWrapper';
import ChartWrapper from '../ChartWrapper';
// import Loader from 'react-loader-spinner';
import API from '../../utils/API'
import ColorRamp from '../Legends/ColorRamp';
import ModalWrapper from '../ModalWrapper';
import { Button } from 'semantic-ui-react';
// import NewUserForm from '../NewUserForm';
// import DataManifest from '../../config/DataManifest.json'
import OpenDataManifest from '../../config/OpenDataManifest';
import defaults from '../../config/defaults';

import './style.css';

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
    const [primaryField, setPrimaryField] = useState()
    const [secondaryField, setSecondaryField] = useState()
    const [data, setData] = useState();
    const [MOE, setMOE] = useState(defaults.data.MOE);
    const [boundingGEO, setBoundingGEO] = useState()

    const [fileType, setFileType] = useState('geojson');


    const getData = (baseurl, categoryID, geo, fields) => {
       
        const optionObject = defaults.categoryOptions.find(option =>
            option.value === categoryID)

        setLabelManifest(optionObject.manifest);

        setPrimaryField(categoryID !== prevServiceID ? 
            optionObject.primaryField : primaryField);

        setSecondaryField(categoryID !== prevServiceID ?
            optionObject.secondaryField : secondaryField);
            
        setSelectedFields(categoryID !== prevServiceID ? 
            [ 'NAME', 'GEOID', optionObject.primaryField, optionObject.secondaryField ] 
                : selectedFields);
        setData();
        
        const url = `${baseurl}${categoryID}/query?where=SumLevel='${geo}'&outFields=${fields}&f=${fileType}`;
        
        handleBoundingGeo(defaults.geoOptions.find(option => 
            option.value === geo).boundingGeo);

        API.getData(url)
            .then(res => {

                handleOptionsArray(res.data, categoryID, MOE);

                setData(res.data);

            })
            .catch(err =>
                console.log(err)
            );
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
    
    const handleOptionsArray = (data, categoryID, MOE) => {
        
        setFieldOptions();
        setMOE(MOE)

        const optionObject = defaults.categoryOptions.find(option =>
            option.value === categoryID);
        
        const optionsArray = fileType === 'json' ?
        data.fields.map(field => 
            ({
                key : field.name,
                text : field.alias,
                value : field.name
            })
        ) : fileType === 'geojson' ? 
            OpenDataManifest[optionObject.manifest]
                .filter(fieldObject => 
                    optionObject.manifest === 'RaceX' ? 
                    fieldObject.Category === 'N/A' ||
                    fieldObject.Category === optionObject.subcategory 
                    : true )
                .filter(fieldObject =>
                    !MOE ? 
                    fieldObject.ESTMOE !== 'MOE'
                    : true)
                .map((fieldObj, i) => 
                    ({
                        key : fieldObj.Variable + i,
                        text : fieldObj.Long, 
                        value : fieldObj.Variable 
                    })
        ) : fieldOptions;
    
        setFieldOptions(optionsArray);
    }

    // const downloadXLSX = data => {
    //     console.log(data);

    // }


    useEffect(() => getData(
        defaults.data.baseUrl, 
        serviceID, 
        sumLevel, 
        '*'), [serviceID, sumLevel]);
    // useEffect(() => handleOptionsArray(data, serviceID, MOE), [MOE]);
    
    return (
        <Grid fluid style={{padding: '20px', height: '100vh'}}>

            <Row style={{height: '100%'}}>
                <Col id='map-col' sm={layout.mapWidth.sm} lg={layout.mapWidth.lg} style={{padding: '5px', borderRadius: '10px', backgroundColor: 'white', height: '96%'}}>  
                    { layout.mapVisible ? 
                    <MapWrapper
                        colorRamp={<ColorRamp primaryField={primaryField} data={data} layout={layout} />}
                        setLayout={setLayout}
                        layout={layout}
                        dataButton={                
                            <ModalWrapper
                            header={<h2>Browse Data</h2>} 
                            trigger={<Button color='teal'>Browse Data</Button>} 
                            content={
                                <DataSelector
                                    setServiceID={setServiceID}
                                    setSelectedFields={setSelectedFields}
                                    setFieldOptions={setFieldOptions}
                                    setLabelManifest={setLabelManifest}
                                    setSumLevel={setSumLevel}
                                    setPrimaryField={setPrimaryField}
                                    serviceID={serviceID}
                                    sumLevel={sumLevel}
                                    data={data}
                                    selectedFields={selectedFields}
                                    fieldOptions={fieldOptions}
                                    hoverField={hoverField}
                                    MOE={MOE}
                                    handleOptionsArray={handleOptionsArray}
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
                        data={data}
                        labelManifest={labelManifest} /> 
                    : <h1>Map not loading</h1> }
                </Col>
                <Col className='no-scrollbar' sm={layout.sideBarWidth.sm} lg={layout.sideBarWidth.lg} style={{height: '100%', width: '100%', overflow: 'scroll'}}>
                { layout.tableVisible && data && primaryField ?
                    <Row className='no-scrollbar' middle='sm' style={{margin: '5px', height: '50%', width: '100%', overflow: 'scroll'}}>
                        <TableSE
                            selectedFields={selectedFields} 
                            data={data}
                            sortField={sortField}
                            handleSortField={handleSortField}
                            sortOrder={sortOrder}
                            hoverID={hoverID}
                            handleHover={setHoverID}
                            hoverField={hoverField}
                            labelManifest={labelManifest}
                            layout={layout}
                            MOE={MOE}
                        />
                    </Row> : null }
                        {/* : 
                        <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='Grid' />
                        </div>} */}
                    { layout.scatterPlotVisible && data && primaryField ? 

                        <Row center='sm' middle='sm' style={{margin: '5px', height: '40%', width: '100%', zIndex: '99999'}}>
                            <ChartWrapper 
                                primaryField={primaryField}
                                secondaryField={secondaryField}
                                data={data} 
                                layout={layout}
                                handleHover={setHoverID}
                                hoverID={hoverID} 
                                chartType={'scatterplot'}
                            /> 
                        </Row> : null }
                    { layout.barChartVisible && data && primaryField ? 

                        <Row center='sm' middle='sm' style={{margin: '5px', height: '40%', width: '100%', zIndex: '99999'}}>
                            <ChartWrapper 
                                primaryField={primaryField}
                                secondaryField={secondaryField}
                                data={data} 
                                layout={layout}
                                handleHover={setHoverID}
                                hoverID={hoverID} 
                                chartType={'bar-chart'}
                            /> 
                        </Row> : null }
                        {/* <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                            <Loader id='loader-box' type='Audio' />
                        </div> } */}
                </Col>
            </Row>
        </Grid>
    );
}

export default LayoutWrapper;