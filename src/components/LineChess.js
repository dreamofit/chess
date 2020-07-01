import React, { Component } from 'react'
import Style from '../css/style';
export default class LineChess extends Component {

    constructor(props){
        super(props);
    }

    eventClick = (index) => {
        let x = index;
        let y = this.props.y;
        this.props.eventClick(x,y);
    }

    getOrder = (x,y) => {
        const {orderTable} = this.props;
        for(let i=0;i<orderTable.length;i++){
            if(orderTable[i].x===x&&orderTable[i].y===y){
                return (i+1);
            }
        }
        return 0;
    }

    render() {
        const {set,top,y,orderTable} = this.props;
        let color = "#8C9EFF";

        return (
            <div>
                {
                    set.map((data,index)=>{
                        if(data===0){
                            return <div key={index} onClick={this.eventClick.bind(this,index)} style={{...Style.allChess,top:top,left:10+index*36}}></div>
                        }else if(data===1){
                            if(orderTable[orderTable.length-1].x===index&&orderTable[orderTable.length-1].y===y){
                                color = "#C51162";
                            }else{
                                color = "#8C9EFF";
                            }
                        return <div key={index} style={{...Style.white,top:top,left:10+index*36,color:color}}>{this.getOrder(index,y)}</div>
                        }else if(data===2){
                            if(orderTable[orderTable.length-1].x===index&&orderTable[orderTable.length-1].y===y){
                                color = "#C51162";
                            }else{
                                color = "#8C9EFF";
                            }
                        return <div key={index} style={{...Style.black,top:top,left:10+index*36,color:color}}>{this.getOrder(index,y)}</div>
                        }
                        return true;
                    })
                }
            </div>
        )
    }
}
