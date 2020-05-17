import React, { useEffect, useState } from 'react';
import './App.css';
import Gauge from './components/Gauge';
import LineGraph from './components/LineGraph';

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

	function restartClick() {
		fetch('/restart').then((res) => res.json()).then(async (data) => {
			alert('Restarting server');
		});
	}
	useEffect(() => {
		fetch('/start');
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
			<div className="container  grey-text center">
				<div className="row valign-wrapper">
					<div className="col  s1">
						<button className="btn green right darken-4" onClick={uploadClick}>
							Upload
						</button>
					</div>
					<div className="col left s1">
						<button className="btn right blue darken-4 " onClick={clearClick}>
							Clear
						</button>
					</div>
					<div className="col  s1">
						<button className="btn left grey darken-4" onClick={restartClick}>
							Restart
						</button>
					</div>
					<div className="col  s4">
						<h1>Smart Mazda</h1>
					</div>
					<div className="col  s4">
						<h4>{currentTime}</h4>
					</div>
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
