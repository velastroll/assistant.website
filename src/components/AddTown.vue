<template>
  <b-modal
    :id="'modal-add-location'"
    title="Añadir localidad"
    ref="vuemodal"
    @shown="modalShown"
    @hide="locationMap = null"
  >
    <b-row class="justify-content-center">
      <b-col md="auto" class="colMap">
        <div id="map" ref="mymap"></div>
      </b-col>
    </b-row>
    <!-- modal footer -->
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button
          variant="success"
          size="sm"
          class="float-right"
          :disabled="locationMap == null"
          @click="addLocation()"
        >AÑADIR LOCALIDAD</b-button>
      </div>
    </template>
  </b-modal>
</template>

<style scss>
#map {
  background-color: #00000000;
  height: 300px;
  width: 465px;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
}
.colMap {
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  height: 300px;
  width: 465px;
}
@media only screen and (max-width: 575px) {
  #map {
    width: 325px;
  }
  .colMap {
    width: 325px;
  }
}
.header-title-little {
  font-size: 2rem;
}
.add-button {
  background: rgba(255, 255, 255, 0);
  border-radius: 1rem;
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-style: solid;
  color: darkgreen;
}
</style>

<script>
/* eslint-disable */

// @ is an alias to /src
// import Struct from '@/components/Struct.vue'
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "AddTown",
  components: {},

  data: function() {
    return {
      name: "",
      postcode: null,
      locationMap: null,
      map: null,
      geosearch: null,

    };
  },
  props: {
    locations : Array
  },
  watch: {
    $route(to, from) {
      this.locationMap = to.query;
    }
  },
  methods: {
    /**
     * Must be on code if the map is shown in a modal.
     */
    modalShown() {
      this.map = L.map("map");
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);

      // set view
      if (this.locations.lenght > 0) {
        this.map.setView(
          [this.locations[0].latitude, this.locations[0].longitude],
          18
        );
      } else {
        this.map.setView([40.33241295173677, -4.294281005859376], 5);
      }
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      // geocode service
      var geocodeService = L.esri.Geocoding.geocodeService();
      var tmp_location = null;
      var m = this.map;
      this.map.on("click", function(e) {
        var g = geocodeService
          .reverse()
          .latlng(e.latlng)
          .run(function(error, result) {
            if (error) return;
            if (found != null) m.removeLayer(found);
            found = L.marker(result.latlng);
            handleClick(result);
            found
              .addTo(m)
              .bindPopup(`
            <div style="width: 100%; text-align: right; font-weight: bold;"> ${result.address.City} </div>
            <div style="width: 100%; text-align: right"> ${result.address.Postal}, ${result.address.CountryCode} </div>
            <div style="width: 100%; text-align: right"> ${result.address.Subregion} </div>
            `)
              .openPopup();
          });
      });
      // geosearch
      this.geosearch = L.esri.Geocoding.geosearch({ position: "topleft" });
      this.geosearch.addTo(this.map);
      var results = L.layerGroup();
      results.addTo(this.map);
      this.geosearch.on("results", function(data) {
        results.clearLayers();
      });
    },
    /**
     * Add a new location
     */
    addLocation(){
      let payload = {
        name: this.locationMap.c,
        postcode: this.locationMap.p,
        country: this.locationMap.co,
        latitude: this.locationMap.lat,
        longitude: this.locationMap.lng
      }
      this.$store
        .dispatch("provinces/add", payload)
        .then(r => {
          if (r.status == 200){
            this.$parent.makeToast("success", "New location added", r.data)
            this.modalShown = null
            this.$parent.updateProvinces()
            this.$bvModal.hide('modal-add-location')
          } else {
            this.$parent.makeToast("danger", `Error ${r.status}`, r.data)
          }
      })
    }
  }
};
</script>
