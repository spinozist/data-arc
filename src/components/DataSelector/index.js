import React, { useState, useEffect } from 'react';
import { Dropdown, Radio, Button, Icon } from 'semantic-ui-react';
import defaults from '../../config/defaults';
import dataManifest from '../../config/OpenDataManifest';
import colormap from 'colormap';
// import CSVExportButton from '../CSVExportButton';
import './style.css';




const DataSelector = props => {
    const [queryResults, setQueryResults] = useState();

    const [query, setQuery] = useState({MOE: false, manifest: 'Change', catValue: 0});
    
    const [topicOptions, setTopicOptions] = useState();

    const initialTray = props.GlobalDataTray;

    const [dataTray, setDataTray] = useState(initialTray);

    const categoryColorIndices = {
        "Change since 2000": 5,
        Demographic: 15,
        Economic: 25,
        Housing: 35,
        Social: 45
    }

    // console.log(categories);
    console.log(dataTray);

    const catColors = colormap(
        {
        colormap: 'phase',
        nshades: 50,
        format: 'hex',
        alpha: 1
        });
    
    console.log(catColors);

    const runQuery = queryObj => {
        // setQueryResults();
        console.log(queryObj)
        const manifest = queryObj ? queryObj.manifest : null;
        const category = queryObj ? queryObj.category : null; 
        const topic = queryObj ? queryObj.topic : null;
        // const MOE = queryObj ? queryObj.MOE : false;
        
        const results = manifest ? dataManifest[manifest]
            .filter(result => result.Topic !== 'N/A' )
            .filter(result => manifest === 'RaceX' ? result.Category === category : true)
            .map(result => 
            ({
                key: result.Variable,
                text: result.Long,
                value: result.Variable,
                topic: result.Topic,
                category: result.Category,
                manifest: manifest,
                MOE: result.ESTMOE === 'MOE' ? true : false,
                content: (
                    <div 
                        // style={{
                        // }}    
                    >
                    <h5>{result.Long}</h5>
                    <p>
                    Year(s): {result.Years} <br/>
                    Category: {result.Category}<br/>
                    Topic: {result.Topic}<br/>
                    Source: {result.Source}</p>
                    </div>
                )
            })) : null;
        handleTopicOptions(results);
        setQueryResults(
            results
                .filter(result => 
                topic ? result.topic === topic : true)
                .filter(result =>
                queryObj.MOE === true ? true : result.MOE === false)
            );
    }

    const handleTopicOptions = queryResults => {
        const topics = [];
        console.log(queryResults ? queryResults : null)
        const createArray = () => queryResults ? 
            queryResults.forEach(result => 
                topics.includes(result.topic) === false ? topics.push(result.topic) : null
            ) : null;
        createArray();
        console.log(topics);
        setTopicOptions(topics ? topics.map(topic => 
            ({
                key: topic,
                text: topic,
                value: topic
            })
        ) : null)
    };

    const addToDataTray = dataObj => {
        const RaceX = dataObj.manifest === 'RaceX' ? 1 : 0;
        const serviceIDs = {
            "Change since 2000": 0,
            Demographic: 1,
            Economic: 3,
            Housing: 5,
            Social: 7
        }

        
        console.log(dataObj)        
        setDataTray({
            ...dataTray,
            [dataObj.key]: 
            {
                text: dataObj.text,
                value: dataObj.value,
                category: dataObj.category,
                topic: dataObj.topic,
                manifest: dataObj.manifest,
                serviceID: serviceIDs[dataObj.category] + RaceX
            }
        });
    }
    
    const removeFromDataTray = key => {
        const tempTray = dataTray;
        delete tempTray[key];

        setDataTray({
            ...tempTray
        })
    }

        

    

    useEffect(() => runQuery(query), [query]);
    // useEffect(() => console.log(dataTray), [dataTray])
    // useEffect(() => handleTopicOptions(queryResults), [queryResults]);

    return(
    <div style={{height: '80vh', width: '100%'}}>
        <div style={{float: 'left', width: '40%'}}>

        { defaults.categoryOptions ? 
            <Dropdown
                label='Filter by Category' 
                style={{
                    float: 'left',
                        margin: '10px',
                        width: '100%',
                        height:'50px',
                        zIndex: '9999'
                }} 
                id='cat-selector' 
                value={query.catValue} 
                onChange={(event, data) => {
                    event.preventDefault()
                    // console.log(data);

                    // console.log(data);
                    const optionObject = data.options.find(option =>
                        option.value === data.value);
                    console.log(optionObject)
                    
                    setQuery({
                        MOE: query.MOE,
                        manifest: optionObject.manifest,
                        catValue: optionObject.value,
                        category: optionObject.manifest === 'RaceX' ? 
                            optionObject.subcategory 
                            : optionObject.manifest})
                    // handleTopicOptions()
                    // props.setServiceID(optionObject.value)
                }} 
                placeholder='Select Data Category' 
                selection 
                options={defaults.categoryOptions}
            />
            : null }
        { queryResults && topicOptions ? 
        <Dropdown 
            selection 
            style={{ 
                float: 'left', 
                margin: '10px', 
                height:'50px', 
                width: '100%', 
                zIndex: '1000'
            }} 
            id='topic-selector' 
            value={query ? query.topic : null} 
            onChange={(event, data) => {
                console.log(data.value)
                setQuery({...query, topic: data.value})
            }
            }
            placeholder='Select Topic' 
            options={topicOptions}
        />
        : null }
        { queryResults ? 
            <Radio 
                toggle
                checked={query.MOE ? true : false} 
                style={{
                    float: 'left',
                    margin: '10px'
                }} 
                label={'Include Margin of Error (MOE)'}
                // onClick={event => console.log(props.MOE)}
                onClick={() => setQuery({...query, MOE: query.MOE ? false : true})}
                
                // onClick={() => props.handleOptionsArray(props.data, props.serviceID, 
                //     props.MOE ? false : true)}
            /> 
        : null}

        
        {/* { props.sumLevel ? 
            <Dropdown 
                selection 
                style={{ 
                    float: 'left', 
                    margin: '10px', 
                    height:'50px', 
                    width: '100%', 
                    zIndex: '1000'
                }} 
                id='geo-selector' 
                value={props.sumLevel} 
                onChange={(event, data) => {
                    props.setPreviousServiceID(props.serviceID)
                    props.setSumLevel(data.value)
                }} 
                placeholder='Select Geography' 
                options={defaults.geoOptions}
            />
            : null } */}
        </div>

        {/* { props.data && props.selectedFields ?
            <CSVExportButton
                // {...props}
                data={props.data}
                selectedFields={props.selectedFields}
                text='CSV'
                color='teal'
                basic='true'
                // margin= <= default set to '10px'
            />
            : null } */}

        <div style={{ width: '55%', height: '60%', float: 'right', overflow: 'auto', textAlign: 'left'}}>
            { queryResults && query ?
                queryResults.map(result =>
                <div
                onClick={() => addToDataTray(result)}
                style={{
                    width: '95%',
                    opacity: dataTray ? dataTray.hasOwnProperty(result.key) ? '.5' : '1' : '1',                            
                    backgroundColor: 'lightgrey',
                    margin: '0px 5px 20px 5px',
                    padding: '20px',
                    borderRadius: '5px',

                }}>
                    {result.content}
                </div>) : null 
            }
        
        </div>
        <div style={{ marginTop: '20px', width: '100%', height: '30%', float: 'right', overflow: 'auto', textAlign: 'left'}}>
            { dataTray ?
                Object.entries(dataTray).map(([key, value]) =>
                <div
                // onClick={() => props.setPrimaryField(key)}
                // basic
                // color={}
                style={{
                    border: 'solid',
                    borderWidth: '4px',
                    opacity: '1',
                    backgroundColor: catColors[categoryColorIndices[value.category]],
                    borderColor: key === props.primaryField ? 'black' : catColors[categoryColorIndices[value.category]],
                    // color: catColors[categories.indexOf(value.category)],
                    float: 'left', borderRadius: '20px', margin: '5px', padding: '5px'}}>
                    {value.text}
                <Icon name='delete' onClick={() => removeFromDataTray(key)}                
 />
                </div>) : null 
            }
        
        </div>
        <div 
            style={{float: 'left', height: '5%', width: '100%'}}>
                <Button 
                    style={{float: 'right'}} 
                    color={'red'} 
                    onClick={() => {
                        props.setModalStatus(false)
                        props.setGlobalDataTray(initialTray)
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    style={{float: 'right'}} 
                    color={'teal'} 
                    onClick={() => {
                        props.setModalStatus(false)
                        props.setGlobalDataTray(dataTray)
                    }}
                >
                    Apply
                </Button>
        </div>
        


        {/* { props.fieldOptions ? 
            <Dropdown
                multiple 
                search 
                selection 
                style={{ 
                    float: 'right', 
                    margin: '10px', 
                    width: '100%', 
                    // height: '80%', 
                    zIndex: '999'
                }} 
                id='field-selector' 
                value={props.selectedFields} 
                onChange={(event, data) => props.setSelectedFields(data.value)} 
                placeholder='Select Fields' 
                options={props.fieldOptions}
                onLabelClick={(event, data) => props.setPrimaryField(data.value)}
            />
            : null } */}

    </div>)
}


export default DataSelector; 