import React, { useState, useEffect } from 'react';
import { StickyTable, Row, Cell } from 'react-sticky-table';
// import numeral from 'numeral';
import OpenDataManifest from '../../config/OpenDataManifest';
import 'react-sticky-table/dist/react-sticky-table.css';

const TableSE = props => {

    const selectedFields = props.selectedFields;

    const sortField = props.sortField;
    const sortOrder = props.sortOrder;

    const featureArray = props.data ?
        sortField === 'NAME' ? 
        props.data.features.sort(sortOrder === 'hilo' ? (a,b) => 
            a.properties[sortField] > b.properties[sortField] ? 
            -1 : 1 : (a,b) => 
                a.properties[sortField] > b.properties[sortField] ? 
            1 : -1) :
        props.data.features.sort(sortOrder === 'hilo' ? (a,b) => 
            parseFloat(a.properties[sortField]) > parseFloat(b.properties[sortField]) ? 
            -1 : 1 : (a,b) => 
                parseFloat(a.properties[sortField]) > parseFloat(b.properties[sortField]) ? 
            1 : -1) : null;
        
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
                            padding: '4px'
                        }}
                        key={"column-" + columnLabel} 
                        title={columnLabel}
                        value={columnLabel}
                        onClick={() => props.handleSortField(columnLabel, props.sortOrder === 'lohi' ? 'hilo' : 'lohi')}
                    >
                        {columnLabel && OpenDataManifest[props.labelManifest].find(field => field.Variable === columnLabel) ? 
                            OpenDataManifest[props.labelManifest].find(field => field.Variable === columnLabel).Long : columnLabel }
                    </Cell>
                ) : null }
            </Row>

            {featureArray ? featureArray.map((feature, i) => {
                
                const id = feature.properties[props.hoverField];
                // console.log(feature);
                return(
                    <Row
                    key={'row-' + i}
                    onMouseEnter={() => props.handleHover(id)}
                    onMouseOut={() => props.handleHover()}
                    id={'row-' + id}
                    // onMouseEnter={() => props.handleHover(feature.properties[props.hoverField])}
                    >
                        {selectedFields ? selectedFields.map(fieldName => {
                            const value = feature.properties[fieldName];
                            const datatype = OpenDataManifest[props.labelManifest]
                                .find(obj => obj.Variable === fieldName).Type;
                            // console.log(datatype + '(' + typeof value + '): ' + value);

                        return(
                        <Cell 
                        style={{
                            backgroundColor: id === props.hoverID ? 'orange' : i % 2 === 0 ? props.layout.tableBanding[0] : props.layout.tableBanding[1],
                            // backgroundColor: i % 2 === 0 ? props.layout.tableBanding[0] : props.layout.tableBanding[1],
                            textAlign: 'center'
                        }}
                        key={'cell' + fieldName + '-' + feature.properties[props.hoverField]}>
                           {typeof value == 'string' && datatype === 'Count' ? 
                                parseInt(value) :
                            typeof value == 'string' && datatype === 'Percent' ? 
                                parseFloat(value) : value}
                        </Cell>
                        )}) : null }
                    </Row>
                    )
            }) : null }


            
          </StickyTable>
    )
}

export default TableSE;