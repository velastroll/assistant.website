  
export default {
    state: {
        api : "http://virtual.lab.infor.uva.es:65143"
    },
    getters: { // this.$store.getters["getData"]
        api : state => {
            return state.api
        }
    }, 
    mutations: {
        // TODO: updateVehicleData
    },
    actions: { // this.$store.dispatch["doXYZ"]
    // TODO: retrieve vehicle data. It could be in a parent component and be updated every X seconds.
    }, 


}