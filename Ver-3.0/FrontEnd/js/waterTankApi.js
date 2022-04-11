var url = "https://localhost:3000/api/";

var chart = null;

function getData() {
  // Make a request for a user with a given ID

  axios
    .get(url + "waterlevel")
    .then(function (response) {
      // handle success
      
      if (response.data.waterlevel <= 0) {
        SendMailE();
      }
      if (response.data.waterlevel >= 700) {
        SendMailF();
      }

      createChart(response.data.waterlevel);
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function addData() {
  // Make a request for a user with a given ID
  axios
    .post(url + "saveData")
    .then(function (response) {
      // handle success
      getData();
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function SendMailF() {
  // Make a request for a user with a given ID
  axios
    .post(url + "mailfilled")
    .then(function (response) {
      // handle success
      alert("Email sent for full")
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function SendMailE() {
  // Make a request for a user with a given ID
  axios
    .post(url + "mailempty")
    .then(function (response) {
      // handle success
      alert("Email sent for empty")
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}






function removeData() {
  // Make a request for a user with a given ID
  axios
    .delete(url + "removeData")
    .then(function (response) {
      // handle success
      getData();
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function graph(e = null) {
  var para = "",
    temp = "";
  console.log(e);
  if (e) {
    console.log(e.target.value);
    para = e.target.value;
    temp = moment(para).add(1, "day").format("YYYY-MM-DD");
  }
  // Make a request for a user with a given ID
  axios
    .get(url + "graph?date=" + temp)
    .then(function (response) {
      // handle success
      plot(response.data);
      if (e) {
        const usedPaniArray = response.data
          .filter(
            (x) =>
              moment(para).format("YYYY-MM-DD") ===
                moment(x.created).format("YYYY-MM-DD") && x.transaction < 0
          )
          .map((x) => x.transaction);
        const paniUsehua = usedPaniArray.reduce((a, b) => a + b, 0);
        const paniWlaElement = document.getElementById("Waterused");
        paniWlaElement.innerText = Math.abs(paniUsehua) + " Litres of Water used,";
        console.log(paniUsehua);
      
      
        const PaniArray = response.data
        .filter(
          (x) =>
            moment(para).format("YYYY-MM-DD") ===
              moment(x.created).format("YYYY-MM-DD") && x.transaction > 0
        )
        .map((x) => x.transaction);
      const pani = PaniArray.reduce((a, b) => a + b, 0);
      const paniElement = document.getElementById("Waterfilled");
      paniElement.innerText = Math.abs(pani) + "Litres of Water filled";
      console.log(pani);
      
      }


    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function plot(data) {
  if (chart) chart.destroy();
  var xValues = data.map((x) => moment(x.created).format("LLL"));
  var yValues = data.map((x) => x.waterlevel);

  const ctx = document.getElementById("myChart");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues,
          label: 'Water Data',
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { min: 6, max: 16 } }],
      },
    },
  });
}
