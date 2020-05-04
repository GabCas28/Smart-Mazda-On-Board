import ReactFauxDOM from 'react-faux-dom';
import './Gauge.css';
import * as d3 from 'd3';


function Gauge(props) {
	const maxX = props.n_notes;
	const maxY = 127;
	let div = new ReactFauxDOM.Element('div');

	let data = Array.from(props.messages).filter((e) => getMidi(e) < maxX);

	const color = d3.scaleOrdinal(d3['schemeSet3']);
	color.domain(data.map((d) => getMidi(d)));

	const margin = { top: 20, right: 20, bottom: 20, left: 20 },
		graphWidth = props.width - 50 - margin.left - margin.right,
		graphHeight = props.height - margin.top - margin.bottom;

	const cent = { x: graphWidth / 2 + 5, y: graphHeight / 2 + 5 };

	let ro = d3.scaleLinear().range([ 0, graphWidth / 2 ]);
	let y = d3.scaleLinear().range([ graphHeight, 0 ]);

	ro.domain([ 0, Math.min(cent.x, cent.y) ]);
	y.domain([ 0, maxY ]);

	let svg = d3
		.select(div)
		.append('svg')
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 "+graphWidth+" "+graphHeight)
		// .attr('width', graphWidth + margin.left + margin.right)
		// .attr('height', graphHeight + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${cent.x},${cent.y})`);

	const pie = d3.pie().sort(null).value((e) => 12);
	const arcPath = d3.arc().innerRadius(0).outerRadius((e) => ro(getValue(e.data)));
	const paths = svg.selectAll('path').data(pie(data));
	paths
		.enter()
		.append('path')
		.attr('class', 'arc')
		.attr('fill', (d) => color(getMidi(d.data)))
		.attr('d', (d) => arcPath(d))
		.attr('stroke', 'black')
		.attr('stroke-width', 3);

	return div.toReact();
}

export default Gauge;
