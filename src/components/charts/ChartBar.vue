<script>
import { Bar } from 'vue-chartjs';
import { generateRandomColor } from '@/@utils';

export default {
  extends: Bar,
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
    },
    colorList: function() {
      return this.chartData.map(data => {
        if (data.color) {
          return data.color;
        }
        return generateRandomColor();
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
              backgroundColor: this.colorList,
              data: this.valueList
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Bar Chart'
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
