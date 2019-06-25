import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
// import Loader from 'react-loader-spinner';
import './style.css';

const DataTable = props => {

    const columns = props.fields;

    const sortField = props.sortField;
    const sortOrder = props.sortOrder;

    const featureArray = props.data ? 
                            props.data.features.map(feature => feature)
                            .sort(sortOrder === 'hilo' ? (a,b) => a.attributes[sortField] > b.attributes[sortField] ? -1 : 1 : (a,b) => a.attributes[sortField] > b.attributes[sortField] ? 1 : -1)
                            : null;
    const fieldArray = props.data ? props.data.fields : null;

    // console.log(featureArray ? featureArray : null);
    // console.log(featureArray ? fieldArray : null);

    
    return (
        <Table celled striped
        // style={{width: '100%'}}
        >
            <Table.Header
                // style={{
                // float: 'left',
                // position: 'fixed',
                // top: '10vh',
                // width: '100%',
                // zIndex: '5'}}
                >
                {columns ? columns.map((columnLabel,index) => 
                    <Table.HeaderCell 
                        // style={{
                        // width: "5%", 
                        // backgroundColor: 'darkblue', 
                        // color: 'white',
                        // height: '30px',
                        // opacity: '.8',
                        // textAlign: 'center'
                    // }}  
                        title={columnLabel}
                        value={columnLabel}
                        onClick={() => props.handleSortField(columnLabel, props.sortOrder === 'lohi' ? 'hilo' : 'lohi')}
                        >
                        {fieldArray ? fieldArray.map(item => item.name === columnLabel ? item.alias: null) : null}
                    </Table.HeaderCell>
                ) : null }

            </Table.Header>
            <Table.Body 
            // style={{float: 'left', width: '100%', overflow: 'scroll', marginTop: '14vh'}}
            >

            {featureArray ? featureArray.map((feature,index) => {
                // console.log(feature);
                return(
                    <Table.Row 
                        // style={{
                        // backgroundColor: index % 2 === 0 ? 'lightgrey' : null }}
                        >
                        {columns ? columns.map((fieldName,index) =>
                        <Table.Cell 
                            // style={{
                            // textAlign: index > 0 ? 'center' : null,
                            // // width: "5%",
                            // }}
                            >
                        {feature.attributes[fieldName]}
                        </Table.Cell>
                        ) : null }
                    </Table.Row>
                    )
            }) : null }

            </Table.Body>

        </Table>
    );
};

export default DataTable;

