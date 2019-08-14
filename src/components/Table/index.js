import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import numeral from 'numeral';
// import Loader from 'react-loader-spinner';
import './style.css';

const DataTable = props => {

    const selectedFields = props.selectedFields;

    const sortField = props.sortField;
    const sortOrder = props.sortOrder;

    const featureArray = props.data ? 
                            props.data.features.map(feature => feature)
                            .sort(sortOrder === 'hilo' ? (a,b) => a.properties[sortField] > b.properties[sortField] ? -1 : 1 : (a,b) => a.properties[sortField] > b.properties[sortField] ? 1 : -1)
                            : null;

    // const fieldArray = props.data ? props.data.fields : null;
    console.log(sortField);

        
    return (
        <Table 
        style={{
            borderRadius: '5px' ,
            marginLeft: '15px', 
            height: '100%', 
            width: '100%',
            float: 'left'
            }}
        celled 
        striped 
        sortable
        selectable
        >

            <Table.Header >
                {selectedFields ? selectedFields.map((columnLabel,index) => 
                    <Table.HeaderCell
                        key={"column-" + columnLabel} 
                        title={columnLabel}
                        value={columnLabel}
                        onClick={() => props.handleSortField(columnLabel, props.sortOrder === 'lohi' ? 'hilo' : 'lohi')}
                    >
                        {selectedFields ? selectedFields.map(item => item.name === columnLabel ? item.alias: columnLabel) : columnLabel}
                    </Table.HeaderCell>
                ) : null }

            </Table.Header>
            <Table.Body>

            {featureArray ? featureArray.map((feature, i) => {
                return(
                    <Table.Row 
                    key={'row-' + i}
                    // onMouseEnter={props.handleHover(feature.properties[props.hoverField])}
                    >
                        {selectedFields ? selectedFields.map(fieldName => {
                            const fieldType = selectedFields ? selectedFields.map(item => item.name === fieldName ? item.type: null) : null
                            const value = feature.properties[fieldName]
                            const formattedValue =  fieldType === 'esriFieldTypeInteger' ? numeral(value).format('0,0') : value;
                        return(
                        <Table.Cell 
                        // onMouseEnter={props.handleHover(feature.properties[props.hoverField])}

                        key={'cell' + fieldName + '-' + feature}>
                           {formattedValue}
                        </Table.Cell>
                        )}) : null }
                    </Table.Row>
                    )
            }) : null }

            </Table.Body>

        </Table>
    );
};

export default DataTable;

