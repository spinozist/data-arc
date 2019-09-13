import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import dataConfig from "../../../config/dataConfig";
import colormap from 'colormap';
import numeral from 'numeral';
import './style.css';

const ScatterPlot = props => {

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
        y: parseFloat(value[props.secondaryField]),
        name: value[props.hoverField]
      })
      ) : null;

  return (
      <ResponsiveContainer height="100%" width="100%">
        <ScatterChart
          margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }} >
          <CartesianGrid />
          <XAxis 
            // hide
            type="number" 
            dataKey="x" 
            name={props.data ? primaryField : null } 
            label={{
              value: props.dataTray ? props.dataTray[primaryField].text : 'x',
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
              value: props.dataTray ? props.dataTray[props.secondaryField].text : 'y',
              position: 'center',
              angle: -90
            }} 
            unit={null} />

          {/* <Tooltip
            cursor={{ strokeDasharray: '3 3' }} 
            animationEasing={'ease'}
            formatter={ value => 
              typeof value === 'number' ? 
              value % 1 !== 0 ? 
              numeral(value).format('0,0.00') 
              : numeral(value).format('0,0')
              : value
              }
          /> */}
          <Scatter 
            name={props.hoverField} 
            data={dataArray} 
            onMouseEnter={point => props.handleHover(point.name)} 
            // fill={colors[0]}
            >
            {
              dataArray ? dataArray
              .filter(a => a.x !== 'NA' || a.y !== 'NA' || a.x !== 'N/A' ||a.y !== 'N/A' )
              .map((feature, index) => {
                
                const value = parseFloat(feature.x);
                const distFromMin = value - minValue;
                const range = maxValue - minValue;
                const binningRatio = distFromMin/range;
                const indexRange = numberOfBins - 1;
                const color = colors[Math.floor(value === 0 ? 0 : binningRatio * indexRange)];

                return <Cell 
                  key={`cell-${index}`} 
                  fill={color} 
                  />
              }) : null
            }
          </Scatter>
          <Scatter 
            name={props.hoverField} 
            data={props.hoverID && dataArray ? 
              dataArray.filter(e => e.name === props.hoverID) : null} fill={colors[numberOfBins-1]}
            >
            {
              dataArray ? dataArray.filter(e => e.name === props.hoverID).map((feature, index) => {
                
                const value=parseFloat(feature.x);
                const distFromMin = value - minValue;
                const range = maxValue - minValue;
                const binningRatio = distFromMin/range;
                const indexRange = numberOfBins - 1;
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


