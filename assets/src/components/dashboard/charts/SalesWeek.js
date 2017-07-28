import React from 'react'
import Chart from 'chartjs'

class SalesWeek extends React.Component {
  componentDidMount(){
    const ctx = document.getElementById('salesWeek').getContext('2d');
    const salesWeek = new Chart(ctx, {
      type: 'line',
      data: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Sales This Week',
        data: [0, 1025, 3075, 2050, 1025, 1025, 2050],
        backgroundColor: 'rgba(51, 204, 204 ,0.4)'
      }]
    },
    })
  }

  render() {
    return (
      <canvas id='salesWeek' />
      )
  }

}

export default SalesWeek;
