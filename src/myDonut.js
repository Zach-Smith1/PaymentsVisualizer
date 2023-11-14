import React, { useState } from "react";
import Chart from 'react-apexcharts'

const MyDonut = ({ totals, change, top }) => {
  let series = [];
  let labels = [];
  let totalSpend = 0;
  for (const key in totals) {
    let num = Number(totals[key][1]);
    let i = 0;
    // below code organizes MIDs by income
    while (num > series[i]) {
      i++
    }
    if (!isNaN(num)) {
      series.splice(i, 0, num);
      labels.splice(i, 0, totals[key][0]);
      totalSpend += num
    }
  }

  series = series.slice(-top);
  labels = labels.slice(-top);

  const options = {
    chart: {
      events: {
        animationEnd: undefined,
        legendClick: undefined,
        dataPointSelection: function (event, chartContext, config) {
          let val = labels[config.dataPointIndex];
          change(val)
        }
      },
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10
        },
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '20px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: undefined,
              offsetY: -10,
              formatter: function (val) {
                return val
              }
            },
            value: {
              show: true,
              fontSize: '18px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: function (val) {
                return '$' + val
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: `Top ${top}`,
              fontSize: '2vw',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 450,
              color: 'black',
              formatter: function (w) {
                let totals = w.globals.seriesTotals;
                return '$' + Number((totals.reduce((a, b) => { return a + b }))).toLocaleString();
              }
            }
          }
        }
      }
    },
    legend: {
      show: false,
      position: 'right'
    },
    value: {
      show: true,
      fontSize: '18px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 400,
      color: undefined,
      offsetY: 16,
      formatter: function (val) {
        return '$' + val
      }
    },
    labels: labels,
    title: {
      text: 'Top Merchant Income',
      align: 'center',
      style: {
        fontSize:  '24px',
        fontWeight:  'bold',
        fontFamily:  undefined,
      }
    }
  }

  return (
    <div>
      <Chart options={options} series={series} type='donut' width='80%' />
    </div>
  );
}

export default MyDonut;