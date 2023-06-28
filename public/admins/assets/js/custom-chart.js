(function ($) {
  'use strict';


  if ($('#myChart').length) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Revenue',
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(44, 120, 220, 0.2)',
            borderColor: 'rgba(44, 120, 220)',
            data: [],
          },

          {
            label: 'Products',
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(380, 200, 230, 0.2)',
            borderColor: 'rgb(380, 200, 230)',
            data: [],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      },
    });

  
  
  $.ajax({
    url: '/admin/graph',
    method: 'GET',
    success: function (data) {
      if (data.success) {

        console.log(data);
        //graph one
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.sales;
        chart.data.datasets[1].data = data.products;

        chart.update();
      } else {
        console.log('Error: ' + data.message);
      }
    },
    error: function (error) {
      console.log('Error fetching data:', error);
    },
  });
}

  // 2nd chart
if ($('#myChart2').length) {
  var ctx = document.getElementById("myChart2");
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Total orders',
          backgroundColor: "#5897fb",
          barThickness: 10,
          data: []
        },
        {
          label: 'Total Stocks',
          backgroundColor: "#7bcf86",
          barThickness: 10,
          data: []
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

    $.ajax({
      url: '/admin/chart',
      method: 'GET',
      success: function (res) {
        if (res.success) {
          console.log(res);
          myChart.data.labels = res.labels
          myChart.data.datasets[0].data = res.data;
          myChart.data.datasets[1].data = res.stocks;
          myChart.update();
        } else {
          console.log('Error: ' + data.message);
        }
      },
      error: function (error) {
        console.log('Error fetching data:', error);
      },
    });

  }


  //?chart two old dummy data⬇️
  // if ($('#myChart2').length) {
  //     var ctx = document.getElementById("myChart2");
  //     var myChart = new Chart(ctx, {
  //         type: 'bar',
  //         data: {
  //         labels: ["900", "1200", "1400", "1600"],
  //         datasets: [
  //             {
  //                 label: "US",
  //                 backgroundColor: "#5897fb",
  //                 barThickness:10,
  //                 data: [233,321,783,900]
  //             },
  //             {
  //                 label: "Europe",
  //                 backgroundColor: "#7bcf86",
  //                 barThickness:10,
  //                 data: [408,547,675,734]
  //             },
  //             {
  //                 label: "Asian",
  //                 backgroundColor: "#ff9076",
  //                 barThickness:10,
  //                 data: [208,447,575,634]
  //             },
  //             {
  //                 label: "Africa",
  //                 backgroundColor: "#d595e5",
  //                 barThickness:10,
  //                 data: [123,345,122,302]
  //             },
  //         ]
  //         },
  //         options: {
  //             plugins: {
  //                 legend: {
  //                     labels: {
  //                     usePointStyle: true,
  //                     },
  //                 }
  //             },
  //             scales: {
  //                 y: {
  //                     beginAtZero: true
  //                 }
  //             }
  //         }
  //     });
  // } //end if


  //?chart one old dummy data⬇️
  // if ($('#myChart').length) {
  //     var ctx = document.getElementById('myChart').getContext('2d');
  //     var chart = new Chart(ctx, {
  //         // The type of chart we want to create
  //         type: 'line',

  //         // The data for our dataset
  //         data: {
  //             labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //             datasets: [{
  //                     label: 'Sales',
  //                     tension: 0.3,
  //                     fill: true,
  //                     backgroundColor: 'rgba(44, 120, 220, 0.2)',
  //                     borderColor: 'rgba(44, 120, 220)',
  //                     data: [18, 17, 4, 3, 2, 20, 25, 31, 25, 22, 20, 9]
  //                 },
  //                 {
  //                     label: 'Visitors',
  //                     tension: 0.3,
  //                     fill: true,
  //                     backgroundColor: 'rgba(4, 209, 130, 0.2)',
  //                     borderColor: 'rgb(4, 209, 130)',
  //                     data: [40, 20, 17, 9, 23, 35, 39, 30, 34, 25, 27, 17]
  //                 },
  //                 {
  //                     label: 'Products',
  //                     tension: 0.3,
  //                     fill: true,
  //                     backgroundColor: 'rgba(380, 200, 230, 0.2)',
  //                     borderColor: 'rgb(380, 200, 230)',
  //                     data: [30, 10, 27, 19, 33, 15, 19, 20, 24, 15, 37, 6]
  //                 }

  //             ]
  //         },
  //         options: {
  //             plugins: {
  //             legend: {
  //                 labels: {
  //                 usePointStyle: true,
  //                 },
  //             }
  //             }
  //         }
  //     });
  // } //End if













})(jQuery);
