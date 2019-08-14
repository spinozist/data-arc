import React, { useState } from 'react';
// import API from '../../utils/API';
import { ExportToCsv } from 'export-to-csv';
import { Button } from 'semantic-ui-react';
import moment from 'moment';


const CSVExportButton = props => {

        // console.log(props);

        const csvTitle = props.csvTitle ? props.csvTitle : null;
        const csvFilename = props.csvFilename ? props.csvFilename : `download-${moment().format()}`;

        // const sortField = props.sortField;
        // const sortOrder = props.sortOrder;
    
        const featureArray = props.data && props.selectedFields ? 
            props.data.features.map(feature => {
                const entries = props.selectedFields.map(field => 
                    [field, feature.properties[field]]);
                return Object.fromEntries(entries);
            }) : console.log('No Data for CSV Button');

        const csvOptions = 
            { 
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                filename: csvFilename, 
                showTitle: false,
                // showLabels: true,
                title: csvTitle,
                useTextFile: false,
                useKeysAsHeaders: true
                // headers: csvHeaders
            };

        const csvExporter = new ExportToCsv(csvOptions);

        
        return (
            props.data ?
                <Button
                 id='csv-button'
                 basic={ props.basic ? props.basic : false }
                 color={ props.color ? props.color : 'teal'}
                 style={{ margin: props.margin ? props.margin : '10px'}}
                 onClick={featureArray ? () =>
                    // console.log(featureArray) 
                    csvExporter.generateCsv(featureArray) 
                    : console.log('No Data for CSV Button')}
                >
                    {props.text ? props.text : 'Download CSV'}
                </Button> : null 
        )

    };

export default CSVExportButton;