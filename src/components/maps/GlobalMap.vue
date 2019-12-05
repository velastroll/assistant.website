<template>
  <div id="mapid" style="height: 100%; width: 100%;"></div>
</template>

<script>
import Axios from "axios";

/* eslint-disable */
export default {
  name: "GlobalMap",
  props: {
    msg: Array
  },
  data: function() {
    return {
      // default to Valladolid
      center: [36.126344, -10.26877],
      mymap: null,
      cluster: null,
      geosearch: null,
      current: { arrow: null, bus: null },
      geosearch: null,
      alert_marks: [],
      dots: [],
      gps: false,
      centered: false
    };
  },
  watch: {
    // ----------------------------- CURRENT POSITION ----------------------------
    msg: function() {
      console.log(this.msg)
      if (this.msg != null && !this.centered) {
        this.mymap.setView(
          [
            parseFloat(40.364180),
            parseFloat(-3.792161)
          ],
          6
        );
        this.centered = true;
      }

      this.showDevices();
    }
  },
  mounted: function() {
    this.geolocate();
    this.mymap = L.map("mapid");
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: "Alvaro Velasco"
    }).addTo(this.mymap);
    this.cluster = L.markerClusterGroup();
    this.mymap.addLayer(this.cluster);
    this.mymap.setView(this.center, 6);
    this.geosearch = L.esri.Geocoding.geosearch({ position: "topleft" });
    this.geosearch.addTo(this.mymap);

  },
  methods: {
    // receives a place object via the autocomplete component
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = [
          parseFloat(position.coords.latitude),
          parseFloat(position.coords.longitude)
        ];
      });
    },
    showDevices() {
      // delete old marks
      for (var m in this.dots) {
        if (this.dots[m] != null) this.mymap.removeLayer(this.dots[m]);
      }

      this.dots = [];
      let icon_yellow = '/marker/marker_yellow.svg'
      let icon_red = '/marker/marker_red.svg'
      let icon_green = '/marker/marker_green.svg'
      let icon_home = '/marker/home.svg'
      var icon_device = icon_yellow
      var latlngs = [];
      var markerHtml = `width: 40px; height:40px; display: block; position: relative; fill: red;`;
      // print positions
      for (var d in this.msg) {
        // print the points of the path
        var dev = this.msg[d];
        var lat = 40.340664
        var lng = -10.699526
        if (dev.relation){
          lat = dev.relation.lat
          lng = dev.relation.lon
          icon_device = icon_green
        }
        console.log(dev)
        var dot = L.divIcon({
          className: "point",
          iconAnchor: [6, 10],
          labelAnchor: [-14, -14],
          popupAnchor: [15, -15],
          html: `<img style="${markerHtml}" src="${icon_device}"/>`
        });
        var tmp = L.marker([lat, lng], {
          icon: dot
        });
        var popup = `
        <div style="font-weight: bold; width: 100%; text-align: center;"> ${dev.device} </div>
        <div v-if="${dev.relation==null}" style="color: red"> Ningún usuario asignado </div>
        <a href="#/stats/?u=${dev.device}"> Ver en detalle </a>
        `;
        tmp.bindPopup(popup);
        this.mymap.addLayer(tmp);
        this.dots.push(tmp);
      }
    },
    calculeSeconds: function(since) {
      var date = new Date(since);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      var date = parseInt((n - a) / 1000.0);
      if (date < 60) return " hace " + date + "segundos";
      else {
        date = parseInt(date / 60);
        if (date < 60) return " hace " + date + "minutos";
        else return " hace " + parseInt(date / 60) + " horas";
      }
    }
  }
};
</script>