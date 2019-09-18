import React, { useState, useEffect } from "react";
// import API from "../../utils/API";
import colormap from 'colormap';
import numeral from 'numeral';

const colorRampWidth = 60;
const lableWidth = (100 - colorRampWidth)/2;
const marginTop = 0;

const ColorRamp = props => {

    const [data, setData] = useState(props.data);
    // console.log(JSON.stringify(data))
    const [minValue, setMinValue] = useState();
    const [maxValue, setMaxValue] = useState();


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
        const primaryField = props.primaryField;
        console.log(primaryField)

        const valueArray = data ? Object.entries(data)
        .filter(([key, value]) => value[props.primaryField] !== 'NA' && value[props.primaryField] !== 'NA' && value[props.primaryField] !== null)
        .map(([key,value]) => {

            // console.log(key);
            // console.log(value[primaryField])

            // const featureID = key;
            // const value = data[featureID][primaryField]
            // console.log(typeof primaryField);
            // console.log(featureID);
            // console.log(valueObj);
            // console.log(valueObj);
            // const variable = value[primaryField] !== 'N/A' ? value[props.primaryField] : null;
            // const variable = parseFloat(value[props.primaryField]);
            // console.log();
            
            //   const normalizer=props.normalizedBy ? feature.properties[props.normalizedBy] : 1
            // console.log(variable ? variable : null);
            return parseFloat(value[primaryField] !== 'N/A' ? value[primaryField] : null )
        }) : null;
            
        const minValue = valueArray !== null ? Math.min(...valueArray) : 'no data';

        const maxValue = valueArray !== null ? Math.max(...valueArray) : 'no data';
        
        // console.log(valueArray);
        // console.log(minValue);
        // console.log(maxValue);

        setMinValue(minValue);
        setMaxValue(maxValue);
    
    }

    useEffect(() => handleMaxMin(), [props.data, props.primaryField])

    return (

        <div style={{ width: '100%', height: '40px'}}>
            <div
                style={{
                    // position: 'relative',
                    // bottom: '60px',
                    paddingTop: '8px',
                    borderRadius: '5px 0 0 5px',
                    // border: 'solid grey .8px',
                    color: 'white', 
                    backgroundColor: 'black', 
                    fontSize: '1.2em',
                    textAlign: 'center',
                    float: 'left',
                    height: '100%',
                    width: String(lableWidth) + '%',
                    marginTop: marginTop + 'px',
                    zIndex: '999'
                }}>
                {minValue || minValue === 0 ? numeral(minValue).format('0,0') : null}
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
                marginTop: marginTop + 'px',
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
                    color: 'white', 
                    backgroundColor: 'black', 
                    fontSize: '1.2em',
                    textAlign: 'center',
                    float: 'left',
                
                    height: '100%',
                    width: String(lableWidth) + '%',
                    marginTop: marginTop + 'px',
                    zIndex: '999'
                }}>
                {maxValue ? numeral(maxValue).format('0,0') : null}
            </div>
        </div>
    );
};

export default ColorRamp;