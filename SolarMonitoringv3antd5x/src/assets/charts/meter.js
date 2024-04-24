
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
// @ts-ignore
import * as Gauge from "chartjs-gauge";

import { useEffect } from "react";

// Chart.js gauge
// Register the gauge plugin with Chart.js
Chart.register(Gauge);

var data = [-60, -20, 20, 60, 100];
var SQL = 80;
var value2 = 0;
if (SQL > 100) {
  value2 = 100;
} else if (SQL < -100) {
  value2 = -100;
} else value2 = SQL;

var config = {
  type: "gauge",
  data: {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "",
        data: data,
        value: value2,
        minValue: -100,
        backgroundColor: [
          "rgb(80,200,120)",
          "rgb(150,200,150)",
          "rgb(150,150,150)",
          "rgb(200,100,100)",
          "rgb(200,50,50)"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        generateLabels: {}
      }
    },
    responsive: true,
    title: {
      display: false,
      text: "",
      fontSize: 11
    },
    layout: {
      padding: {
        bottom: 0
      }
    },
    needle: {
      radiusPercentage: 1,
      widthPercentage: 2,
      lengthPercentage: 100,
      color: "rgb(0, 0, 0)"
    },

    valueLabel: {
      fontSize: 0,
      backgroundColor: "transparent",
      formatter: function (value, context) {
        // debugger;
        return "";
        // return '< ' + Math.round(value);
      }
    },
    plugins: {
      datalabels: {
        display: "auto",
        formatter: function (value, context) {
          // debugger;
          return context.chart.data.labels[context.dataIndex];
          // return context.dataIndex===0?'Normal':context.dataIndex===1?'Warning':'Critical';
          // return '< ' + Math.round(value);
        },
        color: function (context) {
          return "white";
        },
        //color: 'rgba(255, 255, 255, 1.0)',
        // backgroundColor: 'rgba(0, 0, 0, 1.0)',
        // borderWidth: 0,
        // borderRadius: 5,
        font: function (context) {
          var innerRadius = Math.round(context.chart.innerRadius);
          console.log(innerRadius);
          var size = Math.round(innerRadius / 8);

          return {
            weight: "normal",
            size: size
          };
        }
        // font: {
        //   weight: 'normal',
        //   size:16
        // }
      }
    }
  }
};

export default function App() {
  useEffect(() => {
    // Chart.register(ChartDataLabels);
    var ctx = document.getElementById("myChart").getContext("2d");
    const myGauge = new Chart(ctx, config);
    myGauge.update();
    const val = setTimeout(() => console.log(myGauge.toBase64Image()), 800);
  }, []);

  return (
    <div className="App">
      {/* <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2> */}
      <canvas id="myChart"></canvas>
    </div>
  );
}
