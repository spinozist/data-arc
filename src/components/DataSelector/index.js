import React, { useState, useEffect } from 'react';
import { Dropdown, Radio, Button, Icon, Input } from 'semantic-ui-react';
import defaults from '../../config/defaults';

import testDataManifest from '../../config/datamanifest';
import colormap from 'colormap';
// import CSVExportButton from '../CSVExportButton';
import './style.css';



const DataSelector = props => {

    const [showFilters, setShowFilters] = useState(false);

    // console.log(testDataManifest.map((item, i) => i < 10 ? item : null))

    const [queryResults, setQueryResults] = useState();

    const [query, setQuery] = useState({MOE: false, manifest: 'Change', catValue: 0});
    
    const [topicOptions, setTopicOptions] = useState();

    const initialTray = props.GlobalDataTray;

    const [dataTray, setDataTray] = useState(initialTray);

    const [search, setSearch] = useState();

    const categoryColorIndices = {
        "Change since 2000": 0,
        Demographic: 15,
        Economic: 25,
        Housing: 35,
        Social: 45
    }

    const catColors = colormap(
        {
        colormap: 'summer',
        nshades: 50,
        format: 'hex',
        alpha: 1
        });
    
    const runQuery = queryObj => {

        // console.log(queryObj)

        // const searchArray = queryObj.search ? queryObj.search.split(" ") : null

        // console.log(searchArray);
        // const manifest = queryObj ? queryObj.manifest : null;
        // const category = queryObj ? queryObj.category : null; 
        // const topic = queryObj ? queryObj.topic : null;
        
        const results = queryObj ? testDataManifest
            .filter(result => result.Topic !== 'N/A')
            .map(result => 
            ({
                key: result.Variable,
                text: result.Long,
                value: result.Variable,
                topic: result.Topic,
                category: result.Category,
                source: result.Source,
                type: result.Type,
                manifest: result.Topic.includes('x Race') ? 'RaceX' : result.Category,
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
        // handleTopicOptions(results);
        setQueryResults(
            results ? results
                // .filter(result => 
                // topic ? result.topic === topic : true)
                .filter(result =>
                queryObj.MOE === true ? true : result.MOE === false)
             : null );
    }

    // const handleTopicOptions = queryResults => {
    //     const topics = [];
    //     console.log(queryResults ? queryResults : null)
    //     const createArray = () => queryResults ? 
    //         queryResults.forEach(result => 
    //             topics.includes(result.topic) === false ? topics.push(result.topic) : null
    //         ) : null;
    //     createArray();
    //     console.log(topics);
    //     setTopicOptions(topics ? topics.map(topic => 
    //         ({
    //             key: topic,
    //             text: topic,
    //             value: topic
    //         })
    //     ) : null)
    // };

    const addToDataTray = dataObj => {
        
        const RaceX = dataObj.manifest === 'RaceX' ? 1 : 0;
        const serviceIDsByCategory = {
            "Change since 2000": 0,
            Demographic: 1,
            Economic: 3,
            Housing: 5,
            Social: 7
        }

        setDataTray({
            ...dataTray,
            [dataObj.key]: 
            {
                text: dataObj.text,
                value: dataObj.value,
                category: dataObj.category,
                topic: dataObj.topic,
                manifest: dataObj.manifest,
                serviceID: serviceIDsByCategory[dataObj.category] + RaceX
            }
        });
    }
    
    const removeFromDataTray = key => {
        const tempTray = dataTray;
        // const removeSecondaryField = () => key === props.secondaryField ? props.secondaryField(props.primaryField) : null;
        // removeSecondaryField();
        delete tempTray[key];

        setDataTray({
            ...tempTray
        })
    }

    const runSearchFilter = (search, result) => {
        const searchArray =  search.split(' ');
        const booleanArray = searchArray.map(item => 
            result ? 
            result.text.toUpperCase().includes(item.toUpperCase()) ? true : 
            result.category.toUpperCase().includes(item.toUpperCase()) ? true : 
            result.topic.toUpperCase().includes(item.toUpperCase()) ? true : 
            result.source.toUpperCase().includes(item.toUpperCase()) ? true : false
            : null);

        return booleanArray.includes(false) ? false : true;
            
    }

    useEffect(() => runQuery(query), [query, search]);
    // useEffect(() => search && queryResults ? runSearchFilter(search, queryResults[0]) : console.log('No search input'), [search]);

    return(
        <div style={{height: '80vh', width: '100%'}}>
            <div id='search-results column' style={{float: 'left', width: '50%'}}>
            
                <Input
                    fluid 
                    placeholder='Search...'
                    value={search}
                    onChange={(e, data) => setSearch(data.value)}
                    style={{
                        float: 'left',
                        margin: '10px',
                        width: '100%',
                        height:'50px',
                    }}  
                />
                <div style={{ width: '100%', height: '60vh', float: 'left', overflow: 'auto', textAlign: 'left'}}>
                { queryResults && query ?
                    queryResults
                    .filter( result => search && result ? runSearchFilter(search, result) : true)

                    .map( result =>
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
                        </div>
                    ) 
                    : null
                }
            
                </div>


            </div>
  
            <div style={{ marginTop: '20px', width: '45%', height: '80%', float: 'right', overflow: 'auto', textAlign: 'left'}}>
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
                    <Icon 
                        name='delete' 
                        onClick={() => removeFromDataTray(key)}                
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

        </div>
    )
}


export default DataSelector; 