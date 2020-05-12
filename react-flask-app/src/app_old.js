import React, { useEffect, useState } from 'react';
import {Bootstrap, Grid, Row, Col} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import './App.css';
import Container from 'react-bootstrap/Container';
// import Gauge from "./components/Gauge";

function App() {
	const [ currentTime, setCurrentTime ] = useState(0);
	const [ processedData, setProcessedData ] = useState({speed:0,rpm:0,engineLoad:0});
	const [ streamData, setstreamData ] = useState({speed:0,rpm:0,engineLoad:0});

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
		<Container fluid>
		<Row className="justify-content-md-center">
		<div class="justify-content-center bg-red text-dark">
			<header>
				{/* <Gauge/> */}
				<p>The current time is {currentTime}.</p>
				<table class="table align-middle" variant="dark">
				<thead>
					<tr>
						<th> Type </th>
						<th> Speed </th>
						<th> Engine Load </th>
						<th> RPM </th>
					</tr>
					</thead>
					<tr>
						<td>Stream</td>
						<td>{streamData.speed}</td>
						<td>{streamData.engineLoad}</td>
						<td>{streamData.rpm}</td>
					</tr>
					<tr>
						<td>Average</td>
						<td>{processedData.speed}</td>
						<td>{processedData.engineLoad}</td>
						<td>{processedData.rpm}</td>
					</tr>
				</table>
			</header>
		</div>
		</Row>
		</Container>
	);
}

export default App;