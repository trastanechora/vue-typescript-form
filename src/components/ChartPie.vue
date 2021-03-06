<script>
import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  mounted() {
    this.renderChart(
      {
        labels: ['Angular', 'React', 'Vue', 'Svelte'],
        datasets: [
          {
            backgroundColor: ['#b02f28', '#00D8FF', '#2f993d', '#ad5a17'],
            data: [20, 25, 30, 15]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
