import React, { useState, useEffect } from "react";
// import API from "../../utils/API";
import colormap from 'colormap';

const colorRampWidth = 80;
const lableWidth = (100 - colorRampWidth)/2

const ColorRamp = props => {

    console.log(props)

    const [maxValue, setMaxValue] = useState();
    const [minValue, setMinValue] = useState();


    const numberOfBins = props.layout.numberOfBins;
    const colorMap = props.layout.colorMap;
    const reverse = props.layout.colorMapReverse;

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

    const binWidthRatio = colorRampWidth/numberOfBins;
    const binWidth = String(binWidthRatio) + "%";

    const handleMaxMin = () => {
        const valueArray = props.data ? props.data.features
        .filter(feature => feature.properties[props.selectedVariable])
        .map(feature => {
        
          const variable = feature.properties[props.selectedVariable];
        //   const normalizer=props.normalizedBy ? feature.properties[props.normalizedBy] : 1
            console.log(variable ? variable : null);
            return variable}) : null;
    
        const maxValue = valueArray !== null ? Math.max(...valueArray) : 'no data';
        const minValue = valueArray !== null ? Math.min(...valueArray) : 'no data';
        
        setMinValue(minValue);
        setMaxValue(maxValue);
    
    }

    useEffect(() => handleMaxMin(), [props.data, props.selectedVariable])

    return (

        <div style={{width: '100%', height: '5%'}}>
            <div
                style={{
                    // position: 'relative',
                    // bottom: '60px',
                    paddingTop: '8px',
                    borderRadius: '5px 0 0 5px',
                    // border: 'solid grey .8px', 
                    backgroundColor: 'white', 
                    fontSize: '1.2em',
                    textAlign: 'center',
                    float: 'left',
                    height: '100%',
                    width: String(lableWidth) + '%',
                    marginTop: '15px',
                    zIndex: '999'
                }}>
                {minValue ? minValue : null}
            </div>
        { colors ? colors.map(color => 
            <div 
            style={{
                // position: 'relative',
                // bottom: '60px',
                float: 'left',
                height: '100%',
                backgroundColor: color,
                width: binWidth,
                marginTop: '15px',
                opacity: 1,
                zIndex: '999'
            }}
            />) : null}
                    <div
                style={{
                    // position: 'relative',
                    // bottom: '60px',
                    borderRadius: '0 5px 5px 0',
                    paddingTop: '8px',
                    // border: 'solid grey .8px', 
                    backgroundColor: 'white', 
                    fontSize: '1.2em',
                    textAlign: 'center',
                    float: 'left',
                    height: '100%',
                    width: String(lableWidth) + '%',
                    marginTop: '15px',
                    zIndex: '999'
                }}>
                {maxValue ? maxValue : null}
            </div>
        </div>
    );
};

export default ColorRamp;