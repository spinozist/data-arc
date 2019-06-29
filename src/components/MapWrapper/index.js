import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, LayersControl, ZoomControl, ImageOverlay } from 'react-leaflet';
import GeoJSONLayer from '../MapLayers/GeoJSONLayer';
import OverlayLayer from '../MapLayers/OverlayLayer';
// import Loader from 'react-loader-spinner';
import API from '../../utils/API.js';

const Map = props => {

  console.log(props.data);

  const [overlayData, setOverlayData] = useState({
    overlay_one: null,
    overlay_two: null,
    overlay_three: null,
  });
  

  const apiOverlayData = (url1, url2, url3) => {

    API.getData(url1)
      .then(res => {
        const data = res.data.features;
        
        // data.forEach(feature => 
        //   console.log(feature.geometry.type));

      setOverlayData({
        ...overlayData,
        overlay_one: data})
    })
      .catch(err => console.log(err));

    API.getData(url2)
      .then(res => {
        const data = res.data.features;
        // console.log(data);
        
        // data.forEach(feature => 
        //   console.log(feature.geometry.type));


      setOverlayData({
        ...overlayData,
        overlay_two: data})
    })
      .catch(err => console.log(err));
    
    API.getData(url3)
      .then(res => {
        const data = res.data.features;
        // console.log(data);
        
        // data.forEach(feature => 
        //   console.log(feature.geometry.type));


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

  return (
    <LeafletMap
      key={'leaflet-map'}
      center={[33.8, -84.3]}
      zoom={9}
      maxZoom={18}
      attributionControl={true}
      zoomControl={false}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      dragging={true}
      animate={false}
      easeLinearity={0.7}
    >
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
        name="County Boundaries"
        checked='false'>
        { overlayData.overlay_one ?
          <OverlayLayer 
          borderWeight={2}
          borderColor={"black"}
          data={overlayData.overlay_one}/> : null } 
      </LayersControl.Overlay>
      <LayersControl.Overlay 
        name="City Boundaries"
        checked='false'>
        { overlayData.overlay_two ?
          <OverlayLayer 
          borderWeight={1.5}
          borderColor={"white"}
          data={overlayData.overlay_two}/> : null } 
      </LayersControl.Overlay>
      <LayersControl.Overlay 
        name="NPU Boundaries"
        checked='false'>
        { overlayData.overlay_three ?
          <OverlayLayer 
          borderWeight={1.5}
          borderColor={"black"}
          data={overlayData.overlay_three}/> : null } 
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