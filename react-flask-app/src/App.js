import React, { useEffect, useState } from 'react';
import './App.css';
import Gauge from './components/Gauge';

function handleResultTextChange(value) {
	this.setState({ value: value });
}

function App() {
	const [ currentTime, setCurrentTime ] = useState(0);
	const [ processedData, setProcessedData ] = useState(0);
	const [ streamData, setstreamData ] = useState(0);

	useEffect(() => {
		fetch('/start').then((res) => res.json()).then(async (data) => {
			console.log(data);
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
			400
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
						<td>Stream Average</td>
						<td>{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].speed : 0}</td>
						<td>{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].engineLoad : 0}</td>
						<td>{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].rpm : 0}</td>
					</tr>
					<tr>
						<td>Total Average</td>
						<td>{processedData.avSpeed}</td>
						<td>{processedData.avEngineLoad}</td>
						<td>{processedData.avRPM}</td>
					</tr>
					<tr>
						<td><Gauge
							data={100}
							minValue={0}
							maxValue={100}
							width={400}
							height={200}
							value={100}
						/></td>
						<td><Gauge
							data={streamData.speed}
							minValue={0}
							maxValue={150}
							width={400}
							height={200}
							value={streamData.speed}
						/></td>
						<td><Gauge
							data={streamData.engineLoad}
							minValue={0}
							maxValue={100}
							width={400}
							height={200}
							value={streamData.engineLoad}
						/></td>
						<td><Gauge
							data={streamData.rpm}
							minValue={0}
							maxValue={8000}
							width={400}
							height={200}
							value={streamData.rpm}
						/></td>
					</tr>
				</table>
			</header>
			<div className="black">
				<Gauge
					data={streamData.rpm}
					minValue={0}
					maxValue={8000}
					width={400}
					height={200}
					value={streamData.speed}
				/>
			</div>
		</div>
	);
}

export default App;
