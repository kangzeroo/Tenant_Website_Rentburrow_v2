import React from 'react'
import Chart from 'chartjs'

export default class SignedWeek extends React.Component {
  componentDidMount(){
    var ctx = document.getElementById('signedWeek').getContext('2d');
    var signedWeek = new Chart(ctx, {
      type: 'bar',
      data: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Leases This week',
        data: [0, 1, 3, 2, 1, 1, 2],
        backgroundColor: 'rgba(51, 204, 204 ,0.4)'
        }]
      }
    });
  }

  render() {
    return (
      <canvas id='signedWeek' />
      )
  }

}
