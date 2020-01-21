<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    dataChart: Object
  },
  watch: {
    dataChart: function() {
      this.loadChart();
    }
  },
  data() {
    return {
      gradient: null,
      gradient1: null,
      gradient2: null,
      gradient3: null,
      gradient4: null,
      gradient5: null,
      gradient6: null,
      gradient7: null,
      gradient8: null,
      gradient9: null
    };
  },
  methods: {
    loadChart() {
      this.gradient = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient1 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient2 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient3 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient4 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient5 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient6 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient7 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient8 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
      this.gradient9 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);

      // red
      this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
      this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
      this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      // green
      this.gradient1.addColorStop(0, "rgba(0, 225, 2, 0.5)");
      this.gradient1.addColorStop(0.5, "rgba(0, 225, 2, 0.25)");
      this.gradient1.addColorStop(1, "rgba(0, 225, 2, 0)");
      // blue
      this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
      this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
      this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");
      // purple
      this.gradient3.addColorStop(0, "rgba(234, 0, 255, 0.9)");
      this.gradient3.addColorStop(0.5, "rgba(234, 0, 255, 0.25)");
      this.gradient3.addColorStop(1, "rgba(234, 0, 255, 0)");
      // orange
      this.gradient4.addColorStop(0, "rgba(255, 179, 0, 0.9)");
      this.gradient4.addColorStop(0.5, "rgba(255, 179, 0, 0.25)");
      this.gradient4.addColorStop(1, "rgba(255, 179, 0, 0)");
      // yellow
      this.gradient5.addColorStop(0, "rgba(207, 203, 17, 0.9)");
      this.gradient5.addColorStop(0.5, "rgba(207, 203, 17, 0.25)");
      this.gradient5.addColorStop(1, "rgba(207, 203, 17, 0)");
      // aquamarine
      this.gradient6.addColorStop(0, "rgba(3, 110, 85, 0.9)");
      this.gradient6.addColorStop(0.5, "rgba(3, 110, 85, 0.25)");
      this.gradient6.addColorStop(1, "rgba(3, 110, 85, 0)");
      // dark blue
      this.gradient7.addColorStop(0, "rgba(10, 43, 77, 0.9)");
      this.gradient7.addColorStop(0.5, "rgba(10, 43, 77, 0.25)");
      this.gradient7.addColorStop(1, "rgba(10, 43, 77, 0)");
      // lila
      this.gradient8.addColorStop(0, "rgba(121, 88, 173, 0.9)");
      this.gradient8.addColorStop(0.5, "rgba(121, 88, 173, 0.25)");
      this.gradient8.addColorStop(1, "rgba(121, 88, 173, 0)");
      // pink
      this.gradient9.addColorStop(0, "rgba(230, 38, 255, 0.9)");
      this.gradient9.addColorStop(0.5, "rgba(230, 38, 255, 0.25)");
      this.gradient9.addColorStop(1, "rgba(230, 38, 255, 0)");

      this.renderChart(
        {
          labels: this.dataChart.labels,
          datasets: [
            {
              label: "Horas de la consulta",
              borderColor: "#00e102",
              pointBackgroundColor: "white",
              borderWidth: 1,
              pointBorderColor: "grey",
              backgroundColor: [
                this.gradient,
                this.gradient1,
                this.gradient2,
                this.gradient3,
                this.gradient4,
                this.gradient5,
                this.gradient6,
                this.gradient7,
                this.gradient8,
                this.gradient9
              ],
              data: this.dataChart.data
            }
          ]
        },
        { responsive: true, maintainAspectRatio: true }
      );
    }
  },
  mounted() {
    this.loadChart();
  }
};
</script>