import React, {useEffect} from 'react';
import { Checkbox, Popup, Button } from 'semantic-ui-react';
import { HuePicker, SketchPicker, CirclePicker } from 'react-color';
import './style.css';

const BoundaryLayerLegend = props => {

    const legendInfo = props.legendInfo;

    const updateSymbolStyle = () => {
        Object.entries(legendInfo).forEach(([key,data]) => {
            const style = data.style;
            document.getElementById(key + 'symbol').style.borderWidth = style.borderWeight + 'px';
            document.getElementById(key + 'symbol').style.borderColor = style.borderColor;
        })
        
    }

    useEffect(() => console.log(legendInfo), [legendInfo]);
    useEffect(() => updateSymbolStyle(), [legendInfo]);

    return (
        <div 
            style={{
                marginBottom: '5px',
                backgroundColor: 'white',
                padding: '5px',
                width: '400px',
                borderRadius: '10px',
                overflow: 'auto'
            }}>

        <h2>Boundary Layer(s)</h2>
        {Object.entries(legendInfo).map(([key, data]) => 
            <div key={key + 'legend-entry'} style={{float: 'left', width: '100%', paddingLeft: '10%'}}>
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

                <div style={{float: 'left', width: '95%'}}>
                    <h4 style={{paddingLeft: '10px',width: '30%', float: 'left'}}>{key}</h4>
                    
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
                        basic
                        on='hover'
                        hoverable
                        inverted 
                        children=
                        {
                        <div>
                        <h4>Edit {key} Layer</h4>
                        <Button 
                            onClick={
                                () => {
                                    const currentStyle = data.style;
                                    console.log(data)
                                    props.setBoundaryLayerInfo({
                                    ...legendInfo,
                                    [key]: {
                                        ...data,
                                        style: {
                                            ...data.style,
                                            borderType: currentStyle.borderType === 'dashed' ? 'solid' : 'dashed'
                                        }
                                    } 
                                    })
                                }
                        }
                        >
                            Change Type
                        </Button>
                        <SketchPicker
                            disableAlpha
                            color={data.style.borderColor}
                            onChange={e => {
                                console.log(e.hex)
                                props.setBoundaryLayerInfo({
                                    ...legendInfo,
                                    [key]: {
                                        ...data,
                                        style: {
                                            ...data.style,
                                            borderColor: e.hex
                                        }
                                    } 
                                    })
                            }
                                } />
                            Change Thickness    
                            <Button size='mini' circular icon='minus' onClick={() => {
                                const current = data.style.borderWeight;
                                console.log(current);                                
                                props.setBoundaryLayerInfo({
                                    ...legendInfo,
                                    [key]: {
                                        ...data,
                                        style: {
                                            ...data.style,
                                            borderWeight: data.style.borderWeight - .5
                                        }
                                    } 
                                    })
                            }
                                }/>
                            <Button size='mini' circular icon='add' onClick={() => {
                                const current = data.style.borderWeight;
                                console.log(current);
                                props.setBoundaryLayerInfo({
                                    ...legendInfo,
                                    [key]: {
                                        ...data,
                                        style: {
                                            ...data.style,
                                            borderWeight: data.style.borderWeight + .5
                                        }
                                    } 
                                    })
                            }
                                }/>
                            
                        </div>} 
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
                            // <Button 
                            //         circular fitted  
                            //         style={{float: 'left'}} 
                            //         size='tiny' 
                            //         icon='paint brush'/>
                            } />

                </div>

            </div>
                )}
        </div>
    )

}

export default BoundaryLayerLegend;