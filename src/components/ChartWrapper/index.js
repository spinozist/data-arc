import React, { useState, useEffect } from 'react';
import ScatterPlot from '../Charts/ScatterPlot';
import SimpleBarChart from '../Charts/BarChart';
import ImageExportButton from '../ImageExportButton';
import { Popup , Button, Dropdown, Icon } from 'semantic-ui-react';
import './style.css'
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
    <div className='chart-wrapper'>
        
        {  chartType === 'scatterplot' && props.dataLoaded && props.data ?
            <div className='inner-box'>
                <div className='chart-control-bar'>
                    <Popup
                    pinned
                    hoverable
                    on='hover'
                    position='bottom left'
                    children={
                        <div style={{ textAlign: 'center'}}>
                            <h5 style={{margin: '5px 0 5px 0'}}>
                                Horizontal Axis:
                            </h5>
                            <Dropdown
                                fluid
                                selection
                                scrolling 
                                value={props.primaryField} 
                                onChange={(event, data) => {
                                    // props.setPreviousServiceID(props.serviceID)
                                    props.setPrimaryField(data.value)
                                }} 
                                // placeholder='Select Geography' 
                                options={dataTrayOptions} />
                            <h5 style={{margin: '20px 0 5px 0'}}>
                                Vertial Axis:
                            </h5>
                            <Dropdown
                                fluid 
                                selection
                                scrolling 
                                value={props.secondaryField} 
                                onChange={(event, data) => {
                                    // props.setPreviousServiceID(props.serviceID)
                                    props.setSecondaryField(data.value)
                                }} 
                                // placeholder='Select Geography' 
                                options={dataTrayOptions} />
                        </div>    
                    }
                    trigger={ 
                        <Icon name='bars' size={'large'} inverted style={{ marginTop: '3px', float: 'left'}} />
                    } />
                    {/* <Icon name='download' size={'large'} inverted style={{float: 'right'}} /> */}
                    <Popup
                    pinned
                    hoverable
                    on='hover'
                    position='bottom right'
                    children={
                        <div style={{textAlign: 'center'}}>
                            <h5>Export Image</h5>
                            <ImageExportButton
                            elementID={'scatterplot'}
                            type={'png'}
                            text={'PNG'}
                            imageBGColor={'white'}
                            imageFileName={'test'}
                            />
                            <ImageExportButton
                            elementID={'scatterplot'}
                            type={'jpg'}
                            text={'JPG'}
                            imageBGColor={'white'}
                            imageFileName={'test'}
                            />
                        </div>
                    }
                    trigger={
                        <Icon name='image' size={'big'} inverted style={{float: 'right'}} />
                }
                />
                </div>
                <div style={{height: '100%', width: '100%'}} id={'scatterplot'}>

                    <ScatterPlot
                        id={'scatterplot'}
                        key={'scatterplot'}
                        {...props}
                        hoverField={'GEOID'}
                    />
                </div>
            </div>
        : null
        }
        

        {  chartType === 'bar-chart' ?
            <div className='inner-box'>
                <div className='chart-control-bar'>
                {/* <Icon name='download' size={'large'} inverted style={{float: 'right'}} /> */}
                <Popup
                    pinned
                    hoverable
                    on='hover'
                    position='bottom right'
                    children={
                        <div
                        style={{textAlign: 'center'}}>
                            <h5>Export Image</h5>
                            <ImageExportButton
                            elementID={'bar-chart'}
                            type={'png'}
                            text={'PNG'}
                            imageBGColor={'white'}
                            imageFileName={'test'}
                            />
                            <ImageExportButton
                            elementID={'bar-chart'}
                            type={'jpg'}
                            text={'JPG'}
                            imageBGColor={'white'}
                            imageFileName={'test'}
                            />
                        </div>
                    }
                    trigger={
                        <Icon name='image' size={'big'} inverted style={{float: 'right'}} />
                }
                />
                </div>
                <div style={{height: '100%', width: '100%'}} id={'bar-chart'}>

                    <SimpleBarChart
                        key={'simple-bar-chart'}
                        {...props}
                        hoverField={'GEOID'}
                    />
                </div>
            </div>
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