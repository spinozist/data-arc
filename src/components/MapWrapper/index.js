import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, LayersControl, ZoomControl, ImageOverlay } from 'react-leaflet';
import GeoJSONLayer from '../MapLayers/GeoJSONLayer';
import OverlayLayer from '../MapLayers/OverlayLayer';
import L from 'leaflet';
// import Loader from 'react-loader-spinner';
import API from '../../utils/API.js';
import OpenDataManifest from '../../config/OpenDataManifest';

const Map = props => {

  console.log(props.boundingGEO)

  // console.log(props.data);
  // console.log(DataLabels['Social']);

  const [overlayData, setOverlayData] = useState({
    overlay_one: null,
    overlay_two: null,
    overlay_three: null,
  });

  const [bounds , setBounds] = useState();
  
  const handleBounds = boundingGEO => {
    const pointArray = boundingGEO ? 
      boundingGEO.features[0].geometry.type === 'MultiPolygon' ?
      boundingGEO.features[0].geometry.coordinates[0][0]
      : boundingGEO.features[0].geometry.coordinates[0]
      : [[-85.4, 34.8],[-83.4, 32.8],[-84, 33]];
    
    const lngArray = pointArray.map(point => parseFloat(point[0]));
    const latArray = pointArray.map(point => parseFloat(point[1]));
    const maxLng = Math.max.apply(Math, lngArray);
    const maxLat = Math.max.apply(Math,latArray);
    const minLng = Math.min.apply(Math,lngArray);
    const minLat = Math.min.apply(Math,latArray);

    const bounds = [[maxLat, minLng],[minLat,maxLng]]
    
    console.log(lngArray);
    console.log(latArray);
    console.log(maxLng)
  
    console.log(bounds);

    setBounds(bounds)
  }

  const apiOverlayData = (url1, url2, url3) => {

    API.getData(url1)
      .then(res => {
        const data = res.data.features;
        
      setOverlayData({
        ...overlayData,
        overlay_one: data})
    })
      .catch(err => console.log(err));

    API.getData(url2)
      .then(res => {
        const data = res.data.features;

      setOverlayData({
        ...overlayData,
        overlay_two: data})
    })
      .catch(err => console.log(err));
    
    API.getData(url3)
      .then(res => {
        const data = res.data.features;

      setOverlayData({
        ...overlayData,
        overlay_three: data})
    })
      .catch(err => console.log(err));
  }

  useEffect(() => apiOverlayData(
    'https://opendata.arcgis.com/datasets/63996663b8a040438defe56ef7ce31e3_0.geojson',
    'https://opendata.arcgis.com/datasets/0248805ea42145d3b7d7194beafcc3d7_55.geojson',
    'https://opendata.arcgis.com/datasets/91911cd123624a6b9b88cbf4266a2309_4.geojson'
    ), [])

  useEffect(() => handleBounds(props.boundingGEO), [props.boundingGEO])

  return (
    <LeafletMap
      key={'leaflet-map'}
      // center={[33.8, -84.4]}
      // zoom={10.5}
      bounds={bounds}
      maxZoom={18}
      attributionControl={true}
      zoomControl={false}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      dragging={true}
      animate={false}
      // easeLinearity={0.7}
    >
        <div style={{
                border: 'solid grey .8px', 
                backgroundColor: 'white', 
                textAlign: 'center', 
                width: '60%', 
                borderRadius: '5px', 
                padding: '10px', 
                position: 'absolute', 
                top: '12px', 
                left: '20%', 
                zIndex: '998',
                opacity: '.9'
                }}>
            <h2>
              {
                props.data && props.primaryField && props.labelManifest ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField) ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField).Long :
                'No Variable Selected'
                // DataManifest.map(item => item.Variable === props.primaryField ? item.Long : null)
                : 'No Variable Selected'
              }</h2>
            <p>
              {
                props.data && props.primaryField && props.labelManifest ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField) ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField).Source :
                null
                // DataManifest.map(item => item.Variable === props.primaryField ? item.Long : null)
                : null
              }
            </p>
        </div>
        <ZoomControl position="topright" />



      { props.data ?
       <GeoJSONLayer {...props}/> : null }

      {/* <ImageOverlay
        url={
        <Loader 
          type="Puff"
          color="#00BFFF"
          height="100"	
          width="100"
      />}
      bounds={[[34, -84.5], [33.6, -84.1]]} 
      attribution={'react-loader-spinner'}
      opacity={1}
      /> */}

    <LayersControl position="topleft">
      <LayersControl.BaseLayer name="OpenStreetMap Dark">
        <TileLayer
          key={'tile-layer-dark'} 
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap: "Map tiles by Carto, under CC BY 3.0.</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OpenStreetMap Mono">
        <TileLayer
          key={'tile-layer-mono'}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OpenStreetMap Color">
        <TileLayer
          key={'tile-layer-color'}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.Overlay 
        name="NPU Boundaries"
        checked={true}>
        { overlayData.overlay_three ?
          <OverlayLayer 
          borderWeight={1.5}
          borderColor={"black"}
          data={overlayData.overlay_three}/> : null } 
      </LayersControl.Overlay>
      <LayersControl.Overlay 
        name="County Boundaries"
        checked={false}>
        { overlayData.overlay_one ?
          <OverlayLayer 
          borderWeight={2}
          borderColor={"black"}
          data={overlayData.overlay_one}/> : null } 
      </LayersControl.Overlay>
      <LayersControl.Overlay 
        name="City Boundaries"
        checked={false}>
        { overlayData.overlay_two ?
          <OverlayLayer 
          borderWeight={1.5}
          borderColor={"white"}
          data={overlayData.overlay_two}/> : null } 
      </LayersControl.Overlay>
    </LayersControl>

       
      <TileLayer
      key={'tile-layer-default'}
      // url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
     

    </LeafletMap>

  );
};

export default Map;