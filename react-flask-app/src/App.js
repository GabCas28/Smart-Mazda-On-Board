import React, { useEffect, useState } from 'react';
import './App.css';
import Gauge from './components/Gauge';

function App() {
	const [ currentTime, setCurrentTime ] = useState(0);
	const [ processedData, setProcessedData ] = useState(0);
	const [ streamData, setstreamData ] = useState(0);

	useEffect(() => {
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
			100
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
				<table className="table centered  text-white">
					<thead>
						<tr>
							<th> Type </th>
							<th> Speed </th>
							<th> Engine Load </th>
							<th> Revolutions Per Minute </th>
							<th> Throttle Position </th>
							<th> Coolant Temp </th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Stream</td>
							<td>{streamData.speed}</td>
							<td>{streamData.engineLoad}</td>
							<td>{streamData.rpm}</td>
							<td>{streamData.throttlePos}</td>
							<td>{streamData.coolantTemp}</td>
						</tr>
						<tr>
							<td>Stream Average</td>
							<td>{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].speed : 0}</td>
							<td>
								{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].engineLoad : 0}
							</td>
							<td>{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].rpm : 0}</td>
							<td>
								{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].throttlePos : 0}
							</td>
							<td>
								{processedData.snaps ? processedData.snaps[processedData.nSnaps - 1].coolantTemp : 0}
							</td>
						</tr>
						<tr>
							<td>Total Average</td>
							<td>{processedData.avSpeed}</td>
							<td>{processedData.avEngineLoad}</td>
							<td>{processedData.avRPM}</td>
							<td>{processedData.throttlePos}</td>
							<td>{processedData.coolantTemp}</td>
						</tr>
						<tr>
							<td>
								<Gauge data={100} minValue={0} maxValue={100} width={400} height={200} value={100} />
							</td>
							<td>
								<Gauge
									data={streamData.speed}
									minValue={0}
									maxValue={150}
									width={400}
									height={200}
									value={streamData.speed}
								/>
							</td>
							<td>
								<Gauge
									data={streamData.engineLoad}
									minValue={0}
									maxValue={100}
									width={400}
									height={200}
									value={streamData.engineLoad}
								/>
							</td>
							<td>
								<Gauge
									data={streamData.rpm}
									minValue={0}
									maxValue={16384}
									width={400}
									height={200}
									value={streamData.rpm}
								/>
							</td>
							<td>
								<Gauge
									data={streamData.throttlePos}
									minValue={0}
									maxValue={100}
									width={400}
									height={200}
									value={streamData.throttlePos}
								/>
							</td>
							<td>
								<Gauge
									data={streamData.coolantTemp}
									minValue={-40}
									maxValue={215}
									width={400}
									height={200}
									value={streamData.coolantTemp}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</header>
			<div className="black">
				<Gauge
					data={streamData.rpm}
					minValue={0}
					maxValue={16384}
					width={400}
					height={200}
					value={streamData.speed}
				/>
			</div>
		</div>
	);
}

export default App;
