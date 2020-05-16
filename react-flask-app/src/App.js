import React, { useEffect, useState } from 'react';
import './App.css';
import Gauge from './components/Gauge';
import LineGraph from './components/LineGraph';
import logo from './logo.svg'; // Tell webpack this JS file uses this image
// import ndjsonStream from 'can-ndjson-stream';

function secondsToHHMMSS(sec) {
	const days = Math.floor(sec / 86400);
	const hours = Math.floor((sec - days * 86400) / 3600);
	const minutes = Math.floor((sec - days * 86400 - hours * 3600) / 60);
	const seconds = Math.floor(sec - days * 86400 - hours * 3600 - minutes * 60);
	let result = '';
	if (days > 0) result += days.toString() + ' days ';
	if (hours > 0) result += hours.toString() + ' hours ';
	if (minutes > 0) result += minutes.toString() + "' ";
	result += seconds.toString() + '" ';

	return result;
}
function decomposeTrip(trip) {
	let speed = [];
	let rpm = [];
	let engineLoad = [];
	let coolantTemp = [];
	let throttlePos = [];
	let time = [];
	trip.snaps.map((e) => {
		speed.push(e.speed);
		rpm.push(e.rpm);
		engineLoad.push(e.engineLoad);
		coolantTemp.push(e.coolantTemp);
		throttlePos.push(e.throttlePos);
		time.push(e.startTime);
	});
	return {
		...trip,
		speed: speed,
		rpm: rpm,
		engineLoad: engineLoad,
		coolantTemp: coolantTemp,
		throttlePos: throttlePos,
		time: time
	};
}
function App() {
	const [ currentTime, setCurrentTime ] = useState(0);
	const [ processedData, setProcessedData ] = useState(0);
	const [ streamData, setstreamData ] = useState(0);
	const [ trip, setTrip ] = useState([]);

	function refreshPage() {
		window.location.reload(false);
	}
	function uploadClick() {
		fetch('/upload').then((res) => res.json()).then(async (data) => {
			alert(JSON.stringify(data));
		});
	}
	function clearClick() {
		fetch('/clear').then((res) => res.json()).then(async (data) => {
			alert(JSON.stringify(data));
		});
	}

	function connectClick() {
		fetch('/connectOBD').then((res) => res.json()).then(async (data) => {
			alert(JSON.stringify(data));
		});
	}
	useEffect(() => {
		fetch('/start');
		// .then(() => {
		// 	fetch('/stream') // make a fetch request to a NDJSON stream service
		// 		.then((response) => {
		// 			// console.log(ndjsonStream(response.body))
		// 			return ndjsonStream(response.body); //ndjsonStream parses the response.body
		// 		})
		// 		.then((todosStream) => {
		// 			var reader = todosStream.getReader();
		// 			reader.read().then(function read(result) {
		// 				console.log('result', result);
		// 				if (result.done) {
		// 					console.log('result', result.value);
		// 					return;
		// 				}
		// 				console.log(result.value);
		// 				setstreamData(result.value);
		// 				reader.read().then(read, streamerr); //recurse through the stream
		// 			}, streamerr);
		// 		});
		// });
		const timeCall = setInterval(
			() =>
				fetch('/time').then((res) => res.json()).then(async (data) => {
					setCurrentTime(data.time);
				}),
			1000
		);
		const streamDataCall = setInterval(
			() =>
				fetch('/streamData').then((res) => res.json()).then(async (data) => {
					setstreamData(data);
				}),
			400
		);
		const processedDataCall = setInterval(
			() =>
				fetch('/processedData').then((res) => res.json()).then(async (data) => {
					setProcessedData(decomposeTrip(data));
				}),
			4000
		);
		return () => {
			clearInterval(timeCall);
			clearInterval(streamDataCall);
			clearInterval(processedDataCall);
		};
	}, []);
	return (
		<div className="App black">
			<div className="container grey-text center">
				<div className="container">
					<button className="btn right" onClick={uploadClick}>
						Upload
					</button>
					<button className="btn left red darken-4" onClick={clearClick}>
						Clear
					</button>
					<h1>Smart Mazda</h1>
					<div className="col s4"><h4>{currentTime}</h4></div>
				</div>
				<Gauge
					data={streamData.rpm}
					minValue={0}
					maxValue={10000}
					width={400}
					height={150}
					value={streamData.speed}
					throttle={streamData.throttlePos}
				/>

				<LineGraph
					data={processedData.engineLoad}
					length={10}
					width={400}
					height={100}
					title="Engine Load"
					units="%"
					time={processedData.time}
					temp={processedData.coolantTemp}
					minTemp={40}
					maxTemp={120}
				/>
			</div>
		</div>
	);
}

export default App;
