import React, { useState, useEffect } from 'react';
import ScatterPlot from '../Charts/ScatterPlot';
import SimpleBarChart from '../Charts/BarChart';
import ImageExportButton from '../ImageExportButton';
import defaults from '../../config/defaults';

const ChartWrapper = props => {

const [chartType , setChartType ] = useState();

useEffect(() => setChartType(defaults.layout.chartType), [props.data, props.selectedVariable]);

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

        <ImageExportButton
            elementID={'chart-wrapper'}
            type={'png'}
            text={'PNG'}
            imageBGColor={'white'}
            imageFileName={'test'}
        />
        <ImageExportButton
            elementID={'chart-wrapper'}
            type={'jpg'}
            text={'JPG'}
            imageBGColor={'white'}
            imageFileName={'test'}
        />
    </div>

    );
}

export default ChartWrapper;