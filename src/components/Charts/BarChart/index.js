import React, { useState } from 'react';
import { ComposedChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { Dropdown } from 'react-bootstrap';
import colormap from 'colormap';
import numeral from 'numeral';
import './style.css';



const SimpleBarChart = props => {

  const [ sortOrder, setSortOrder] = useState('lohi');

  // console.log('BAR CHART PROPS...')
  // console.log(props)

  const numberOfBins = props.layout.numberOfBins;
  const colorMap = props.layout.colorMap;
  const reverse = props.layout.colorMapReverse;


  let colors = colormap({
    colormap: colorMap,
    nshades: numberOfBins,
    format: 'hex',
    alpha: 1
  });

  colors = reverse ? colors.reverse() : colors;

  const valueArray = props.data ? props.data.features
    .filter(feature => feature.properties[props.primaryField] !== 'NA')
    .map(feature => {
  
      const variable = feature.properties[props.primaryField];
      const normalizer = props.normalizedBy ? feature.properties[props.normalizedBy] : 1

        return variable/normalizer}) : null;

  const maxValue = valueArray !== null ? Math.max(...valueArray) : 'Value array not load yet';
  const minValue = valueArray !== null ? Math.min(...valueArray) : 'Value array not load yet';

  const dataArray = props.data ? props.data.features
    .filter(feature => feature.properties[props.primaryField] !== 'NA')
    .map(feature => 
      ({
      x: parseFloat(feature.properties[props.primaryField]),
      name: feature.properties['NAME'],
      id: feature.properties[props.hoverField]
      })
      ).sort(sortOrder === 'lohi' ? (a,b) => a.x > b.x ? 1 : -1 : (a,b) => a.x < b.x ? 1 : -1 ) : null;

  // console.log(dataArray);

  return (
    <ResponsiveContainer id='diagram' key={"rc-bar-chart-container"} height="90%" width="100%">
     <ComposedChart
        key={"cc-bar-chart"}
        data={dataArray}
        margin={{
          top: 40, right: 15, bottom: 20, left: 10,
        }}>
        {/* <XAxis name={'bar-chart-axis'} dataKey="name" /> */}
        <YAxis name={props.primaryField} dataKey='x' />
        <Bar 
          key={"bar-" + props.primaryField}
          name={props.primaryField} 
          dataKey={'x'} 
          fill={colors[0]}
          onMouseOver={point => props.handleHover(point.id)} 
          onMouseOut={() => props.handleHover()}
          >
          {
            dataArray ? dataArray.filter(a => a.x !== 'NA').map((feature, index) => {
              
              const value=parseFloat(feature.x);
              // const name=feature.name;
              const id=feature.id;

              // console.log(feature)

              // console.log(feature);
      
              // console.log(props.primaryField);
              const distFromMin = value - minValue;
              const range = maxValue - minValue;
              const binningRatio = distFromMin/range;
              const indexRange = numberOfBins - 1;
              // const opacity = value;
              const color = colors[Math.floor(value === 0 ? 0 : binningRatio * indexRange)];
              

              return <Cell 
                key={`cell-${index}`} 
                fill={color} 
                stroke={props.hoverID && id === props.hoverID ? 'black' : color}
                strokeWidth={props.hoverID && id === props.hoverID ? 2 : 1}
                />
            }) : null
          }
        </Bar>
        {/* <Area type="monotone" dataKey={'x'} fill="#8884d8" stroke="#8884d8" /> */}
        {/* <Brush dataKey="name" height={30} stroke="#8884d8" /> */}
        <Tooltip
          key={"tooltip-" + props.primaryField}
          itemStyle={{ color: 'black' }}
          style={{ borderRadius: '5px'}}
          cursor={{ strokeDasharray: '3 3' }} 
          animationEasing={'ease-in-out'}
          formatter={ value => 
            typeof value === 'number' ? 
            value % 1 !== 0 ? 
            numeral(value).format('0,0.00') 
            : numeral(value).format('0,0')
            : value
            } />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;


