import React, { Component } from 'react';
import axios from 'axios'
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class SplineChart extends Component {
	constructor(props){
		super(props)
		this.state = {
			apiData: []
		}
	}

	async componentDidMount(){
		this.callApi()
		setInterval(() => {
			this.callApi()
		}, 5000);
	}

	callApi = async () => {
		const res = await this.getData()
		if(res.status){
			this.setState({apiData : res.data.prices})
		}
	}

	getData = () =>{
		return axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1`)
		.then(res=>{
			return { status: true, data: res.data }
		})
		.catch((err) => { 
			return { status: false, msg : err.response.data.error }
		})
	}

	dataPoints = () => {
		const { apiData } = this.state
		const arr = []
		if(apiData.length > 0){
			apiData.map((val, key)=>{
				const obj = {
					x: new Date(val[0]),
					y: val[1]
				}
				arr.push(obj)
				return arr
			})
		}
		return arr
	}

	render() {
		const options = {
			animationEnabled: true,
			title:{
				text: "Daily Bitcon Market Cap."
			},
			axisX: {
				title: "Time",
				valueFormatString: "HH:mm"
			},
			axisY: {
				title: "Market Cap (in USD)",
				prefix: "$",
				includeZero: false
			},
			data: [{
				yValueFormatString: "$#,###",
				xValueFormatString: "HH:mm",
				type: "spline",
				dataPoints: this.dataPoints()
			}]
		}
		
		return (
		<div>
			<CanvasJSChart options = {options}/>
		</div>
		);
	}
}

export default SplineChart;                           