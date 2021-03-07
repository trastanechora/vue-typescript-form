<script>
import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  computed: {
    chartData: function() {
      return this.$store.state.chart.chartData;
    }
  },
  mounted() {
    const labelList = this.chartData.map(data => {
      return data.label;
    });
    const valueList = this.chartData.map(data => {
      return data.value;
    });
    const colorList = this.chartData.map(data => {
      return data.color;
    });
    this.renderChart(
      {
        labels: labelList,
        datasets: [
          {
            backgroundColor: colorList,
            data: valueList
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
