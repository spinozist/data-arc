import React, { useState, useEffect } from "react";
import defaults from '../../config/defaults';
import Table from '../Table';
import API from '../../utils/API'
import './style.css';

const DataWrapper = props => {

    const [layout, setLayout] = useState(defaults.layout);
    const [sumLevel, setSumLevel] = useState('City');
    const [plngRegion, setPlngRegion] = useState('ARC 20')
    const [fields, setFields] = useState(['NAME', 'GEOID', 'Female_e', 'Male_e', 'TotPop_e','mMedianAge_e', 'VotingAgeCitizen_e'])
    const [query, setQuery] = useState(`where=SumLevel='${sumLevel}'&outFields=${fields}&f=json`)
    const [data, setData] = useState();


    const getData = (url, query) => {
        API.getData(url)
            .then(res => {
                console.log(res)
                setData(res.data)
            })
            .catch(err => console.log(err));

    }

    // const keyArray = data ? data.features.map(item => Object.keys(item.attributes)) : null;
    // const valueArray = data ? data.features.map(item => Object.values(item.attributes)) : null;

    useEffect(() => getData(defaults.data.baseUrl + query), [])

    return (
        <div>
            { layout.mapView ? <div>Map Component</div> : null }
            { layout.tableView ? <Table
                                    fields={fields} 
                                    data={data}/> : null }
            { layout.chartView ? <div>Chart Component</div> : null }
        </div>);
}

export default DataWrapper;