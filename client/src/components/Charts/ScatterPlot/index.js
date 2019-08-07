import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { Dropdown } from 'react-bootstrap';
// import dataConfig from "../../../config/dataConfig";
import colormap from 'colormap';
import numeral from 'numeral';
import './style.css';

const ScatterPlot = props => {

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
    
      const variable = parseFloat(feature.properties[props.primaryField]);
      const normalizer = props.data.normalizedBy ? parseFloat(feature.properties[props.data.normalizedBy]) : 1

      return variable/normalizer}) : null;

  const maxValue = valueArray !== null ? Math.max(...valueArray) : 'Value array not load yet';
  const minValue = valueArray !== null ? Math.min(...valueArray) : 'Value array not load yet';

  const dataArray = props.data ? props.data.features
    .filter(feature => feature.properties[props.primaryField] !== 'NA')
    .map(feature => 
      ({
        x: parseFloat(feature.properties[props.primaryField]),
        y: parseFloat(feature.properties[props.secondaryField]),
        name: feature.properties[props.hoverField]
      })
      ) : null;

  // const dataObject = dataConfig.filter(item => item.name === props.data.geography);

  // const indicatorList = dataObject && props.data.geography ? dataObject[0].variableOptions : null;

  // console.log (indicatorList);  

  return (
      <ResponsiveContainer height="90%" width="100%">
        <ScatterChart
          margin={{
            top: 40, right: 15, bottom: 20, left: 30,
          }} >
          <CartesianGrid />
          <XAxis 
            // hide
            type="number" 
            dataKey="x" 
            name={props.data ? props.primaryField : null } 
            label={{
              value: props.data ? props.primaryField : 'x',
              position: 'bottom'
            }}
            unit={null} />
          <YAxis 
            // hide
            orientation="right"
            type="number" 
            dataKey="y" 
            name={props.data ? props.secondaryField : null } 
            label={{
              value: props.data ? props.secondaryField : 'y',
              position: 'right',
              angle: -90
            }} 
            unit={null} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }} 
            animationEasing={'ease'}
            formatter={ value => 
              typeof value === 'number' ? 
              value % 1 !== 0 ? 
              numeral(value).format('0,0.00') 
              : numeral(value).format('0,0')
              : value
              }
          />
          <Scatter 
            name={props.hoverField} 
            data={dataArray} 
            onMouseEnter={point => props.handleHover(point.name)} 
            // fill={colors[0]}
            >
            {
              dataArray ? dataArray
              .filter(a => a.x !== 'NA')
              .map((feature, index) => {
                
                const value=parseFloat(feature.x);
                // const name=feature.name;

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
                  // stroke={props.hoverID && name === props.hoverID ? 'black' : null}
                  // strokeWidth={props.hoverID && name === props.hoverID ? 2 : null}
                  />
              }) : null
            }
          </Scatter>
          <Scatter 
            name={props.hoverField} 
            data={props.hoverID && dataArray ? dataArray.filter(e => e.name === props.hoverID) : null} fill={colors[numberOfBins-1]}
            >
            {
              dataArray ? dataArray.filter(e => e.name === props.hoverID).map((feature, index) => {
                
                const value=parseFloat(feature.x);
                // const name=feature.name;

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
                  stroke={'black'}
                  strokeWidth={2}
                  />
              }) : null
            }
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
  );
};

export default ScatterPlot;


