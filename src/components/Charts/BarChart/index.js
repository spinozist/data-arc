import React, { useState } from 'react';
import { ComposedChart, Bar, Cell, Label, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { Dropdown } from 'react-bootstrap';
import colormap from 'colormap';
import numeral from 'numeral';
import './style.css';
// import { Label } from 'semantic-ui-react';



const SimpleBarChart = props => {

  const [ sortOrder, setSortOrder] = useState('lohi');

  // console.log('BAR CHART PROPS...')
  // console.log(props)

  const numberOfBins = props.layout.numberOfBins;
  const colorMap = props.layout.colorMap;
  const reverse = props.layout.colorMapReverse;
  const primaryField = props.primaryField;


  let colors = colormap({
    colormap: colorMap,
    nshades: numberOfBins,
    format: 'hex',
    alpha: 1
  });

  colors = reverse ? colors.reverse() : colors;

  const valueArray = props.data ? Object.entries(props.data)
  .filter(([key, value]) => value[primaryField] !== 'NA' && value[primaryField] !== 'NA' && value[primaryField] !== null)
  .map(([key,value]) => {

    return parseFloat(value[primaryField])
    }) : null;

  const maxValue = valueArray !== null ? Math.max(...valueArray) : 'Value array not load yet';
  const minValue = valueArray !== null ? Math.min(...valueArray) : 'Value array not load yet';

  const dataArray = props.data ? Object.entries(props.data)
  .filter(([key, value]) => value[primaryField] !== 'N/A' || value[primaryField] !== 'NA' || value[primaryField] !== null)
  .map(([key,value]) => 
  ({
      x: parseFloat(value[primaryField]),
      name: value['NAME'],
      id: value[props.hoverField]
      })
      ).sort(sortOrder === 'lohi' ? (a,b) => a.x > b.x ? 1 : -1 : (a,b) => a.x < b.x ? 1 : -1 ) : null;
  
  
  // console.log(dataArray);

  return (
    <ResponsiveContainer id='diagram' key={"rc-bar-chart-container"} height="90%" width="95%">
     <ComposedChart
        key={"cc-bar-chart"}
        data={dataArray}
        margin={{
          top: 30, right: 20, bottom: 20, left: 30,
        }}>
        {/* <XAxis name={'bar-chart-axis'} dataKey="name" /> */}
        <YAxis 
          orientation='right' 
          name={primaryField} 
          dataKey='x'
          label={{
            value: props.dataTray ? props.dataTray[primaryField].text : 'y',
            position: 'right',
            angle: -90,

          }}
        />

        {/* <XAxis type='category' tick='false' dataKey='name'/> */}
        <Bar 
          key={"bar-" + primaryField}
          name={primaryField} 
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
      
              // console.log(primaryField);
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
          key={"tooltip-" + primaryField}
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


