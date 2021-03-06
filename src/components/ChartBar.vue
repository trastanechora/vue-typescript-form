<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  mounted() {
    this.renderChart(
      {
        labels: ['Angular', 'React', 'Vue', 'Svelte'],
        datasets: [
          {
            label: 'Vote',
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
