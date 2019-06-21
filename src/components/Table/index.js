import React, { useState, useEffect } from 'react';
// import { Button } from 'react-bootstrap';
// import { ExportToCsv } from 'export-to-csv';
// import numeral from 'numeral';
// import colormap from 'colormap';
import './style.css';

const Table = props => {

    const sortField = 'mMedianAge_e';
    const sortOrder = 'hilo';

    const featureArray = props.data ? 
                            props.data.features.map(feature => feature)
                            .sort(sortOrder === 'hilo' ? (a,b) => a.attributes[sortField] > b.attributes[sortField] ? -1 : 1 : (a,b) => a.attributes[sortField] > b.attributes[sortField] ? 1 : -1)
                            : null;
    const fieldArray = props.data ? props.data.fields : null;

    console.log(featureArray ? featureArray : null);
    console.log(featureArray ? fieldArray : null);

    const [columns, setColumns] = useState(props.fields)    

    return (
        <div style={{width: '100%'}}>
            <thead style={{
                float: 'left',
                position: 'fixed',
                width: '100%'}}>
                {columns ? columns.map((columnLabel,index) => 
                    <th style={{
                        width: "5%", 
                        backgroundColor: 'darkblue', 
                        color: 'white',
                        height: '30px',
                        opacity: '.8',
                        textAlign: 'center'
                    }}  
                        title={columnLabel}
                        >
                        {fieldArray ? fieldArray.map(item => item.name === columnLabel ? item.alias: null) : null}
                    </th>
                ) : null }

            </thead>
            <tbody style={{float: 'left', width: '100%', overflow: 'scroll', marginTop: '30px'}}>

            {featureArray ? featureArray.map((feature,index) => {
                // console.log(feature);
                return(
                    <tr style={{
                        backgroundColor: index % 2 === 0 ? 'lightgrey' : null }}>
                        {columns ? columns.map((fieldName,index) =>
                        <td style={{
                            textAlign: index > 0 ? 'center' : null,
                            width: "5%",
                            }}>
                        {feature.attributes[fieldName]}
                        </td>
                        ) : null }
                    </tr>
                    )
            }) : null }

            </tbody>

        </div>
    );
};

export default Table;

