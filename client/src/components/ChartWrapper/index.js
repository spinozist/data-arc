import React, { useState, useEffect } from 'react';
import ScatterPlot from '../Charts/ScatterPlot';
import SimpleBarChart from '../Charts/BarChart';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { Button } from 'semantic-ui-react';

const ChartWrapper = props => {

const [chartType , setChartType ] = useState();
const ImageFileName = 'Test';
const ImageBGColor = 'white';

const exportIMG = (divID, type) => {
    var node = document.getElementById(divID);


    domtoimage.toBlob(node, {bgcolor: ImageBGColor})
    .then(blob => saveAs(blob, `${ImageFileName}.${type}`));
}


useEffect(() => setChartType('bar-chart'), [props.data, props.selectedVariable]);

return(
    <div id='chart-wrapper' style={{height: '100%', width: '100%'}}>
        
        {  chartType === 'scatterplot' ?
        <ScatterPlot
            key={'scatterplot'}
            {...props}
            selectedSecondVar={'TotPop_00'}
            hoverField={'GEOID'}
        />
        : null
        }

        {  chartType === 'bar-chart' ?
        <SimpleBarChart
            key={'simple-bar-chart'}
            {...props}
            hoverField={'GEOID'}
        />
        : null
        }

        {/* {  layoutState.chartType === 'area-chart' ?
        <AreaChart
            
            hoverID={hoverID} 
            data={dataState}
            layoutState={layoutState}
            handleHoverID={handleHover}

        />
        : null
        } */}

        <Button
        onClick={() => exportIMG('chart-wrapper', 'png')}
        basic
        color='teal'                    
        style={{margin: '10px', height: '40px'}}
        >
            PNG
        </Button>
        <Button
        onClick={() => exportIMG('chart-wrapper', 'jpg')}
        basic
        color='teal'                    
        style={{margin: '10px', height: '40px'}}
        >
            JPG
        </Button>
    </div>

    );
}

export default ChartWrapper;