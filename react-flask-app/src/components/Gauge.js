import ReactFauxDOM from 'react-faux-dom';
import './Gauge.css';
import * as d3 from 'd3';

function Gauge({ data, width, height, minValue, maxValue, value, throttle }) {
	const pi = Math.PI;
	const startAngle = -pi / 2;
	const endAngle = -startAngle;
	let div = new ReactFauxDOM.Element('div');
	let margin, graphHeight, graphWidth;
	let svg = createSVG(div);
	let colorScaleThrottle = d3.scaleSequential(d3.interpolateOranges).domain([0, 100]);
	createGaugeBackground(svg);
	createGauge(svg);
	createText(svg);

	function createSVG(div) {
		margin = { top: 20, right: 20, bottom: 20, left: 20 };
		graphWidth = width - 50 - margin.left - margin.right;
		graphHeight = height - margin.top - margin.bottom;

		const cent = { x: graphWidth / 2 , y: graphHeight / 2 + 45 };

		return (
			d3
				.select(div)
				.append('svg')
				.attr('preserveAspectRatio', 'xMinYMin meet')
				.attr('viewBox', '0 0 ' + graphWidth + ' ' + graphHeight)
				// .attr('width', graphWidth + margin.left + margin.right)
				// .attr('height', graphHeight + margin.top + margin.bottom)
				.append('g')
				.attr('transform', `translate(${cent.x},${cent.y})`)
		);
	}

	function createGaugeBackground(svg) {
		let n = 20;
		let data_background = [ startAngle, pi / 16, 5 * pi / 16 ];
		let pie_background = data_background.slice(0);
		let colors = [ 'green', 'yellow', 'red' ];
		let colorScale = (d, i) => colors[i];

		pie_background.push(endAngle);

		var arc = d3
			.arc()
			.innerRadius(graphWidth / 4)
			.outerRadius(graphWidth / 4 - 10)
			.startAngle(function(d) {
				return d;
			})
			.endAngle(function(d, i) {
				return pie_background[i + 1];
			});

		var slice = svg.append('g').selectAll('path.slice').data(data_background);

		slice
			.enter()
			.append('path')
			.attr('class', 'slice')
			.attr('d', arc)
			.attr('fill', function(d, i) {
				return colorScale(d, i);
			})
			.attr('stroke', 'black')
			.attr('stroke-width', 0);
		// .attr('stroke', function(d,i) {
		// 	return colorScale(d,i);
		// // })
		// .attr('stroke-width', 4);
	}

	function createGauge(svg) {
		let angle = d3.scaleLinear().range([ startAngle, endAngle ]).domain([ minValue, maxValue ]);
		let _data = [];
		_data.push(data);
		// const color = d3.scaleOrdinal(d3['schemeSet3']);
		// color.domain(data.map((d) => getMidi(d)));

		const pie = d3.pie().sort(null).value((e) => e);
		const arcPath = d3
			.arc()
			.innerRadius(graphWidth / 4)
			.outerRadius(graphWidth / 4 - 10)
			.startAngle(endAngle)
			.endAngle((e) => angle(e));
		const paths = svg.selectAll('path.gauge').data(_data);
		paths
			.enter()
			.append('path')
			.attr('class', 'arc')
			.attr('fill', 'darkblue')
			.attr('opacity', '1')
			.attr('stroke', 'black')
			.attr('stroke-width', 5)
			.attr('d', arcPath);
	}
	function createText(svg) {
		let marker = svg.selectAll('text').data([ value ]).enter();
		marker
			.append('text')
			.attr('id', 'marker')
			.attr('font-size', graphHeight / 4)
			.attr('x', 0)
			.attr('y', 0)
			.attr('style', "fill: "+colorScaleThrottle(throttle))
			.text((d) => d);
	}
	return div.toReact();
}

export default Gauge;
