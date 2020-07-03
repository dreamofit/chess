import React, { Component } from 'react'

export default class Best extends Component {

    constructor(props){
        super(props);
        this.state={

        }
    }

    componentWillMount = () => {
        console.log("**************this alpha_beta test**************");
        let chess = [];
        let pos = [];
        chess.push(2);
        chess.push(1);
        chess.push(4);
        let alpha = -Infinity;
        let beta = Infinity;
        let v = this.alpha_beta(4,chess,pos,alpha,beta);
        console.log("v:"+v);
    }

    alpha_beta = (depth,chess,pos,alpha,beta) => {
        if(depth === 0){
            let f = 0;
            for(let i=0;i<pos.length;i++){
                console.log(pos[i]);
                f += pos[i];
            }
            console.log("f:"+f);
            return f;
        }
        for(let i=0;i<3;i++){
            pos.push(chess[i]);
            let score = this.alpha_beta(depth-1,chess,pos,alpha,beta);
            pos.pop();
            //console.log("val:"+score+" alpha:"+alpha+" beta:"+beta);
            if(depth % 2 === 0) {  //MAX
                if(score > alpha){
                    console.log("i:"+i);
                    alpha = score;
                }
                if(alpha >= beta){ 
                    return alpha;
                }
            }else{
                if(score < beta ){
                    beta = score;
                }
                if(alpha >= beta){
                    return beta;
                }
            }
        }
        return depth%2===0?alpha:beta;
    }

    _alpha_beta = (depth, temp, pos, x, y, player, enemy, alpha, beta) => { //αβ剪枝算法

        //let temp = this.clone(chess);
        //console.log("depth:"+depth);
    
        //const level = this.state.level; //搜索深度
        const level = 2;
        if (depth === 0) {
          let tp = temp[x][y];
          temp[x][y] = 0;
          //console.log("1");
          //console.log("temp:" + temp);
          let sc = this.allScore(x, y, player, temp);
          temp[x][y] = tp;
          console.log("temp:" + temp);
          //console.log("x:"+x+" y:"+y);
          //console.log("score:"+sc.sum+"     p:"+sc.positionScore+" a:"+sc.attackScore+" d:"+sc.defendScore);
          //if(sc.sum>=7){
          console.log("x:"+x+" y:"+y);
          console.log("score:"+sc.sum+"     p:"+sc.positionScore+" a:"+sc.attackScore+" d:"+sc.defendScore);
          //}
          return sc.sum; //返回什么呢？当前位置得分
        }
        for (let i = 0; i < 15; i++) {
          for (let j = 0; j < 15; j++) {
            if (temp[i][j] === 0) {
              if (depth % 2 === 0) {
                temp[i][j] = player;
              } else {
                temp[i][j] = enemy;
              }
            } else {
              continue;
            }
            //console.log("pre ==>> i:"+i+" j:"+j);
            let score = this.alpha_beta(depth - 1, temp, pos, i, j, 1, 2, alpha, beta);
            //console.log("last ==>> i:"+i+" j:"+j);
            temp[i][j] = 0;
            if (depth % 2 === 0) {  //MAX
              if (score > alpha) {
                //console.log("i:" + i);
                alpha = score;
              }
              if (alpha >= beta) {
                return alpha;
              }
            } else {  //MIN
              if (score < beta) {
                beta = score;
              }
              if (alpha >= beta) {
                return beta;
              }
            }
          }
        }
        //console.log("alpha:" + alpha + " beta:" + beta);
        return depth % 2 === 0 ? alpha : beta;
      }
    
      alpha_beta_ai = () => { //使用αβ剪枝算法的AI
        const { chess } = this.state;
        let temp = this.clone(chess);
        let pos = [];
        let value = this.alpha_beta(3, temp, pos, 0, 0, 1, 2, -Infinity, Infinity);
        console.log(value);
        for (let i = 0; i < pos.length; i++) {
          //if(value===pos[i].value){
          console.log(pos[i].x + " " + pos[i].y);
          // }
    
        }
      }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}
