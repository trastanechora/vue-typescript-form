<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  computed: {
    chartData: function() {
      return this.$store.state.chart.chartData;
    }
  },
  mounted() {
    console.warn('chartData', this.chartData);
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
            label: 'Vote',
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
