export default {
    layout: {
        mapVisible: true,
        tableVisible: false,
        scatterPlotVisible: false,
        barChartVisible: false,
        // chartVisible: false,
        colorMap: 'temperature',
        numberOfBins: 72,
        colorMapReverse: true,
        chartType: 'bar-chart',
        colorOpacity: .8,
        tableBanding: ['#c8e4d6', '#f3eeeb'],
        mapWidth: {sm: 12, lg: 12},
        sideBarWidth: {sm: 0, lg: 0}
    },
    data: {
        tray: {
            TotPop_00: {
                category: "Change since 2000",
                text: "# Total population, 2000",
                value: "TotPop_00",
                serviceID: 0
            },
            TotalHH_00: {
                category: "Change since 2000",
                text: "# Total Households, 2000",
                value: "TotPop_00",
                serviceID: 0
            }
        },
        baseUrl: 'https://cors-anywhere.herokuapp.com/https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
        hoverField: 'GEOID',
        selectedFields: ['NAME', 'GEOID'],
        sumLevel: 'NSA',
        MOE: false,
        bounds: [[-85.4, 34.8],[-83.4, 32.8],[-84, 33]],
        tileLayers : [
            {
                name: 'OpenStreetMap Dark',
                key: 'tile-layer-dark',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap: "Map tiles by Carto, under CC BY 3.0.</a> contributors',
                url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            },
            {
                name: 'OpenStreetMap Mono',
                key: 'tile-layer-mono',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            },
            {
                name: 'OpenStreetMap Color',
                key: 'tile-layer-color',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
        ],
        overlayLayerInfo: {
            Counties: {
                name: 'Counties',
                style: {
                    borderWeight: 2,
                    borderColor: 'black',
                    borderType: 'solid'
                },
                checked: true,
                url: 'https://opendata.arcgis.com/datasets/63996663b8a040438defe56ef7ce31e3_0.geojson'
            },
            Cities: {
                name: 'Cities',
                style: {
                    borderWeight: 1,
                    borderColor: 'purple',
                    borderType: 'dashed'
                },
                checked: true,
                url: 'https://opendata.arcgis.com/datasets/0248805ea42145d3b7d7194beafcc3d7_55.geojson'
            },
            NPUs: {
                name: 'NPUs',
                style: {
                    borderWeight: 1,
                    borderColor: 'red',
                    borderType: 'solid'
                },
                checked: false,
                url: 'https://opendata.arcgis.com/datasets/91911cd123624a6b9b88cbf4266a2309_4.geojson'
            }

        }
    },
    categoryOptions: [
        {
            key: 'serviceID-0',
            text: 'Change since 2000',
            value: 0,
            manifest: 'Change',
            primaryField: 'TotPop_00',
            secondaryField: 'TotalHH_00',            
        },
        {
            key: 'serviceID-1',
            text: 'Demography',
            value: 1,
            manifest: 'Demography',
            primaryField: 'mMedianAge_e',
            secondaryField: 'rPopDensity'
            
        },
        {
            key: 'serviceID-2',
            text: 'Demography by Race & Ethnicity',
            value: 2,
            manifest: 'RaceX',
            subcategory: 'Demographic',
            primaryField: 'BlackTotPop_e'
        },
        {
            key: 'serviceID-3',
            text: 'Economy',
            value: 3,
            manifest: 'Economy',
            primaryField: 'InLabForce_e'

        },
        {
            key: 'serviceID-4',
            text: 'Economy by Race & Ethnicity',
            value: 4,
            manifest: 'RaceX',
            subcategory: 'Economic',
            primaryField: 'BlackCivLabFor1664_e'
        },
        {
            key: 'serviceID-5',
            text: 'Housing',
            value: 5,
            manifest: 'Housing',
            primaryField: 'TotalHU_e'
        },
        {
            key: 'serviceID-6',
            text: 'Housing by Race & Ehtnicity',
            value: 6,
            manifest: 'RaceX',
            subcategory: 'Housing',
            primaryField: 'BlackOccHU_e'
        },
        {
            key: 'serviceID-7',
            text: 'Social',
            value: 7,
            manifest: 'Social',
            primaryField: 'TotalHH_e'
        },
        {
            key: 'serviceID-8',
            text: 'Social by Race & Ethnicity',
            value: 8,
            manifest: 'RaceX',
            subcategory: 'Social',
            primaryField: 'BlackInCollGradSch_e'
        }
    ],
    geoOptions : [
        {
            key: 'geo-0',
            text: 'State of Georgia',
            value: 'State',
            boundingGeo: 'State' 
        },
        {
            key: 'geo-1',
            text: 'County',
            value: 'County',
            boundingGeo: 'State'  
        },        
        {
            key: 'geo-2',
            text: 'City',
            value: 'City',
            boundingGeo: 'State' 
        },
        {
            key: 'geo-3',
            text: 'GA House Districts',
            value: 'GAHouse',
            boundingGeo: 'State'  
        },
        {
            key: 'geo-4',
            text: 'GA Senate Districts',
            value: 'GASenate',
            boundingGeo: 'State'  
        },
        {
            key: 'geo-5',
            text: 'Atlanta Neighborhood Planning Units (NPUs)',
            value: 'NPU',
            boundingGeo: 'COA'  
        },
        // {
        //     key: 'geo-6',
        //     text: 'ARC 20 County',
        //     value: 'ARC20',
        //     boundingGeo: 'ARC10' 
        // },
        {
            key: 'geo-8',
            text: 'Atlanta Neighborhood Statistical Areas (NSAs)',
            value: 'NSA',
            boundingGeo: 'COA' 
        },
        {
            key: 'geo-9',
            text: 'Regional Commissions',
            value: 'RC',
            boundingGeo: 'State' 
        },
        {
            key: 'geo-10',
            text: 'Super Districts',
            value: 'SuperDistrict',
            boundingGeo: 'ARC20' 
        },
        {
            key: 'geo-7',
            text: 'US Congressional Districts',
            value: 'Congress',
            boundingGeo: 'State' 
        }
        // {
        //     key: 'geo-11',
        //     text: 'Census Tracts',
        //     value: 'Tract',
        // }
    ],
    boundingGeoURL: {
        State: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/2/query?where=GEOID=13&f=geojson',
        COA: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2019/MapServer/28/query?where=GEOID%3D1304000&f=geojson',
        ARC20: 'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/ArcGIS/rest/services/Opendata2/FeatureServer/560/query?where=1%3D1&outFields=*&outSR=4326&f=geojson',
        ARC10: 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/103/query?where=1%3D1&outFields=*&f=geojson'
    }
}