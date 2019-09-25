import React, { useState, useEffect } from 'react';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import defaults from '../../config/defaults';

import './style.css'


const TableSE = props => {

    const api = defaults.geoOptions.find(option => 
        option.value === props.geo).geoAPI;

    const apiInfo = defaults.data.dataAPIs[api];


    const joinField = apiInfo.joinField;
    const otherFields = apiInfo.otherFields;



    const dataTray = props.dataTray ? props.dataTray : null;
    const labelFields = [];
    const fields = [];

    labelFields.push(joinField)
    fields.push(joinField);
    otherFields.map(field => labelFields.push(field));
    otherFields.map(field => fields.push(field));

    Object.keys(dataTray).map(key => fields.push(key));
    // console.log(labelFields);
    const dataObj = props.data ? props.data : null;

    const [sort, setSort] = useState({field: 'NAME', direction: 'lohi'});
        

    useEffect(() => console.log(sort), [sort]);

    return (
        <StickyTable style={{width: '100%', height: '90%'}} stickHeaderCount={1}>
            <Row >
            {fields ? fields.map((columnLabel,index) => 
                <Cell
                    style={{
                        // height: '30px',
                        width: index === 0 ? '30%' : null,
                        textAlign: 'center', 
                        verticalAlign: 'middle', 
                        backgroundColor: '#d5bdbd',
                        padding: '4px'
                    }}
                    key={"column-" + columnLabel} 
                    title={columnLabel}
                    value={columnLabel}
                    onClick={() => 
                        setSort({field: columnLabel, direction: sort.direction === 'hilo' ? 'lohi' : 'hilo'})
                    }
                >
                    {   dataTray[columnLabel] ? 
                            dataTray[columnLabel].text.length > 30 ?
                                <small>{dataTray[columnLabel].text}</small> :
                                    dataTray[columnLabel].text :
                                        columnLabel 
                    }
                    
                </Cell>
            ) : null }
            </Row>

            {dataObj ? Object.entries(dataObj)
                .sort(([,a],[,b]) => {
                    const aa = !labelFields.includes(sort.field) ? parseFloat(a[sort.field]) : a[sort.field];
                    const bb = !labelFields.includes(sort.field) ? parseFloat(b[sort.field]) : b[sort.field];
                    
                
                    // equal items sort equally
                    if (aa === bb) {
                        return 0;
                    }
                    // // nulls sort after anything else
                    else if (a[sort.field] === null || a[sort.field] === 'NA' || a[sort.field] === 'N/A') {
                        return 1;
                    }
                    else if (b[sort.field] === null || b[sort.field] === 'NA' || b[sort.field] === 'N/A') {
                        return -1;
                    }
                    // // otherwise, if we're ascending, lowest sorts first
                    else if (sort.direction === 'lohi') {
                        return aa < bb ? -1 : 1;
                    }
                    // // if descending, highest sorts first
                    else { 
                        return aa < bb ? 1 : -1;
                    }
                })
                .map(([key, value], i) => {
                
                const id = key;
                return(
                    <Row
                        key={'row-'+ id + i}
                        onMouseEnter={() => props.handleHover(id)}
                        onMouseOut={() => props.handleHover()}
                        id={'row-' + id}
                    >
                        { fields ? fields.map((fieldName, j) => {
                            
                            const cellValue = value[fieldName];
                            
                            return(
                                <Cell 
                                    style={{
                                        backgroundColor: 
                                            id === props.hoverID ? 
                                                'orange' : i % 2 === 0 ? 
                                                    props.layout.tableBanding[0] : 
                                                        props.layout.tableBanding[1],
                                        textAlign: 'center',
                                        verticalAlign: 'middle'
                                    }}
                                    key={'cell' + fieldName + '-' + j}
                                >
                                    {cellValue}
                                </Cell>
                            )
                        }) : null }
                    </Row>
                    )
            })
            : null }
        </StickyTable>
    )
}

export default TableSE;