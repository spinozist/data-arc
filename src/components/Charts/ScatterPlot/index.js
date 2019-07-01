import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Dropdown } from 'react-bootstrap';
import dataConfig from "../../../config/dataConfig";
import colormap from 'colormap';
import numeral from 'numeral';
import './style.css';



const ScatterPlot = props => {

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

  const valueArray = props.data.geojson ? props.data.geojson
    .filter(feature => feature.properties[props.data.selectedVariable])
    .map(feature => {
  
      const variable = feature.properties[props.data.selectedVariable];
      const normalizer=props.data.normalizedBy ? feature.properties[props.data.normalizedBy] : 1

        return variable/normalizer}) : null;

  const maxValue = valueArray !== null ? Math.max(...valueArray) : 'Value array not load yet';
  const minValue = valueArray !== null ? Math.min(...valueArray) : 'Value array not load yet';

  const dataArray = props.data.geojson ? props.data.geojson.map(feature => 
    ({
      x: feature.properties[props.data.selectedVariable],
      y: feature.properties[props.data.selectedSecondVar],
      name: feature.properties[props.data.hoverField]
    })
    ) : null;

  const dataObject = dataConfig.filter(item => item.name === props.data.geography);

  const indicatorList = dataObject && props.data.geography ? dataObject[0].variableOptions : null;

  // console.log (indicatorList);  

  return (
    <div
      className="chart-container" >
      <ResponsiveContainer height="100%" width="100%">
        <ScatterChart
          margin={{
            top: 40, right: 10, bottom: 5, left: 15,
          }} >
          <CartesianGrid />
          <XAxis 
            hide
            type="number" 
            dataKey="x" 
            name={props.data ? props.data.selectedVariable : null } 
            label={{
              value: props.data ? props.data.selectedVariable : 'x',
              position: 'bottom'
            }}
            unit={null} />
          <YAxis 
            hide
            orientation="right"
            type="number" 
            dataKey="y" 
            name={props.data ? props.data.selectedSecondVar : null } 
            label={{
              value: props.data ? props.data.selectedSecondVar : 'y',
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
            name={props.data.hoverField} 
            data={dataArray} 
            onMouseEnter={point => props.handleHoverID(point.name)} 
            // fill={colors[0]}
            >
            {
              dataArray ? dataArray.map((feature, index) => {
                
                const value=feature.x;
                // const name=feature.name;

                // console.log(feature);
        
                // console.log(props.data.selectedVariable);
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
            name={props.data.hoverField} 
            data={props.hoverID && dataArray ? dataArray.filter(e => e.name === props.hoverID) : null} fill={colors[numberOfBins-1]}
            >
            {
              dataArray ? dataArray.filter(e => e.name === props.hoverID).map((feature, index) => {
                
                const value=feature.x;
                // const name=feature.name;

                // console.log(feature);
        
                // console.log(props.data.selectedVariable);
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
      <Dropdown 
        style={{ 
          float: 'center',
          margin: '5px 0 0 10px'}}>
        <Dropdown.Toggle variant="secondary" className="category-dropdown" id="dropdown-basic">
          Change Y Variable
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{
            overflow: 'scroll',
            maxHeight: '30vh',
          }}>
          {  indicatorList ? indicatorList.map(option => 
            <Dropdown.Item
              style={{
                backgroundColor: option === props.data.selectedSecondVar ? 'black' : null,
                color: option === props.data.selectedSecondVar ? 'white' : null,
                marginLeft: '2%'
              }} 
              value={option} 
              onClick={e => props.handleSecVarChange(option)}
            >
              {option}
            </Dropdown.Item>
          ) : null
          }
        </Dropdown.Menu>
        </Dropdown>

    </div>
  );
};

export default ScatterPlot;


