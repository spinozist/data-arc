import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import colormap from 'colormap';
import './style.css';



const AreaChartComp = props => {

  const numberOfBins = props.layoutState.numberOfBins;
  const colorMap = props.layoutState.colorMap;
  const reverse = props.layoutState.colorMapReverse;

  const colors = reverse ? colormap({
      colormap: colorMap,
      nshades: numberOfBins,
      format: 'hex',
      alpha: 1
    }).reverse() : colormap({
      colormap: colorMap,
      nshades: numberOfBins,
      format: 'hex',
      alpha: 1
    });

  // const valueArray = props.data.geojson ? props.data.geojson
  //   .filter(feature => feature.properties[props.data.selectedVariable])
  //   .map(feature => {

  //     const variable = feature.properties[props.data.selectedVariable];
  //     const normalizer=props.data.normalizedBy ? feature.properties[props.data.normalizedBy] : 1

  //       return variable/normalizer}) : null;

  // const maxValue = valueArray !== null ? Math.max(...valueArray) : 'Value array not load yet';
  // const minValue = valueArray !== null ? Math.min(...valueArray) : 'Value array not load yet';

   
  const dataArray = props.data.geojson ? 
    props.data.geojson.map(feature => 
      ({
      x: feature.properties[props.data.selectedVariable],
      name: feature.properties[props.data.hoverField],
      })
      ).sort((a,b) => a.x > b.x ? 1 : -1) : null;

      return (
    <div
      className="chart-container">
      <ResponsiveContainer height="100%" width="100%">
      <AreaChart 
          data={dataArray}
          margin={{
              top: 30, right: 10, bottom: 5, left: 15,
            }}>
          <XAxis hide name={props.data.hoverField} dataKey="name" />
          <Area 
            type="linear" 
            name={props.data.selectedVariable} 
            dataKey={'x'} 
            // onMouseEnter={item => console.log(item)} 
            fill={colors[0]} stroke="#8884d8" />
          {/* <Brush dataKey="name" height={30} stroke="#8884d8" /> */}
          <Tooltip cursor={{ strokeDasharray: '3 3' }} onMouseEnter={item => console.log(item)} animationEasing={'ease-in-out'} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComp;


