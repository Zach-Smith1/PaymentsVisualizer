import React, { useState, useEffect } from "react";
import Chart from 'react-apexcharts';

const ExpensePie = ({ totals }) => {
  const [seriesState, setSeriesState] = useState([]);
  const [originalSeriesState, setOriginalSeriesState] = useState(null);
  const [labelsState, setLabelsState] = useState([]);
  const [colors, setColors] = useState([]);
  const [width, setWidth] = useState([]);

  useEffect(() => {
    let series = [];
    let labels = [];

    if (!originalSeriesState) {
      for (const key in totals) {
        if (key.split(' ').includes('Expense') && key !== 'Expense') {
          series.push(Math.abs(totals[key].toFixed(2)));
          labels.push(key);
        }
      }
      setOriginalSeriesState([...series]);
      setSeriesState([...series]);
      setLabelsState([...labels]);
      setColors(Array(series.length).fill(''))
      setWidth(Array(series.length).fill(12))
    }
  }, [totals, originalSeriesState]);

  const handleLegendClick = (chartContext) => {
    setSeriesState((prevSeries) => {
      const updatedSeries = prevSeries.map((value, index) => {
        if (index === chartContext) {
          return value !== 0 ? 0 : originalSeriesState[index];
        }
        return value;
      });
      return updatedSeries;
    });
    setColors((prevColor) => {
      const updatedColors = prevColor.map((value, index) => {
        if (index === chartContext) {
          return value !== '#ffffff' ? '#ffffff' : undefined;
        }
        return value;
      });
      return updatedColors;
    });
    setWidth((prevWidth) => {
      const updatedWidth = prevWidth.map((value, index) => {
        if (index === chartContext) {
          return value !== 30 ? 30 : 12;
        }
        return value;
      });
      return updatedWidth;
    });
  };

  const options = {
    labels: labelsState,
    chart: {
      events: {
        legendClick: function (event, chartContext, config) {
          handleLegendClick(chartContext);
        }
      }
    },
    legend: {
      show: true,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: 'left',
      horizontalAlign: 'left',
      floating: false,
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      labels: {
        useSeriesColors: false
      },
      markers: {
        height: [...width],
        width: [...width],
        fillColors: [...colors],
    },
      onItemClick: {
        toggleDataSeries: true
    },
    },
    title: {
      text: 'Expenses Breakdown',
      align: 'center',
      offsetX: 100
    },
    theme: {
      palette: 'palette8',
  }
  };

  return (
    <div>
      <Chart options={options} series={seriesState} type='pie' width='90%' />
    </div>
  );
};

export default ExpensePie;
