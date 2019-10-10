import React, { useState, useEffect } from 'react';
import { Button, Icon, Input } from 'semantic-ui-react';
// import defaults from '../../config/defaults';

import dataManifest from '../../config/datamanifest';
// import colormap from 'colormap';
// import CSVExportButton from '../CSVExportButton';
import './style.css';



const DataSelector = props => {


    const [queryResults, setQueryResults] = useState();

    const [query, setQuery] = useState({MOE: false, manifest: 'Change', catValue: 0});
    
    const initialTray = props.GlobalDataTray;

    const [dataTray, setDataTray] = useState(initialTray);

    const [search, setSearch] = useState();

    // const categoryColorIndices = {
    //     "Change since 2000": 0,
    //     Demographic: 15,
    //     Economic: 25,
    //     Housing: 35,
    //     Social: 45
    // }

    // const catColors = colormap(
    //     {
    //     colormap: 'summer',
    //     nshades: 50,
    //     format: 'hex',
    //     alpha: 1
    //     });
    
    const runQuery = queryObj => {
        
        const results = queryObj ? dataManifest
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
                universe: result.Universe,
                api: result.API,
                api_param: result.API_Param1,
                MOE: result.ESTMOE === 'MOE' ? true : false,
                content: (
                    <div>
                        <h3>{result.Long}</h3>
                    <p>
                    <strong>Year(s):</strong> {result.Years} <br/>
                    <strong>Type:</strong> {result.Type} <br/>
                    <strong>Category:</strong> {result.Category}<br/>
                    <strong>Topic:</strong> {result.Topic}<br/>
                    <strong>Source:</strong> {result.Source}<br/>
                    <strong>Universe:</strong> {result.Universe}<br/>
                    {/* <strong>Geographies:</strong>
                    <div style={{width: '100%', margin: '-5px 5px 0px 10px', padding: '5px'}}>
                    {defaults.data.dataAPIs[result.API].geographies
                        .map((geo,i) =>
                            <small>
                                {defaults.geoOptions
                                    .find(option => option.value === geo).text
                                }
                                {defaults.data.dataAPIs[result.API].geographies.length === i + 1 ? null : ' | '}
                            </small>)}
                    </div> */}
                    </p> 
                    </div>
                )
            })) : null;
        // handleTopicOptions(results);
        setQueryResults(
            results ? 
            results.filter(result =>
                queryObj.MOE === true ? true : result.MOE === false)
            : null 
        );
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
        
        // const RaceX = dataObj.manifest === 'RaceX' ? 1 : 0;
        // const serviceIDsByCategory = {
        //     "Change since 2000": 0,
        //     Demographic: 1,
        //     Economic: 3,
        //     Housing: 5,
        //     Social: 7
        // }

        setDataTray({
            ...dataTray,
            [dataObj.key]: 
            {
                text: dataObj.text,
                value: dataObj.value,
                category: dataObj.category,
                topic: dataObj.topic,
                api: dataObj.api,
                api_param: dataObj.api_param
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

    const runSearchFilter = (search, result) => {
        const searchArray =  search.split(' ');
        const booleanArray = searchArray.map(item => 
            result ? 
            result.text.toUpperCase().includes(item.toUpperCase()) ? true : 
            result.category.toUpperCase().includes(item.toUpperCase()) ? true : 
            result.topic.toUpperCase().includes(item.toUpperCase()) ? true : 
            result.source.toUpperCase().includes(item.toUpperCase()) ? true : 
            result.type.toUpperCase().includes(item.toUpperCase()) ? true : false
            : null);

        return booleanArray.includes(false) ? false : true;
            
    }

    useEffect(() => runQuery(query), [query, search]);
    // useEffect(() => search && queryResults ? runSearchFilter(search, queryResults[0]) : console.log('No search input'), [search]);

    return(
        <div style={{height: '80vh', width: '100%'}}>
            <div id='search-results column' style={{ float: 'left', width: '50%'}}>
            
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
                <div 
                    style={{ 
                        marginTop: '20px',
                        width: '100%',
                        height: '60vh',
                        float: 'left',
                        overflow: 'auto',
                        textAlign: 'left'
                    }}
                >
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
  
            <div 
                style={{ 
                    // marginTop: '20px',
                    width: '45%',
                    height: '90%',
                    float: 'right',
                    overflow: 'auto',
                    textAlign: 'left',
                    boxShadow: 'inset 0 0 5px #000000',
                    borderRadius: '10px',
                    padding: '15px'
                }}>
                { dataTray ?
                    Object.entries(dataTray).map(([key, value]) =>
                    <div
                    // onClick={() => props.setPrimaryField(key)}
                    // basic
                    // color={}
                    style={{
                        border: 'solid',
                        borderWidth: '2px',
                        opacity: key === props.primaryField || key === props.secondaryField ? '.5' : '1',
                        backgroundColor: 'lightgrey',
                        borderColor: key === props.primaryField || key === props.secondaryField ? 'black' : 'lightgrey',
                        // color: catColors[categories.indexOf(value.category)],
                        float: 'left', borderRadius: '10px', margin: '5px', padding: '5px'}}
                    >
                        {value.text}
                    { key === props.primaryField || key === props.secondaryField ?
                       null :
                       <Icon 
                        name='delete' 
                        onClick={() => removeFromDataTray(key)}                
                        />
                    }

                    </div>) : null 
                }
            
            </div>
            <div 
                style={{paddingTop: '30px', float: 'left', height: '2%', width: '100%'}}>
                    <Button 
                        style={{float: 'right'}} 
                        color={'teal'} 
                        onClick={() => {
                            props.setModalStatus(false)
                            props.setGlobalDataTray(dataTray)
                        }}
                    >
                        Apply Changes
                    </Button>
                    <Button 
                        style={{float: 'right'}} 
                        color={'red'}
                        basic 
                        onClick={() => {
                            props.setModalStatus(false)
                            props.setGlobalDataTray(initialTray)
                        }}
                    >
                        Cancel
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