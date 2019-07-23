export default {
    layout: {
        mapVisible: true,
        tableVisible: true,
        chartVisible: true,
        colorMap: 'temperature',
        numberOfBins: 72,
        colorMapReverse: true,
        // chartType: 'scatterplot',
        colorOpacity: .8,
        tableBanding: ['#c8e4d6', '#f3eeeb']
    },
    data: {
        baseUrl: 'https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/'
    },
    categoryOptions: [
        {
            key: "serviceID-0",
            text: "Change since 2000",
            value: 0,
            name: 'Change'
        },
        {
            key: "serviceID-1",
            text: "Demography",
            value: 1,
            name: 'Demography'
        },
        {
            key: "serviceID-2",
            text: "Demography by Race & Ethnicity",
            value: 2,
            name: 'RaceX',
            subcategory: 'Demographic'
        },
        {
            key: "serviceID-3",
            text: "Economy",
            value: 3,
            name: 'Economy'
        },
        {
            key: "serviceID-4",
            text: "Economy by Race & Ethnicity",
            value: 4,
            name: 'RaceX',
            subcategory: 'Economic'
        },
        {
            key: "serviceID-5",
            text: "Housing",
            value: 5,
            name: 'Housing'
        },
        {
            key: "serviceID-6",
            text: "Housing by Race & Ehtnicity",
            value: 6,
            name: 'RaceX',
            subcategory: 'Housing'
        },
        {
            key: "serviceID-7",
            text: "Social",
            value: 7,
            name: 'Social'
        },
        {
            key: "serviceID-8",
            text: "Social by Race & Ethnicity",
            value: 8,
            name: 'RaceX',
            subcategory: 'Social'


        }
    ],
    geoOptions : [
        {
            key: "geo-0",
            text: "State of Georgia",
            value: 'State' 
        },
        {
            key: "geo-1",
            text: "County",
            value: 'County' 
        },        
        {
            key: "geo-2",
            text: "City",
            value: 'City' 
        },
        {
            key: "geo-3",
            text: "GA House Districts",
            value: 'GAHouse' 
        },
        {
            key: "geo-4",
            text: "GA Senate Districts",
            value: 'GASenate' 
        },
        {
            key: "geo-5",
            text: "Neighborhood Planning Units (NPU)",
            value: 'NPU' 
        },
        {
            key: "geo-6",
            text: "ARC 20 County",
            value: "ARC20"
        },
        {
            key: "geo-7",
            text: "US Congressional Districts",
            value: "Congress"
        },
        {
            key: "geo-8",
            text: "Neighborhood Statistical Areas",
            value: "NSA"
        },
        {
            key: "geo-9",
            text: "Regional Commissions",
            value: "RC"
        },
        {
            key: "geo-10",
            text: "Super Districts",
            value: "SuperDistrict"
        },
        {
            key: "geo-11",
            text: 'Census Tracts',
            value: 'Tract'
        }
    ]
}