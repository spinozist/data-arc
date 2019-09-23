import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, Cell, Label, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { Dropdown } from 'react-bootstrap';
import colormap from 'colormap';
import numeral from 'numeral';
import './style.css';
// import { Label } from 'semantic-ui-react';



const SimpleBarChart = props => {

  const [ sortOrder, setSortOrder] = useState('hilo');
  const [yAxisOffset, setYAxisOffset] = useState(20);
  const [yLabel, setYLabel] = useState(['Label loading...']);
  const labelLineHeight = 15;


  const labelBuilder = (ylabel) => {
    
    const ylabelParsed = ylabel.match(/\b[\w']+(?:[^\w\n]+[\w']+){0,3}\b/g);

    setYLabel(ylabelParsed);

    setYAxisOffset(ylabelParsed.length * 15)


    // console.log(xlabelParsed);
    // console.log(ylabelParsed);

  }

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

  const dataArray = props.data ? 
  Object.entries(props.data)
    .filter(([key, value]) => value[primaryField] !== 'N/A' || value[primaryField] !== 'NA' || value[primaryField] !== null)
    .map(([key,value]) => 
      ({
        x: parseFloat(value[primaryField]),
        name: value['NAME'],
        id: value[props.hoverField]
      })
    )
    .sort(
        // sortOrder === 'lohi' ? (a,b) => a.x > b.x ? 1 : -1 : (a,b) => a.x < b.x ? 1 : -1 
        (a,b) => {
          // equal items sort equally
          if (a.x === b.x) {
              return 0;
          }
          // // nulls sort after anything else
          // else if (a.x === null || a.x === 'NA' || a.x === 'N/A') {
          //     return 1;
          // }
          // else if (b.x === null || b.x === 'NA' || b.x === 'N/A') {
          //     return -1;
          // }
          // // otherwise, if we're ascending, lowest sorts first
          else if (sortOrder === 'lohi') {
              return a.x < b.x ? -1 : 1;
          }
          // // if descending, highest sorts first
          else { 
              return a.x < b.x ? 1 : -1;
          }
        }
      ) : null;
  
  
  // console.log(dataArray);
  useEffect(() => labelBuilder(
    props.dataTray && props.dataTray[primaryField] ? props.dataTray[primaryField].text: 'No variable selected'), 
      [primaryField])


  return (
    <ResponsiveContainer id='diagram' key={"rc-bar-chart-container"} height="90%" width="95%">
     <ComposedChart
        key={"cc-bar-chart"}
        data={dataArray}
        margin={{
          top: 30, right: yAxisOffset, bottom: 20, left: 30,
        }}>
        {/* <XAxis name={'bar-chart-axis'} dataKey="name" /> */}
        <YAxis 
          orientation='right' 
          name={primaryField} 
          dataKey='x'
          tick={{ fontSize: '12'}}
          // label={{
          //   value: props.dataTray ? props.dataTray[primaryField].text : 'y',
          //   position: 'right',
          //   angle: -90,

          // }}
        >
          { props.dataTray && yLabel ?
            yLabel.map((labelLine,i) => 
            <Label angle={-90} dx={i * labelLineHeight} position='right' style={{ textAnchor: 'middle'}}>
              {labelLine}
            </Label>)
            : null
          }
        </YAxis>

        {/* <XAxis type='category' tick='false' dataKey='name'/> */}
        <Bar 
          key={"bar-" + primaryField}
          name={primaryField} 
          dataKey={'x'} 
          fill={colors[0]}
          onMouseOver={point => props.handleHover(point.id)} 
          // onMouseOut={() => props.handleHover()}
          onClick={ point => 
            document
              .getElementById('row-' + point.id) ?
              
            document
              .getElementById('row-' + point.id)
              .scrollIntoView(
                {
                 block: 'center',
                 behavior: 'smooth'
              }) : null}
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


