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
        SLEEP_3: 500, //眠3
        LIVE_2: 100, // 活2
        SLEEP_2: 50, //眠2
        DEAD: -5, //不能形成5个子
      } //这里评分规则考虑了双活三、双冲4、活三冲4、活4等必胜组合棋形
    }
  }

  componentWillMount =()=>{ //初始化棋盘
    let chess = new Array();
    for(let i=0;i<15;i++){
      chess[i] = new Array();
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
    console.log("line:" + line);
    const SCORESHEET = this.state.SCORESHEET;
    //评分标准：优先考虑最前面的

    /*    五子成线 */
    const PERFECT = "" + player + player + player + player + player + "";//获胜
    //console.log(PERFECT);
    if (line.indexOf(PERFECT) != -1) {
      return SCORESHEET.PERFECT;
    }

    /*    活四  */
    const LIVE_4 = "0" + player + player + player + player + "0";//活四
    //console.log(LIVE_4);
    if (line.indexOf(LIVE_4) != -1) {
      return SCORESHEET.LIVE_4;
    }

    /*    冲四  */
    const RUSH_4 = "0" + player + player + player + player; //墙 or 敌人,不需要管，优先上面的处理
    const RUSH_4_2 = "" + player + "0" + player + player + player;
    const RUSH_4_3_OFF = "" + player + player + "0" + player + player;
    if (line.indexOf(RUSH_4) != -1 || line.indexOf(this.reverse(RUSH_4)) != -1 ||
      line.indexOf(RUSH_4_2) != -1 || line.indexOf(this.reverse(RUSH_4_2)) != -1 ||
      line.indexOf(RUSH_4_3_OFF) != -1) {
      return SCORESHEET.RUSH_4;
    }


    /*    活三  */
    const LIVE_3 = "0" + player + player + player + "00";
    const LIVE_3_2 = "0" + player + "0" + player + player + "0";
    if (line.indexOf(LIVE_3) != -1 || line.indexOf(this.reverse(LIVE_3)) != -1 ||
      line.indexOf(LIVE_3_2) != -1 || line.indexOf(this.reverse(LIVE_3_2)) != -1) {
      return SCORESHEET.LIVE_3;
    }

    /*    眠三  */
    const SLEEP_3_1 = "00" + player + player + player;
    const SLEEP_3_2 = "0" + player + "0" + player + player;
    const SLEEP_3_3 = "0" + player + player + "0" + player;
    const SLEEP_3_4 = "" + player + "0" + "0" + player + player;
    const SLEEP_3_5_OFF = "" + player + "0" + player + "0" + player;
    const SLEEP_3_6_OFF = "0" + player + player + player + "0";

    if (line.indexOf(SLEEP_3_1) != -1 || line.indexOf(this.reverse(SLEEP_3_1)) != -1 ||
      line.indexOf(SLEEP_3_2) != -1 || line.indexOf(this.reverse(SLEEP_3_2)) != -1 ||
      line.indexOf(SLEEP_3_3) != -1 || line.indexOf(this.reverse(SLEEP_3_3)) != -1 ||
      line.indexOf(SLEEP_3_4) != -1 || line.indexOf(this.reverse(SLEEP_3_4)) != -1 ||
      line.indexOf(SLEEP_3_5_OFF) != -1 ||
      line.indexOf(SLEEP_3_6_OFF) != -1) {
      return SCORESHEET.SLEEP_3;
    }

    /*    活二  */
    const LIVE_2_1 = "000" + player + player + "0";
    const LIVE_2_2_OFF = "00" + player + player + "00";
    const LIVE_2_3 = "0" + player + "0" + player + "00";
    const LIVE_2_4_OFF = "0" + player + "00" + player + "0";
    if (line.indexOf(LIVE_2_1) != -1 || line.indexOf(this.reverse(LIVE_2_1)) != -1 ||
      line.indexOf(LIVE_2_2_OFF) != -1 ||
      line.indexOf(LIVE_2_3) != -1 || line.indexOf(this.reverse(LIVE_2_3)) != -1 ||
      line.indexOf(LIVE_2_4_OFF) != -1) {
      return SCORESHEET.LIVE_2;
    }

    /*    眠二  */
    const SLEEP_2_1 = "000" + player + player;
    const SLEEP_2_2 = "00" + player + "0" + player;
    const SLEEP_2_3 = "0" + player + "00" + player;
    const SLEEP_2_4_OFF = "" + player + "000" + player;
    const SLEEP_2_5_OFF = "0" + player + "0" + player + "0";
    const SLEEP_2_6 = "0" + player + player + "00";
    if (line.indexOf(SLEEP_2_1) != -1 || line.indexOf(this.reverse(SLEEP_2_1)) != -1 ||
      line.indexOf(SLEEP_2_2) != -1 || line.indexOf(this.reverse(SLEEP_2_2)) != -1 ||
      line.indexOf(SLEEP_2_3) != -1 || line.indexOf(this.reverse(SLEEP_2_3)) != -1 ||
      line.indexOf(SLEEP_2_4_OFF) != -1 ||
      line.indexOf(SLEEP_2_5_OFF) != -1 ||
      line.indexOf(SLEEP_2_6) != -1 || line.indexOf(this.reverse(SLEEP_2_6)) != -1) {
      return SCORESHEET.SLEEP_2;
    }

    /*    死子  */
    const DEAD_4_OFF = "" + player + player + player + player;
    const DEAD_3_OFF = "" + player + player + player;
    const DEAD_2_OFF = "" + player + player;
    if (line.indexOf(DEAD_4_OFF) != -1 ||
      line.indexOf(DEAD_3_OFF) != -1 ||
      line.indexOf(DEAD_2_OFF) != -1) {
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

  sumScore = (x,y,player,chess) => { //综合得分，包括攻击分、防守分、位置分
    let enemy = 1;
    if(player===1){
      enemy = 2;
    }
    let positionScore = this.positionScore(x,y);
    chess[y][x] = player;
    let attackScore = this.getCurrentScore(x,y,player,chess);
    chess[y][x] = enemy;
    let defendScore = this.getCurrentScore(x,y,enemy,chess);
    let score = positionScore+attackScore+defendScore;
    console.log("位置分："+positionScore);
    console.log("攻击分:"+attackScore);
    console.log("防守分:"+defendScore);
    console.log("总得分:"+score);
    return score;
  }

  nextStep = (x, y) => {
    this.borderChange(x, y);
    const { currentStep, chess } = this.state;
    let temp = chess;
    
    if (currentStep % 2 == 0) {  
      this.sumScore(x, y, 2,temp);
      temp[y][x] = 2;
    } else {
      this.sumScore(x, y, 1,temp);
      temp[y][x] = 1;
    }
    this.setState({ chess: temp, currentStep: currentStep + 1 })
  }

  easyAI = () => { //简单智能，控制黑子

  }

  render() {
    const { chess, num, currentStep } = this.state;
    let t = 0;
    let l = -36;
    return (
      <div style={Style.all}>
        <div style={{ ...Style.blackPoint, top: 124, left: 124 }}></div>
        <div style={{ ...Style.blackPoint, top: 124, left: 412 }}></div>
        <div style={{ ...Style.blackPoint, top: 412, left: 124 }}></div>
        <div style={{ ...Style.blackPoint, top: 412, left: 412 }}></div>
        <div style={{ ...Style.blackPoint, top: 268, left: 268 }}></div>
        {
          chess.map((set, index) => {
            return <LineChess nextStep={this.nextStep} y={index} set={set} top={10 + index * 36}></LineChess>

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
