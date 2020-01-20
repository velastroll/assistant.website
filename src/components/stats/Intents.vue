<template>
  <div class="body-charts">
    <b-row style="justify-content: center;">
      <b-col cols="6" style="min-width: 300px; max-width: 400px;">
        <DoughnutChart :dataChart="intentData" />
      </b-col>
      <b-col cols="6" style="min-width: 300px; max-width: 400px;">
        <BarChart :dataChart="intentH" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";

export default {
  components: {
    DoughnutChart,
    BarChart
  },
  data() {
    return {
      intentData: {
        title: "Intents",
        labels: ["Fake1", "Fake2", "Fake3"],
        data: [13, 5, 2]
      },
      intentH: {
        title: "Intents",
        labels: ["Fake1", "Fake2", "Fake3"],
        data: [13, 5, 2]
      }
    };
  },
  props: {
    device: String,
    number: [Object, Function],
    hours: [Object, Function]
  },
  watch: {
    number: function() {
      let keys = Object.keys(this.number);
      this.intentData = {
        title: "Intents",
        labels: [],
        data: []
      };
      keys.forEach(element => {
        this.intentData.labels.push(element);
        this.intentData.data.push(this.number[element]);
      });
    },
    hours: function() {
      let keys = Object.keys(this.hours);
      this.intentH = {
        title: "Intents",
        labels: [
          "00h",
          "01h",
          "02h",
          "03h",
          "04h",
          "05h",
          "06h",
          "07h",
          "08h",
          "09h",
          "10h",
          "11h",
          "12h",
          "13h",
          "14h",
          "15h",
          "16h",
          "17h",
          "18h",
          "19h",
          "20h",
          "21h",
          "22h",
          "23h"
        ],
        data: [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ]
      };
      keys.forEach(element => {
        this.intentH.data[element] = this.hours[element];
      });
    }
  },
  methods: {}
};
</script>

<style scoped>
  .body-charts{
    width: 90%; 
    justify-content: center
  }
</style>