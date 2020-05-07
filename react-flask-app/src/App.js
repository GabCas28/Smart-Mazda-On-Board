import React, { useEffect, useState } from 'react';
import './App.css';
// import Gauge from "./components/Gauge";

function App() {
	const [ currentTime, setCurrentTime ] = useState(0);
	const [ processedData, setProcessedData ] = useState(0);
	const [ streamData, setstreamData ] = useState(0);

	useEffect(() => {
		fetch("/start").then((res)=> res.json()).then(async (data) => {
				console.log(data)
		});
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
			250
		);
		const processedDataCall = setInterval(
			() =>
				fetch('/processedData').then((res) => res.json()).then(async (data) => {
					setProcessedData(data);
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
		<div className="App">
			<header className="App-header">
				{/* <Gauge/> */}
				<p>The current time is {currentTime}.</p>
				<table>
					<tr>
						<th> Type </th>
						<th> Speed </th>
						<th> Engine Load </th>
						<th> RPM </th>
					</tr>
					<tr>
						<td>Stream</td>
						<td>{streamData.speed}</td>
						<td>{streamData.engineLoad}</td>
						<td>{streamData.rpm}</td>
					</tr>
					<tr>
						<td>Average</td>
						<td>{processedData.avSpeed}</td>
						<td>{processedData.avEngineLoad}</td>
						<td>{processedData.avRPM}</td>
					</tr>
				</table>
			</header>
		</div>
	);
}

export default App;
