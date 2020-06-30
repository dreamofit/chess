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

    render() {
        const {set,top} = this.props;
        return (
            <div>
                {
                    set.map((data,index)=>{
                        if(data===0){
                            return <div key={index} onClick={this.eventClick.bind(this,index)} style={{...Style.allChess,top:top,left:10+index*36}}></div>
                        }else if(data===1){
                            return <div key={index} style={{...Style.white,top:top,left:10+index*36}}></div>
                        }else if(data===2){
                            return <div key={index} style={{...Style.black,top:top,left:10+index*36}}></div>
                        }
                        return true;
                    })
                }
            </div>
        )
    }
}
