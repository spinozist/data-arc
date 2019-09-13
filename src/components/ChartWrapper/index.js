import React, { useState, useEffect } from 'react';
import ScatterPlot from '../Charts/ScatterPlot';
import SimpleBarChart from '../Charts/BarChart';
// import ImageExportButton from '../ImageExportButton';
import { Popup , Button, Dropdown } from 'semantic-ui-react';

// import defaults from '../../config/defaults';

const ChartWrapper = props => {

const [chartType , setChartType ] = useState();

const dataTrayOptions = Object.entries(props.dataTray).map(([key, value]) =>
({
   key: key,
   text: value.text,
   value: key
})
);

useEffect(() => setChartType(props.chartType), [props.data, props.selectedVariable]);

return(
    <div id='chart-wrapper' style={{margin: '5px', borderRadius: '10px', backgroundColor: 'white', height: '100%', width: '100%'}}>
        
        {  chartType === 'scatterplot' && props.dataLoaded && props.data ?
        <ScatterPlot
            key={'scatterplot'}
            {...props}
            hoverField={'GEOID'}
        />
        : null
        }
        {
            chartType === 'scatterplot' && props.dataLoaded && props.data ?
            <Popup
            position={'left center'}
            on='hover'
            hoverable
            pinned  
            children={props.dataTray ? 
                <Dropdown 
                    selection
                    scrolling 
                    value={props.secondaryField} 
                    onChange={(event, data) => {
                        // props.setPreviousServiceID(props.serviceID)
                        props.setSecondaryField(data.value)
                    }} 
                    // placeholder='Select Geography' 
                    options={dataTrayOptions} /> : null
              }
            trigger={<Button>Change Y-axis</Button>} />
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

        {/* <ImageExportButton
            elementID={'root'}
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
        /> */}
    </div>

    );
}

export default ChartWrapper;