<template>
  <div class="body-charts">
    <b-row style="justify-content: center;" v-if="intentData.labels.length != 0">
      <b-col cols="6" style="min-width: 300px; max-width: 400px;">
        <DoughnutChart :dataChart="intentData" />
      </b-col>
      <b-col cols="6" style="min-width: 300px; max-width: 400px;">
        <BarChart :dataChart="intentH" />
      </b-col>
    </b-row>
    <b-row v-if="intentData.labels.length == 0">
      <b-col style="margin-bottom: 1rem;">Nada que mostrar en este periodo de tiempo.</b-col>
    </b-row>
    <b-row v-else>
      <span class="filter-row" v-b-toggle.intents-info>Mostrar más información</span>
    </b-row>
    <b-collapse id="intents-info" class="mt-2" style="padding-bottom: 0.5rem">
      <div class="flex-container">
        <table>
          <tr>
            <th>Fecha</th>
            <th>Consulta</th>
            <th>Acierto</th>
          </tr>
          <tr :key="i" v-for="(k, i) in all" class="table-row" @click="current=k">
            <td>{{parseDate(k.datetime)}}</td>
            <td>{{k.data.intentName}}</td>
            <td>{{k.data.confidenceScore * 100}}%</td>
          </tr>
        </table>
        <div v-if="current.slots.length > 0" class="flex-container" style="flex-direction: column;">
          <span>
            Mostrando slots de la consulta
            <strong>{{current.data.intentName}}</strong>
          </span>
          <table>
            <tr>
              <th class="slot-header">Slot</th>
              <th class="slot-header">Valor</th>
              <th class="slot-header">Acierto</th>
            </tr>
            <tr :key="i" v-for="(k, i) in current.slots" class="table-row">
              <td>{{k.slotName}}</td>
              <td>{{k.raw_value}}</td>
              <td>{{k.confidence * 100}}%</td>
            </tr>
          </table>
        </div>
      </div>
    </b-collapse>
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
        labels: ["Empty"],
        data: [0]
      },
      intentH: {
        title: "Intents",
        labels: ["Empty"],
        data: [0]
      },
      all: [],
      current: { slots: [] }
    };
  },
  props: {
    device: String,
    number: [Object, Function],
    hours: [Object, Function],
    intents: [Array, Function]
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
    },
    intents: function() {
      this.all = this.intents;
    }
  },
  methods: {
    parseDate(date) {
      return (
        date.substring(8, 10) +
        "-" +
        date.substring(5, 7) +
        "-" +
        date.substring(0, 4) +
        " a las " +
        date.substring(11, 13) +
        ":" +
        date.substring(14, 16)
      );
    }
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

table,
th,
td {
  border: 1px solid rgba(0, 0, 0, 0.082);
  padding-left: 1rem;
  padding-right: 1rem;
}

th {
  background-color: rgba(65, 105, 225, 0.274);
}

th.slot-header{
  background-color: rgba(253, 98, 194, 0.445);
}

.table-row:hover {
  background-color: rgba(65, 105, 225, 0.075);
  cursor: pointer;
}
.table-row:active {
  background-color: rgba(65, 105, 225, 0.158);
}

.filter-row {
  text-align: left;
  margin: 1rem;
  color: steelblue;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-style: italic;
  font-weight: normal;
}

.filter-row:hover {
  text-decoration: underline;
  cursor: pointer;
}
.body-charts {
  width: 90%;
  justify-content: center;
}
</style>