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
							<td>{processedData.avThrottlePos}</td>
							<td>{processedData.avCoolantTemp}</td>
						</tr>
						
					</tbody>
				</table>