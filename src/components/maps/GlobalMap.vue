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
        if (this.dots[m] != null) this.cluster.removeLayer(this.dots[m]);
      }

      // delete cluster
      this.mymap.removeLayer(this.cluster);
      // new cluster
      this.cluster = L.markerClusterGroup();

      this.dots = [];
      let icon_yellow = '/marker/marker_yellow.svg'
      let icon_red = '/marker/marker_red.svg'
      let icon_green = '/marker/marker_green.svg'
      let icon_home = '/marker/home.svg'
      var latlngs = [];
      var markerHtml = `width: 40px; height:40px; display: block; position: relative; fill: red;`;
      // print positions
      for (var d in this.msg) {
        var icon_device = icon_yellow
        // print the points of the path
        var dev = this.msg[d];
        var lat = 40.340664
        var lng = -10.699526
        if (dev.relation != null){
          lat = dev.relation.position.lat
          lng = dev.relation.position.lon
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
        var tmp = L.marker([parseFloat(lat), parseFloat(lng)], {
          icon: dot
        });
        var popup = `
        <div style=" width: 100%; text-align: center;">
          <div style="font-weight: bold"> ${dev.device} </div>
          ${this.popupRelation(dev.relation)}
          <a href="#/stats/?d=${dev.device}"> Ver en detalle </a>
        </div>
        `;
        tmp.bindPopup(popup);
        this.cluster.addLayer(tmp);
        this.dots.push(tmp);
      }
      this.mymap.addLayer(this.cluster);
    },
    popupRelation(r){
      if (r == null){
        return `<div style="color: red; text-align: center"> Ningún usuario asignado </div>`
      }
      else {
        return `
          <div style="text-align: right"> 
            <div>${r.user.name}  ${r.user.surname}</div>
            <div> ${r.user.nif}  </div>
          </div>
        `
      }
    },
    calculeSeconds: function(since) {
      var date = new Date(since);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime();
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