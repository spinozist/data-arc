import React, { useState } from 'react';
import { StickyTable, Row, Cell } from 'react-sticky-table';
// import numeral from 'numeral';
// import OpenDataManifest from '../../config/OpenDataManifest';
import 'react-sticky-table/dist/react-sticky-table.css';

const TableSE = props => {

    const dataTray = props.dataTray ? props.dataTray : null;
    const fields = [props.hoverField, 'NAME'];
    
    Object.keys(dataTray).map(key => fields.push(key));
    
    const dataObj = props.data ? props.data : null;

    const [sort, setSort] = useState({field: fields[3], direction: 'hilo'});
    
    return (
        <StickyTable style={{width: '100%', height: '100%'}} stickHeaderCount={1}>
            <Row >
            {fields ? fields.map((columnLabel,index) => 
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
                    onClick={() => 
                        setSort({field: columnLabel, direction: sort.direction === 'hilo' ? 'lohi' : 'hilo'})
                    }
                >
                    {dataTray[columnLabel] ? dataTray[columnLabel].text : columnLabel}
                </Cell>
            ) : null }
            </Row>

            {dataObj ? Object.entries(dataObj)
                .sort(([,a],[,b]) => 

                    sort.field === 'GEOID' || sort.field === 'NAME' ?
                    sort.direction === 'hilo' ?
                    a[sort.field] > b[sort.field] ? -1 : 1
                    : a[sort.field] < b[sort.field] ? -1 : 1 :

                    sort.direction === 'hilo' ?
                    parseFloat(a[sort.field]) > parseFloat(b[sort.field]) ? -1 : 1
                    : parseFloat(a[sort.field]) < parseFloat(b[sort.field]) ? -1 : 1
                )
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
                                        backgroundColor: id === props.hoverID ? 'orange' : i % 2 === 0 ? props.layout.tableBanding[0] : props.layout.tableBanding[1],
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