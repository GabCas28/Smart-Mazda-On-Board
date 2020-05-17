import ReactFauxDOM from 'react-faux-dom';
import './LineGraph.css';
import * as d3 from 'd3';

function LineGraph({ data, width, height, title, units, average, time, temp, minTemp, maxTemp }) {
	let margin, graphWidth, graphHeight;
	let div = new ReactFauxDOM.Element('div');
	let svg = createSVG(div);
	let colorScaleTemp = d3.scaleSequential(d3.interpolateRdYlBu).domain([maxTemp, minTemp]);
	function createSVG(div) {
		margin = { top: 20, right: 50, bottom: 30, left: 50 };
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
		data = data.slice(-20);
		temp = temp.slice(-20);
		time = time.slice(-20);
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
			.attr('class', 'dot') // Assign a class for styling
			.attr('fill',(d,i)=>colorScaleTemp(temp[i]));

		dots
			.attr('cx', function(d, i) {
				return xScale(i);
			})
			.attr('cy', function(d) {
				return yScale(d);
			})
			.attr('r', 5);

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

			
		}
	}

	return div.toReact();
}

export default LineGraph;
