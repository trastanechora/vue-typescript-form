<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  computed: {
    chartData: function() {
      return this.$store.state.chart.chartData;
    },
    labelList: function() {
      return this.chartData.map(data => {
        return data.label;
      });
    },
    valueList: function() {
      return this.chartData.map(data => {
        return data.value;
      });
    }
  },
  mounted() {
    this.doRender();
  },
  methods: {
    doRender: function() {
      this.renderChart(
        {
          labels: this.labelList,
          datasets: [
            {
              data: this.valueList,
              backgroundColor: 'transparent',
              borderColor: 'rgba(1, 116, 188, 0.50)',
              pointBackgroundColor: 'rgba(171, 71, 188, 1)'
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Line Chart'
          }
        }
      );
    }
  },
  watch: {
    chartData: function() {
      this.doRender();
    }
  }
};
</script>
