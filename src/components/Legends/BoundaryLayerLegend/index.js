import React, {useEffect, useState} from 'react';
import { Checkbox, Popup, Icon } from 'semantic-ui-react';
// import { HuePicker, SketchPicker, CirclePicker } from 'react-color';
import LayerEditor from '../../LayerEditor';
import './style.css';

const BoundaryLayerLegend = props => {

    const legendInfo = props.legendInfo;

    const [ legendOpen, setLegendOpen ] = useState(false);

    const updateSymbolStyle = () => 
        Object.entries(legendInfo).forEach(([key,data]) => {
            const style = data.style;
            const changeBorderStyle = () => legendOpen ? document.getElementById(key + 'symbol').style.borderWidth = style.borderWeight + 'px' : null;
            const changeBorderColor = () => legendOpen ? document.getElementById(key + 'symbol').style.borderColor = style.borderColor : null;
            
            changeBorderColor();
            changeBorderStyle();
        })    

    const numberOfItems = Object.keys(legendInfo).length;
    const height = 50 + numberOfItems * 40; 

    // useEffect(() => console.log(legendInfo), [legendInfo]);
    useEffect(() =>  updateSymbolStyle(), [legendInfo]);

    return (
        <div 
            style={{
                marginBottom: '5px',
                backgroundColor: props.style.backgroundColor,
                padding: props.style.padding,
                width: props.style.width,
                borderRadius: props.style.borderRadius,
                overflow: 'visible',
                height: legendOpen ? height + 'px' : null
            }}>

        <h2>Boundary Layer(s)
        <Icon name='ellipsis vertical' color={legendOpen ? 'grey' : 'black'} style={{float: 'right'}} onClick={() => setLegendOpen(legendOpen ? false : true)}/>
        </h2>
        {
        Object.entries(legendInfo).map(([key, data]) => 
            legendOpen ? <div key={key + 'legend-entry'} style={{float: 'left', width: '100%', paddingLeft: '10%'}}>
                <Checkbox 
                    style={{width: '2%', float: 'left'}}
                    onChange={() => props.setBoundaryLayerInfo({
                        ...legendInfo,
                        [key]: {
                            ...data,
                            checked: data.checked ? false : true
                            } 
                    })}
                    checked={data.checked} 
                />

                <div style={{float: 'left', width: '90%'}}>
                    <h4 style={{paddingLeft: '10px',width: '40%', float: 'left'}}>{key}</h4>
                    
                    {/* <div
                    id={key + 'symbol'} 
                    style={{
                        float: 'left',
                        height: '20px', 
                        width: '20px',
                        borderStyle: data.style.borderType, 
                        borderColor: data.style.borderColor,
                        borderWidth: data.style.borderWeight
                    }}>
                    </div> */}
                    
                    <Popup
                        // style={{ zIndex: '99999'}}
                        // basic
                        position={'right center'}
                        on='hover'
                        hoverable
                        pinned
                        // inverted
                        wide
                        children={
                            <LayerEditor 
                                {...props}
                                layer={key} 
                                data={data} 
                                legendInfo={legendInfo} />
                            } 
                        trigger={
                            <div
                            id={key + 'symbol'}
                            style={{
                                float: 'left',
                                height: '20px', 
                                width: '20px',
                                borderStyle: data.style.borderType, 
                                borderColor: data.style.borderColor,
                                borderWidth: data.style.borderWeight
                            }}>
                            </div>
                        } />

                </div>

            </div> : null
                )}
        </div>
    )

}

export default BoundaryLayerLegend;