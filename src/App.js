import React, { Component } from 'react'
import Style from './css/style'
import LineChess from './components/LineChess';

export default class app extends Component {

  constructor(props) {
    super(props);
    this.state = {
      num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      chess: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],],
      currentStep:1

    }
  }

  nextStep = (x,y) => {
    const {currentStep,chess} = this.state;
    let temp = chess;
    if(currentStep%2==0){
     temp[y][x]=2;
    }else{
      temp[y][x]=1;
    }
    this.setState({chess:temp,currentStep:currentStep+1})
  }

  render() {
    const { chess, num , currentStep } = this.state;
    let t = 0;
    let l = -36;
    return (
      <div style={Style.all}>
        <div style={{...Style.blackPoint,top:124,left:124}}></div>
        <div style={{...Style.blackPoint,top:124,left:412}}></div>
        <div style={{...Style.blackPoint,top:412,left:124}}></div>
        <div style={{...Style.blackPoint,top:412,left:412}}></div>
        <div style={{...Style.blackPoint,top:268,left:268}}></div>
        {
          chess.map((set,index)=>{
            return <LineChess nextStep={this.nextStep} y={index} set={set} top={10+index*36}></LineChess>
            
          })
        }
        
        <div style={Style.checkerboard}>
          {
            num.map((data, index) => {
              return <div style={Style.VerticalLine}></div>
            })
          }
          {
            num.map((data, index) => {
              return <div style={Style.HorizontalLine}></div>
            })
          }
        </div>
        
      </div>
    )
  }
}
