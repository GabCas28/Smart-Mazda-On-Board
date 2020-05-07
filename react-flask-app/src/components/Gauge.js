import ReactFauxDOM from 'react-faux-dom';
import './Gauge.css';
import * as d3 from 'd3';

function Gauge(props) {
	const pi = Math.PI;
	const startAngle = -pi / 2;
	const endAngle = -startAngle;
	let div = new ReactFauxDOM.Element('div');
	let svg = createSVG(div);
	createGaugeBackground(svg);
	createGauge(svg);
	
	function createSVG(div) {
		const margin = { top: 20, right: 20, bottom: 20, left: 20 },
			graphWidth = props.width - 50 - margin.left - margin.right,
			graphHeight = props.height - margin.top - margin.bottom;

		const cent = { x: graphWidth / 2 + 5, y: graphHeight / 2 + 5 };

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
		let data_background = d3.range(startAngle, endAngle, pi / n);

		let pie_background = data_background.slice(0);
		let colorScale = d3
			.scaleSequential(d3.interpolateRdYlGn)
			.domain([ data_background[data_background.length - 1], data_background[0] ]);

		pie_background.push(endAngle);

		var arc = d3
			.arc()
			.innerRadius(40)
			.outerRadius(50)
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
			.attr('fill', function(d) {
				return colorScale(d);
			})
			.attr('stroke', function(d) {
				return colorScale(d);
			})
			.attr('stroke-width', 4);
	}

	function createGauge(svg) {
		let angle = d3.scaleLinear().range([ startAngle, endAngle ]).domain([ 0, 8000 ]);
		let _data = [];
		_data.push(props.data.rpm);
		// const color = d3.scaleOrdinal(d3['schemeSet3']);
		// color.domain(data.map((d) => getMidi(d)));

		const pie = d3.pie().sort(null).value((e) => e);
		const arcPath = d3.arc().innerRadius(35).outerRadius(55).startAngle(endAngle).endAngle((e) => angle(e));
		const paths = svg.selectAll('path.gauge').data(_data);
		paths.enter().append('path').attr('class', 'arc').attr('fill', 'black').attr('d', arcPath);
	}

	return div.toReact();
}

export default Gauge;
