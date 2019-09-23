import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Label, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import dataConfig from "../../../config/dataConfig";
import colormap from 'colormap';
import numeral from 'numeral';
import './style.css';

const ScatterPlot = props => {

  const numberOfBins = props.layout.numberOfBins;
  const colorMap = props.layout.colorMap;
  const reverse = props.layout.colorMapReverse;
  const primaryField = props.primaryField;
  const secondaryField = props.secondaryField ? props.secondaryField: props.primaryField 
  const [yAxisOffset, setYAxisOffset] = useState(20);
  const [yLabel, setYLabel] = useState(['Label loading...']);
  const [xAxisOffset, setXAxisOffset] = useState(20);
  const [xLabel, setXLabel] = useState(['Label loading...']);
  const labelLineHeight = 15;

  const labelBuilder = (xlabel, ylabel) => {
    
    const xlabelParsed = xlabel.match(/\b[\w']+(?:[^\w\n]+[\w']+){0,3}\b/g), 
          ylabelParsed = ylabel.match(/\b[\w']+(?:[^\w\n]+[\w']+){0,3}\b/g);

 
    setYLabel(ylabelParsed);
    setXLabel(xlabelParsed);

    setXAxisOffset(xlabelParsed.length * 15 + 5);
    setYAxisOffset(ylabelParsed.length * 15)

  }

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
        y: parseFloat(value[secondaryField]),
        name: value[props.hoverField]
      })
      ) : null;
  
  useEffect(() => labelBuilder(
    props.dataTray && props.dataTray[primaryField] ? props.dataTray[primaryField].text: 'No variable selected',
    props.dataTray && props.dataTray[secondaryField] ? props.dataTray[secondaryField].text: 'No variable selected'), 
      [primaryField, secondaryField])

  return (
      <ResponsiveContainer height="90%" width="95%">
        <ScatterChart
          margin={{
            top: 30, right: yAxisOffset, bottom: xAxisOffset, left: 30,
          }} >
          <CartesianGrid />
            <XAxis 
            // hide
              type="number" 
              dataKey="x" 
              name={props.data ? primaryField : null }
              tick={{ fontSize: '12'}} 
            >
              { props.dataTray && xLabel ?
                xLabel.map((labelLine,i) => 
                <Label dy={i * labelLineHeight} position='bottom'>
                  {labelLine}
                </Label>)
                : null
              }


            </XAxis>

            <YAxis 
            // hide
            orientation="right"
            type="number" 
            dataKey="y"
            tick={{ fontSize: '12'}}
            
            name={props.data ? secondaryField : null } 
            >
              { props.dataTray && yLabel ?
                yLabel.map((labelLine,i) => 
                <Label angle={-90} dx={i * labelLineHeight} position='right' style={{ textAnchor: 'middle'}}>
                  {labelLine}
                </Label>)
                : null
              }
              {/* <Label angle={-90} position='right' style={{ textAnchor: 'middle'}}>
                {props.dataTray ? props.dataTray[secondaryField].text : 'y'}
              </Label>
              <Label angle={-90} dx={20} position='right' style={{ textAnchor: 'middle'}}>
                {props.dataTray ? props.dataTray[secondaryField].text : 'y'}
              </Label> */}

              
            </YAxis>
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
            onMouseOver={point => props.handleHover(point.name)}
            // onMouseOut={() => props.handleHover()} 
            onClick={ point => 
            document
              .getElementById('row-' + point.name) ?
              
            document
              .getElementById('row-' + point.name)
              .scrollIntoView(
                {
                 block: 'center',
                 behavior: 'smooth'
              }) : null}
          
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
              onClick={ point => 
            document
              .getElementById('row-' + point.name) ?
              
            document
              .getElementById('row-' + point.name)
              .scrollIntoView(
                {
                  block: 'center',
                  behavior: 'smooth'
              }) : null}
            >
            {
              dataArray ? dataArray.filter(e => e.name === props.hoverID).map((feature, index) => {
                
                const value = parseFloat(feature.x);
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


