import React, { Component } from 'react'
import Style from './css/style'
import LineChess from './components/LineChess';

export default class app extends Component {

  constructor(props) {
    super(props);
    this.state = {
      num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      chess: [],
      currentStep: 1,
      border: {
        left: 3,
        top: 3,
        right: 11,
        bottom: 11
      }, //边界左、上、右、下(中心减加4)
      SCORESHEET: {
        PERFECT: 1000000, //五子长连获胜
        LIVE_4: 10000, //活4
        RUSH_4: 5000, //冲4
        LIVE_3: 5000, //活3
        SLEEP_3: 300, //眠3
        LIVE_2: 100, // 活2
        SLEEP_2: 50, //眠2
        DEAD: -5, //不能形成5个子
      }, //这里评分规则考虑了双活三、双冲4、活三冲4、活4等必胜组合棋形
      isGameOver:false,
      winner:""
    }
  }

  componentWillMount =()=>{ //初始化棋盘
    let chess = [];
    for(let i=0;i<15;i++){
      chess[i] = [];
      for(let j=0;j<15;j++){
        chess[i][j] = 0;
      }
    }
    this.setState({chess});
  }

  borderChange = (x, y) => {
    let border = this.state.border;
    if (x - 4 < border.left) {
      if (x - 4 < 0) {
        border.left = 0;
      } else {
        border.left = x - 4;
      }
    }
    if (x + 4 > border.right) {
      if (x + 4 > 14) {
        border.right = 14;
      } else {
        border.right = x + 4;
      }

    }
    if (y - 4 < border.top) {
      if (y - 4 < 0) {
        border.top = 0;
      } else {
        border.top = y - 4;
      }

    }
    if (y + 4 > border.bottom) {
      if (y + 4 > 14) {
        border.bottom = 14;
      } else {
        border.bottom = y + 4;
      }

    }
    this.setState({ border });
  }

  positionScore = (x, y) => { //越接近中心，分数越高
    let min = x > y ? y : x;
    let max = x > y ? x : y;
    if (max <= 7) {
      return min;
    } else {
      return (14 - max)
    }
  }

  reverse = (str) => {
    return str.split("").reverse().join("");
  }

  oneLineScore = (line, player) => { //当前直线player得分
    //console.log("line:" + line);
    const SCORESHEET = this.state.SCORESHEET;
    //评分标准：优先考虑最前面的

    /*    五子成线 */
    const PERFECT = "" + player + player + player + player + player + "";//获胜
    //console.log(PERFECT);
    if (line.indexOf(PERFECT) !== -1) {
      return SCORESHEET.PERFECT;
    }

    /*    活四  */
    const LIVE_4 = "0" + player + player + player + player + "0";//活四
    //console.log(LIVE_4);
    if (line.indexOf(LIVE_4) !== -1) {
      return SCORESHEET.LIVE_4;
    }

    /*    冲四  */
    const RUSH_4 = "0" + player + player + player + player; //墙 or 敌人,不需要管，优先上面的处理
    const RUSH_4_2 = "" + player + "0" + player + player + player;
    const RUSH_4_3_OFF = "" + player + player + "0" + player + player;
    if (line.indexOf(RUSH_4) !== -1 || line.indexOf(this.reverse(RUSH_4)) !== -1 ||
      line.indexOf(RUSH_4_2) !== -1 || line.indexOf(this.reverse(RUSH_4_2)) !== -1 ||
      line.indexOf(RUSH_4_3_OFF) !== -1) {
      return SCORESHEET.RUSH_4;
    }


    /*    活三  */
    const LIVE_3 = "0" + player + player + player + "00";
    const LIVE_3_2 = "0" + player + "0" + player + player + "0";
    if (line.indexOf(LIVE_3) !== -1 || line.indexOf(this.reverse(LIVE_3)) !== -1 ||
      line.indexOf(LIVE_3_2) !== -1 || line.indexOf(this.reverse(LIVE_3_2)) !== -1) {
      return SCORESHEET.LIVE_3;
    }

    /*    眠三  */
    const SLEEP_3_1 = "00" + player + player + player;
    const SLEEP_3_2 = "0" + player + "0" + player + player;
    const SLEEP_3_3 = "0" + player + player + "0" + player;
    const SLEEP_3_4 = "" + player + "0" + "0" + player + player;
    const SLEEP_3_5_OFF = "" + player + "0" + player + "0" + player;
    const SLEEP_3_6_OFF = "0" + player + player + player + "0";

    if (line.indexOf(SLEEP_3_1) !== -1 || line.indexOf(this.reverse(SLEEP_3_1)) !== -1 ||
      line.indexOf(SLEEP_3_2) !== -1 || line.indexOf(this.reverse(SLEEP_3_2)) !== -1 ||
      line.indexOf(SLEEP_3_3) !== -1 || line.indexOf(this.reverse(SLEEP_3_3)) !== -1 ||
      line.indexOf(SLEEP_3_4) !== -1 || line.indexOf(this.reverse(SLEEP_3_4)) !== -1 ||
      line.indexOf(SLEEP_3_5_OFF) !== -1 ||
      line.indexOf(SLEEP_3_6_OFF) !== -1) {
      return SCORESHEET.SLEEP_3;
    }

    /*    活二  */
    const LIVE_2_1 = "000" + player + player + "0";
    const LIVE_2_2_OFF = "00" + player + player + "00";
    const LIVE_2_3 = "0" + player + "0" + player + "00";
    const LIVE_2_4_OFF = "0" + player + "00" + player + "0";
    if (line.indexOf(LIVE_2_1) !== -1 || line.indexOf(this.reverse(LIVE_2_1)) !== -1 ||
      line.indexOf(LIVE_2_2_OFF) !== -1 ||
      line.indexOf(LIVE_2_3) !== -1 || line.indexOf(this.reverse(LIVE_2_3)) !== -1 ||
      line.indexOf(LIVE_2_4_OFF) !== -1) {
      return SCORESHEET.LIVE_2;
    }

    /*    眠二  */
    const SLEEP_2_1 = "000" + player + player;
    const SLEEP_2_2 = "00" + player + "0" + player;
    const SLEEP_2_3 = "0" + player + "00" + player;
    const SLEEP_2_4_OFF = "" + player + "000" + player;
    const SLEEP_2_5_OFF = "0" + player + "0" + player + "0";
    const SLEEP_2_6 = "0" + player + player + "00";
    if (line.indexOf(SLEEP_2_1) !== -1 || line.indexOf(this.reverse(SLEEP_2_1)) !== -1 ||
      line.indexOf(SLEEP_2_2) !== -1 || line.indexOf(this.reverse(SLEEP_2_2)) !== -1 ||
      line.indexOf(SLEEP_2_3) !== -1 || line.indexOf(this.reverse(SLEEP_2_3)) !== -1 ||
      line.indexOf(SLEEP_2_4_OFF) !== -1 ||
      line.indexOf(SLEEP_2_5_OFF) !== -1 ||
      line.indexOf(SLEEP_2_6) !== -1 || line.indexOf(this.reverse(SLEEP_2_6)) !== -1) {
      return SCORESHEET.SLEEP_2;
    }

    /*    死子  */
    const DEAD_4_OFF = "" + player + player + player + player;
    const DEAD_3_OFF = "" + player + player + player;
    const DEAD_2_OFF = "" + player + player;
    if (line.indexOf(DEAD_4_OFF) !== -1 ||
      line.indexOf(DEAD_3_OFF) !== -1 ||
      line.indexOf(DEAD_2_OFF) !== -1) {
      return SCORESHEET.DEAD;
    }
    return 0;
  }



  getCurrentScore = (x, y, player,chess) => { //打分当前player落子得分
    let border = { left: x - 4, top: y - 4, right: x + 5, bottom: y + 5 }
    if (x - 4 < 0) {
      border.left = 0;
    }
    if (x + 5 > 15) {
      border.right = 15;
    }
    if (y - 4 < 0) {
      border.top = 0;
    }
    if (y + 5 > 15) {
      border.bottom = 15;
    }
    let horizontal = chess[y].slice(border.left, border.right).join("");
    let vertical = "";
    for (let j = border.top; j < border.bottom; j++) {
      vertical += chess[j][x];
    }
    let skim = "";
    for (let i = (x - 4), j = (y + 4); i < border.right; i++, j--) {
      if (i < 0 || j < 0 || i > 14 || j > 14) {
        continue;
      } else {
        skim += chess[j][i];
      }
    }
    let poke = "";
    for (let i = (x - 4), j = (y - 4); i < border.right; i++, j++) {
      if (i < 0 || j < 0 || i > 14 || j > 14) {
        continue;
      } else {
        poke += chess[j][i];
      }
    }
    let hs = this.oneLineScore(horizontal, player);
    let vs = this.oneLineScore(vertical, player);
    let ss = this.oneLineScore(skim,player);
    let ps = this.oneLineScore(poke,player);
    let score = hs+vs+ss+ps;
    return score;
  }

  allScore = (x,y,player,chess) => { //综合得分，包括攻击分、防守分、位置分
    let enemy = 1;
    if(player===1){
      enemy = 2;
    }
    let positionScore = this.positionScore(x,y);
    //console.log("x:"+x+" y:"+y);
    chess[y][x] = player;
    let attackScore = this.getCurrentScore(x,y,player,chess);
    chess[y][x] = enemy;
    let defendScore = this.getCurrentScore(x,y,enemy,chess);
    let score = {
      positionScore:positionScore,
      attackScore:attackScore,
      defendScore:defendScore,
      sum:positionScore+attackScore+defendScore
    }
    chess[y][x] = 0;
    //console.log("位置分："+positionScore);
    //console.log("攻击分:"+attackScore);
    //console.log("防守分:"+defendScore);
    //console.log("总得分:"+score);
    return score;
  }

  nextStep = (x, y) => {
    this.borderChange(x, y);
    const { currentStep, chess , SCORESHEET ,isGameOver , winner } = this.state;
    let temp = chess;
    
    if (currentStep % 2 === 0) {  
      if(this.allScore(x, y, 2,temp).attackScore>=SCORESHEET.PERFECT){
        
        this.setState({isGameOver:true,winner:"黑方获胜"});
      }
      temp[y][x] = 2;
    } else {
      if(this.allScore(x, y, 1,temp).attackScore>=SCORESHEET.PERFECT){
        console.log("白子获胜");
        this.setState({isGameOver:true,winner:"白方获胜"});
      }
      temp[y][x] = 1;
    }
    let isDraw = true;
    for(let i=0;i<15;i++){
      for(let j=0;j<15;j++){
        if(chess[i][j]===0){
          isDraw = false;
          break;
        }
      }
    }
    if(isDraw){
      this.setState({isGameOver:true,winner:"和棋"})
    }
    this.setState({ chess: temp, currentStep: currentStep + 1 });
  }

  eventClick = (x,y) => {
    const {isGameOver} = this.state;
    if(isGameOver){
      return;
    }
    //this.nextStep(x,y);
    this.easyAI(1);
    setTimeout(() => {
      this.easyAI(2);
    }, 10);
    
  }

  easyAI = (player) => { //简单智能
    const {border,chess} = this.state;
    let max = {s:-1000000,x:-1,y:-1};
    for(let j=border.top;j<=border.bottom;j++){
      for(let i=border.left;i<=border.right;i++){
        //计算(i,j)点的得分,并与max进行比较，超过则替换
        if(chess[j][i]===0){
          let s = this.allScore(i,j,player,chess).sum;
          if(s>max.s){
            max.s = s;
            max.x = i;
            max.y = j;
          }else if(s===max.s){ //处理一样的情况，随机选择
            let rand = Math.round(Math.random()*100); 
            if(rand<30){
              max.s = s;
              max.x = i;
              max.y = j;
            }
          }
        }
      }
    }
    if(max.x===-1||max.y===-1){
      return;
    }
    this.nextStep(max.x,max.y);
  }

  render() {
    const { chess, num , winner ,isGameOver } = this.state;
    let width = 0;
    let height = 0;
    if(isGameOver){
      width = 200;
      height = 100;
    }
    return (
      <div style={Style.all}>
        <div style={{ ...Style.blackPoint, top: 124, left: 124 }}></div>
        <div style={{ ...Style.blackPoint, top: 124, left: 412 }}></div>
        <div style={{ ...Style.blackPoint, top: 412, left: 124 }}></div>
        <div style={{ ...Style.blackPoint, top: 412, left: 412 }}></div>
        <div style={{ ...Style.blackPoint, top: 268, left: 268 }}></div>
        {
          chess.map((set, index) => {
            return <LineChess key={index} eventClick={this.eventClick} y={index} set={set} top={10 + index * 36}></LineChess>

          })
        }

        <div style={Style.checkerboard}>
          {
            num.map((data, index) => {
              return <div key={index} style={Style.VerticalLine}></div>
            })
          }
          {
            num.map((data, index) => {
              return <div  key={index} style={Style.HorizontalLine}></div>
            })
          }
        </div>
        <div style={{...Style.gameOver,width:width,height:height}}>{winner}</div>
      </div>
    )
  }
}
