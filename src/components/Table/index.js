import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import './style.css';

const Table = props => {

    const columns = props.fields;

    const sortField = props.sortField;
    const sortOrder = 'hilo';

    const featureArray = props.data ? 
                            props.data.features.map(feature => feature)
                            .sort(sortOrder === 'hilo' ? (a,b) => a.attributes[sortField] > b.attributes[sortField] ? -1 : 1 : (a,b) => a.attributes[sortField] > b.attributes[sortField] ? 1 : -1)
                            : null;
    const fieldArray = props.data ? props.data.fields : null;

    // console.log(featureArray ? featureArray : null);
    // console.log(featureArray ? fieldArray : null);

    
    return (
        <div style={{width: '100%'}}>
            <thead style={{
                float: 'left',
                position: 'fixed',
                top: '10vh',
                width: '100%',
                zIndex: '5'}}
                >
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
                        value={columnLabel}
                        // onClick={event => props.sort(event)}
                        >
                        {fieldArray ? fieldArray.map(item => item.name === columnLabel ? item.alias: null) : null}
                    </th>
                ) : null }

            </thead>
            <tbody style={{float: 'left', width: '100%', overflow: 'scroll', marginTop: '14vh'}}>

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

