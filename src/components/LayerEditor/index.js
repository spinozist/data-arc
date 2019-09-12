import React, {useEffect} from 'react';
import { Button, Radio } from 'semantic-ui-react';
import { HuePicker, SketchPicker, CirclePicker } from 'react-color';
import './style.css';

const LayerEditor = props => {

    const key = props.layer;
    const data = props.data;
    const legendInfo = props.legendInfo;

    return(

    <div style={{ textAlign: 'center' }}> 
        <h3>Edit: {key} Layer</h3>
        <SketchPicker
            // disableAlpha
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
        <h4>Border Type</h4>
        Solid
        <Radio
            style={{marginLeft: '10px', marginRight: '10px'}}
            inverted
            toggle
            checked={legendInfo[key].style.borderType === 'dashed' ? true : false} 
            onChange={
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
        />
        Dashed
            {/* Dashed */}
        {/* </Button> */}
            <br />
            <h4>Border Thickness</h4>
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
            
        </div>
    )
}

export default LayerEditor