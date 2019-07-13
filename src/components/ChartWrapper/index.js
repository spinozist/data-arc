import React, { useState, useEffect } from 'react';
import ScatterPlot from '../Charts/ScatterPlot';
import SimpleBarChart from '../Charts/BarChart';

const ChartWrapper = props => {

const [chartType , setChartType ] = useState();



useEffect(() => setChartType('scatterplot'), [props.data, props.selectedVariable]);

return(
    <div style={{height: '100%', width: '100%'}}>
        {  chartType === 'scatterplot' ?
        <ScatterPlot
            key={'scatterplot'}
            {...props}
            // hoverID={props.hoverID} 
            // data={props.data}
            // layout={props.layout}
            // selectedVariable={props.selectedVariable}
            selectedSecondVar={'TotPop_00'}
            hoverField={'GEOID'}
            // handleHoverID={props.handleHover}

            // handleSecVarChange={handleSecVarChange}
        />
        : null
        }

        {  chartType === 'bar-chart' ?
        <SimpleBarChart
            key={'simple-bar-chart'}
            {...props}
            hoverField={'GEOID'}
            // hoverID={props.hoverID} 
            // data={props.data}
            // layout={props.layout}
            // selectedVariable={props.selectedVariable}
            // handleHoverID={props.handleHover}

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

    </div>

    );
}

export default ChartWrapper;