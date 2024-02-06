import React, { useEffect } from "react";
import CanvasJSReact from '@canvasjs/react-charts';

// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MyChart = ({ totals, active, aveOn }) => {
  let data = [];
  // let labels = [];
  // let colors = [];

  for (const key in totals) {
    if (key === 'BC Sales Amount') {
      // removed to make prettier funnel
    } else if (key === 'Residual') {
      data.push({
        y: Number(totals[key].toFixed(2)), label: 'Payable', color: '#6a974f'
      })
    } else if (key === 'Expense') {
      data.push({
        y: Math.abs(Number(totals[key].toFixed(2))), label: 'Expense', color: '#be201c'
      })
      // labels.push('Payable')
      // colors.puh('#45bd0c')
    }
    else if (key === 'Income') {
      data.push({
        y: Number(totals[key].toFixed(2)), label: 'Income', color: '#2E93fA'
      })
      // labels.push('Income')
      // colors.puh('#2E93fA')
    }
  }
  data.sort((a, b) => {
    if (a.y > b.y) {
      return -1; // 'a' should come before 'b'
    } else if (a.y < b.y) {
      return 1; // 'a' should come after 'b'
    }
    return 0; // 'a' and 'b' are equal
  });

  var dataPoint;
  var total;
  const options = {
    animationEnabled: true,
    animationDuration: 500,
    fontColor: 'white',
    title: null,
    data: [{
      type: "funnel",
      neckHeight: 200,
      neckWidth: 150,
      toolTipContent: "<b>{label}</b>: ${y} <b>({percentage}%)</b>",
      indexLabelPlacement: "inside",
      indexLabel: "{label} ({percentage}%)",
      indexLabelFontColor: "white",
      fontColor: "white",
      dataPoints: data
    }]
  }
  //calculate percentage
  dataPoint = options.data[0].dataPoints;
  total = dataPoint[0].y;
  for(var i = 0; i < dataPoint.length; i++) {
    if(i == 0) {
      options.data[0].dataPoints[i].percentage = 100;
    } else {
      options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
    }
  }
  return (
    <div>
      <CanvasJSChart options = {options}
        //  onRef={ref => this.chart = ref}
      />
      {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
    </div>
  );
}

export default MyChart;
