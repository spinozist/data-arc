import API from './API';

export default {
    getGeoJSON: (geo, defaults) => {
    
    },
    addData: (dataObj, geo) => { 

    },
    handleBoundingGeo: (geo, defaults, setState) => {
        const boundingGeo = defaults.geoOptions.find(option => 
            option.value === geo).boundingGeo;
        const url = defaults.boundingGeoURL[boundingGeo];
        const result = [];
        API.getData(url)
            .then(res => result.push(res.data))
            .catch(err => console.error(err))
        console.log(result)
        return setState(result[0])
    },

}