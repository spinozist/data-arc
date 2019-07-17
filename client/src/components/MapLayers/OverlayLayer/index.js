import React from "react";
import { GeoJSON } from 'react-leaflet';
// import API from "../../utils/API";
import * as turf from '@turf/turf';



const OverlayLayer = props => {


    //Converts Polygon to LineString so overlay doesn't block GeoJson layer tooltip
    //Need to test for geometry type to handle different inputs

    const linestringData = props.data ? props.data.map(feature => turf.polygonToLine(feature)) : null;

    const borderWeight = props.borderWeight;
    const borderColor = props.borderColor;

    return (
        <GeoJSON
        // key={}
        data={props.data ? linestringData : null}
        style={{
            color: borderColor,
            weight: borderWeight,
        }}
      />
    );
};

export default OverlayLayer;