<template>
  <div>
    <DoughnutChart :dataChart="intentData" />
  </div>
</template>

<script>
import DoughnutChart from "./DoughnutChart";

export default {
  components: {
    DoughnutChart
  },
  data() {
      return {
          intentData: {
              title: 'Intents',
              labels: ['Fake1', 'Fake2', 'Fake3'],
              data: [13, 5, 2]
          }
      }
  },
  props: {
      device: String,
      number: Object
  },
  watch: {
    number: function() {
      console.log("NoI object: ");
      console.log(this.number);
    }
  },
  methods: {
  }
};
</script>