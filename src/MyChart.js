import React from "react";
import Chart from 'react-apexcharts'

const MyChart = ({ totals, active, aveOn }) => {
  let data = []
  let labels = []

  for (const key in totals) {
    if (key === 'Income' || key === 'Expense' || key === 'Residual') {
      data.push(totals[key].toFixed(2));
      labels.push(key)
    }
  }

  const options = {
    plotOptions: {
      bar: {
        distributed: true,
      }
    },
    chart: {
      type: 'bar',
      dropShadow: {
        enabled: true,
        enabledOnSeries: [0,1,2,3,4],
        top: 3,
        left: 3,
        blur: 2,
        color: '#000000',
        opacity: 0.4
      }
    },
    colors: ['#000000', '#eb4034', '#1f8f09'],
    xaxis: {
      categories: labels
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          if (value < 0) return `-$${(-1*value).toLocaleString()}`
          return `$${value.toLocaleString()}`
        }
      }
    },
    series: [{
      data: [{
        x: labels[0],
        y: data[0]
      }, {
        x: labels[1],
        y: data[1]
      }, {
        x: labels[2],
        y: data[2]
      }]
    }],
    title: {
      text: '',
      align: 'center',
      style: {
        fontSize:  '24px',
        fontWeight:  'bold',
        fontFamily:  undefined,
      }
    }
  }

  return (
    <div className="baseChart">
      <Chart options={options} series={options.series} type='bar' width='100%' />
    </div>
  );
}

export default MyChart;
