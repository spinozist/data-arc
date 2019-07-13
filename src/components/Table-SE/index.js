import React, { useState, useEffect } from 'react';
 
import { StickyTable, Row, Cell } from 'react-sticky-table';
import numeral from 'numeral';

import 'react-sticky-table/dist/react-sticky-table.css';

const TableSE = props => {

    const selectedFields = props.selectedFields;

    const sortField = props.sortField;
    const sortOrder = props.sortOrder;

    const featureArray = props.data ? 
                            props.data.features.map(feature => feature)
                            .sort(sortOrder === 'hilo' ? (a,b) => a.properties[sortField] > b.properties[sortField] ? -1 : 1 : (a,b) => a.properties[sortField] > b.properties[sortField] ? 1 : -1)
                            : null;

    // const selectedFields = props.data ? props.data.fields : null;
    // console.log(sortField);


    return (
          <StickyTable style={{width: '100%', height: '100%'}} stickHeaderCount={1}>
            <Row >
                {selectedFields ? selectedFields.map((columnLabel,index) => 
                    <Cell
                        style={{
                            height: '30px',
                            textAlign: 'center', 
                            verticalAlign: 'middle', 
                            backgroundColor: '#d5bdbd',
                            padding: '2px'
                        }}
                        key={"column-" + columnLabel} 
                        title={columnLabel}
                        value={columnLabel}
                        onClick={() => props.handleSortField(columnLabel, props.sortOrder === 'lohi' ? 'hilo' : 'lohi')}
                    >
                        {columnLabel}
                    </Cell>
                ) : null }
            </Row>

            {featureArray ? featureArray.map((feature, i) => {
                return(
                    <Row
                    key={'row-' + i}
                    // onMouseEnter={props.handleHover(feature.properties[props.hoverField])}
                    >
                        {selectedFields ? selectedFields.map(fieldName => {
                            // const fieldType = selectedFields ? selectedFields.map(item => item.name === fieldName ? item.type: null) : null
                            const value = feature.properties[fieldName];
                            // console.log(feature);
                            // console.log(fieldName);
                            // const formattedValue =  fieldType === 'esriFieldTypeInteger' ? numeral(value).format('0,0') : value;
                        return(
                        <Cell 
                        // onMouseEnter={props.handleHover(feature.properties[props.hoverField])}
                        style={{backgroundColor: i % 2 === 0 ? '#c8e4d6' : '#f3eeeb'}}
                        key={'cell' + fieldName + '-' + feature.properties[props.hoverField]}>
                           {value}
                        </Cell>
                        )}) : null }
                    </Row>
                    )
            }) : null }


            
          </StickyTable>
    )
}

export default TableSE;