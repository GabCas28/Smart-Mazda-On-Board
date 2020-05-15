import ReactFauxDOM from 'react-faux-dom';
import './LineGraph.css';
import * as d3 from 'd3';

function LineGraph({ data, width, height, title, units, average, time }) {
	let margin, graphWidth, graphHeight;
	let div = new ReactFauxDOM.Element('div');
	let svg = createSVG(div);

	function createSVG(div) {
		margin = { top: 20, right: 50, bottom: 10, left: 50 };
		graphWidth = width - margin.left - margin.right;
		graphHeight = height - margin.top - margin.bottom;

		return (
			d3
				.select(div)
				.append('svg')
				.attr('preserveAspectRatio', 'xMinYMin meet')
				.attr('viewBox', '0 0 ' + width + ' ' + height)
				// .attr('width', graphWidth + margin.left + margin.right)
				// .attr('height', graphHeight + margin.top + margin.bottom)
				.append('g')
				.attr('class', 'lineGraph')
				.attr('transform', `translate(${margin.left},${margin.top})`)
		);
	}
	if (data) {
		data = data.slice(-10);
		var n = data.length;
		var maxValue = Math.max(...data);
		let [xScale, yScale] = createScales(svg)
		paintReferences(svg);
		// Add the line
		svg.append('path').datum(data).attr(
			'd',
			d3
				.line()
				.x(function(d, i) {
					return xScale(i);
				})
				.y(function(d) {
					return yScale(d);
				})
		);

		// Appends a circle for each datapoint
		var dots = svg
			.selectAll('.dot')
			.data(data)
			.enter()
			.append('circle') // Uses the enter().append() method
			.attr('class', 'dot'); // Assign a class for styling

		var label = svg.append('text').attr('class', 'label');

		dots
			.attr('cx', function(d, i) {
				return xScale(i);
			})
			.attr('cy', function(d) {
				return yScale(d);
			})
			.attr('r', 5)
			.on('mouseover', function(elem, index, data) {
				let coordinates = d3.mouse(this);
				let x = coordinates[0];
				let y = coordinates[1];
				console.log('time', time);
				let dateObj = new Date(time[index] * 1000);
				let hours = dateObj.getHours();
				let minutes = dateObj.getMinutes();
				let seconds = dateObj.getSeconds();
				let timeString =
					hours.toString().padStart(2, '0') +
					':' +
					minutes.toString().padStart(2, '0') +
					':' +
					seconds.toString().padStart(2, '0');
				label
					.attr('id', title + '-label-' + index)
					.attr('x', x - 20)
					.attr('y', y - 20)
					.attr('text-anchor', 'middle')
					.text(elem + ' ' + units + ' ' + timeString);
				//$(this).toggleClass('focus');
			})
			.on('mouseout', function() {
				label.text('');
				//$(this).removeClass('focus');
			});

		svg.append('text').attr('x', graphWidth / 2).attr('y', 0 ).attr('text-anchor', 'middle').text(title);
		function createScales() {
			// X scale will use the index of our data
			let xScale = d3
				.scaleLinear()
				.domain([ 0, n - 1 ]) // input
				.range([ 0, graphWidth ]); // output

			// Y scale will use the randomly generate number
			let yScale = d3
				.scaleLinear()
				.domain([ 0, maxValue + maxValue / 4 ]) // input
				.range([ graphHeight, 0 ]); // output
				
			return [xScale, yScale];
		}
		function paintReferences(svg) {
			let minimum = Math.min(...data);
			let maximum = Math.max(...data);
			let minReference = svg.append('g').attr('class', 'reference');

			minReference
				.append('path')
				.datum([ minimum, minimum ])
				.attr('class', 'minimum')
				.attr('d', d3.line().x((_, i) => i * graphWidth).y((d) => yScale(d)));

			minReference
				.append('text')
				.attr('x', 20)
				.attr('y', yScale(minimum) + 20)
				.attr('text-anchor', 'end')
				.text(minimum + ' ' + units);

			let maxReference = svg.append('g').attr('class', 'reference');
			maxReference
				.append('path')
				.datum([ maximum, maximum ])
				.attr('class', 'maximum')
				.attr('d', d3.line().x((_, i) => i * graphWidth).y((d) => yScale(d)));
			maxReference
				.append('text')
				.attr('x', 20)
				.attr('y', yScale(maximum) - 10)
				.attr('text-anchor', 'start')
				.text(maximum + ' ' + units);

			let avgReference = svg.append('g').attr('class', 'reference');
			avgReference
				.append('path')
				.datum([ average, average ])
				.attr('class', 'average')
				.attr('d', d3.line().x((_, i) => i * graphWidth).y((d) => yScale(d)));
			avgReference
				.append('text')
				.attr('x', graphWidth)
				.attr('y', yScale(average) - 10)
				.attr('text-anchor', 'end')
				.text(average);
		}
	}

	return div.toReact();
}

export default LineGraph;
