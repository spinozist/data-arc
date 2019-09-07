import React, {useEffect} from "react";
import { GeoJSON } from 'react-leaflet';
// import API from "../../utils/API";
import * as turf from '@turf/turf';



const OverlayLayer = props => {


    //Converts Polygon to LineString so overlay doesn't block GeoJson layer tooltip
    //Need to test for geometry type to handle different inputs

    const linestringData = props.data ? props.data.map(feature => turf.polygonToLine(feature)) : null;

    const borderWeight = props.style.borderWeight;
    const borderColor = props.style.borderColor;
    const borderType = props.style.borderType;

    useEffect(() => console.log('geojson refresh'), [props.style.borderType])

    return (
        <GeoJSON
        dashArray={borderType === 'dashed' ? '4' : '0'}
        color={borderColor}
        weight={borderWeight}
        data={props.data ? linestringData : null}
      />
    );
};

export default OverlayLayer;