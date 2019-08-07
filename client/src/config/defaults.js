export default {
    layout: {
        mapVisible: true,
        tableVisible: true,
        chartVisible: true,
        colorMap: 'temperature',
        numberOfBins: 72,
        colorMapReverse: true,
        chartType: 'scatterplot',
        colorOpacity: .8,
        tableBanding: ['#c8e4d6', '#f3eeeb']
    },
    data: {
        baseUrl: 'https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
        hoverField: 'GEOID',
        selectedFields: ['NAME', 'GEOID'],
        sumLevel: 'NSA',
        MOE: false
    },
    categoryOptions: [
        {
            key: 'serviceID-0',
            text: 'Change since 2000',
            value: 0,
            manifest: 'Change',
            primaryField: 'TotPop_00',
            secondaryField: 'TotalHH_00'
            
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
            value: 'State' 
        },
        {
            key: 'geo-1',
            text: 'County',
            value: 'County' 
        },        
        {
            key: 'geo-2',
            text: 'City',
            value: 'City' 
        },
        {
            key: 'geo-3',
            text: 'GA House Districts',
            value: 'GAHouse' 
        },
        {
            key: 'geo-4',
            text: 'GA Senate Districts',
            value: 'GASenate' 
        },
        {
            key: 'geo-5',
            text: 'Neighborhood Planning Units (NPU)',
            value: 'NPU' 
        },
        {
            key: 'geo-6',
            text: 'ARC 20 County',
            value: 'ARC20'
        },
        {
            key: 'geo-7',
            text: 'US Congressional Districts',
            value: 'Congress'
        },
        {
            key: 'geo-8',
            text: 'Neighborhood Statistical Areas',
            value: 'NSA'
        },
        {
            key: 'geo-9',
            text: 'Regional Commissions',
            value: 'RC'
        },
        {
            key: 'geo-10',
            text: 'Super Districts',
            value: 'SuperDistrict'
        },
        {
            key: 'geo-11',
            text: 'Census Tracts',
            value: 'Tract'
        }
    ]
}