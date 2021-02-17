let button = document.querySelector("#connect")
let disp = document.querySelector("#disp");
let send = document.querySelector("#send");
let slider = document.querySelector("#dataRateSlider");
let dataRateDisplay = document.querySelector("#dataRate");
let writeChar;
let enc = new TextEncoder();
let dec = new TextDecoder();
let input = document.querySelector("#input");
let myChart;
const ctx = document.getElementById('Chart');
const maxDataPts = 200;

send.addEventListener('click', () => {
    writeChar.writeValue(enc.encode(input.value));
    input.value = "";
})


button.addEventListener('click', function () {


    navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
        .then(device => device.gatt.connect())
        .then(server => server.getPrimaryService('heart_rate'))
        .then(service => service.getCharacteristic('battery_level'))
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => {
            writeChar = characteristic;
            characteristic.addEventListener('characteristicvaluechanged',
                handleCharacteristicValueChanged);
            console.log('Notifications have been started.');
        })
        .catch(error => { console.error(error); });



    function handleCharacteristicValueChanged(event) {
        // const value = event.target.value.getUint8(0);
        let value = dec.decode(event.target.value);

        disp.innerText = 'Received ' + value;
        value = parseInt(value);
        console.log(value);
        let today = new Date();
        let t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
        addData(t, value);
        // TODO: Parse Heart Rate Measurement value.
        // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
    }
});

function init() {
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Random Number',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            tooltips: { enabled: false },
            hover: { mode: null },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            maintainAspectRatio: true,
        }
    });


}

function addData(label, data) {
    if (myChart.data.labels.length === maxDataPts) removeData();
    myChart.data.labels.push(label);
    myChart.data.datasets[0].data.push(data);
    myChart.update();
}

function removeData(label, data) {
    myChart.data.labels.shift(label);
    myChart.data.datasets[0].data.shift(data);
}

slider.addEventListener('input', () => {
    dataRateDisplay.innerText = "The data Rate is: " + slider.value + "ms";
})
slider.addEventListener('change', () => {
    writeChar.writeValue(enc.encode('#' + slider.value));

})

slider.addEventListener('input', () => {
    dataRateDisplay.innerText = "The data Rate is: " + slider.value + "ms";
})

