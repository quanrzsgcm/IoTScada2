const startTime = '2023-10-27 10:46:30+07';  // Replace with your specific time
const endTime = '2023-10-30 11:16:08+07';    // Replace with your specific time
const requestData = {
  start_time: startTime,
  end_time: endTime
};
console.log(requestData);

// Get method 
// const url = `http://127.0.0.1:8000/api2/my-api/?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`;
// post method, the body store json data
const url = `http://127.0.0.1:8000/api2/my-api/`;
try {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(requestData)

  })
    .then(response => {
      // console.log(response);
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Handle the response data
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
catch (e) {
  console.log(e);
}


