import React from "react";
import Chart from 'react-apexcharts'

const MyChart = ({ totals, active, aveOn }) => {
  let data = []
  let labels = []
  let colors = [];

  for (const key in totals) {
    if (key === 'BC Sales Amount') {
      data.push(Number(totals[key].toFixed(2)));
      labels.push('Volume Processed')
      colors.push('#2E93fA')
    } else if (key === 'Residual') {
      data.push(Number(totals[key].toFixed(2)));
      labels.push('Payable')
      colors.push('#45bd0c')
    }
  }

  const options = {
    colors: colors,
    labels: labels,
    legend: {
      show: true,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      labels: {
        useSeriesColors: false
      },
    },
    title: {
      text: '',
      align: 'center',
      offsetX: 0,
      style: {
        fontSize:  '48px',
        fontWeight:  'bold',
        fontFamily:  undefined,
      }
    },
    plotOptions: {
      pie: {
        startAngle: 30,
        endAngle: 390,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10
        },
      }
    }
  };

  return (
    <div>
      <Chart options={options} series={data} type='pie' width='100%'/>
    </div>
  );
};

export default MyChart;
