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
        LIVE_4: 11000, //活4
        COMB: 10000,
        RUSH_4: 5000, //冲4
        LIVE_3: 5000, //活3
        SLEEP_3: 300, //眠3
        LIVE_2: 100, // 活2
        SLEEP_2: 50, //眠2
        DEAD: -5, //不能形成5个子
      }, //这里评分规则考虑了双活三、双冲4、活三冲4、活4等必胜组合棋形
      isGameOver: false,
      winner: "",
      orderTable: [],//记录每次落子的坐标{x，y}
      level: 3, //搜索深度，暂定为7.单数为己方
    }
  }

  componentWillMount = () => { //初始化棋盘
    let chess = [];
    for (let i = 0; i < 15; i++) {
      chess[i] = [];
      for (let j = 0; j < 15; j++) {
        chess[i][j] = 0;
      }
    }
    this.setState({ chess });
  }

  getBorderChange = (x, y, border) => {
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
    return border;
  }

  borderChange = (x, y) => {
    let border = this.state.border;
    border = this.getBorderChange(x, y, border);
    this.setState({ border });
  }

  positionScore = (x, y) => { //越接近中心，分数越高
    let min = x > y ? y : x;
    let max = x > y ? x : y;
    let diff_min = Math.abs(min - 7);
    let diff_max = Math.abs(max - 7);
    if (min < 7 && max < 7) {
      return min;
    } else if (min > 7 && max > 7) {
      return (14 - max);
    } else {
      if (diff_min > diff_max) {
        return min;
      } else {
        return (14 - max);
      }
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



  getCurrentScore = (x, y, player, chess) => { //打分当前player落子得分
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
    let ss = this.oneLineScore(skim, player);
    let ps = this.oneLineScore(poke, player);
    let score = {
      hs: hs,
      vs: vs,
      ss: ss,
      ps: ps,
      sum: hs + vs + ss + ps
    };
    return score;
  }

  allScore = (x, y, player, chess) => { //综合得分，包括攻击分、防守分、位置分
    //需要修改进攻分与防守分，若进攻为活四、长连、活三冲四、双活三等则增加100000，若防守为活四增加90000（若长连则防守不了，优先自己进攻，以我方进攻为主）
    let enemy = 1;
    if (player === 1) {
      enemy = 2;
    }
    const SCORESHEET = this.state.SCORESHEET;
    let positionScore = this.positionScore(x, y);
    //console.log("x:"+x+" y:"+y);
    chess[y][x] = player;
    let attack = this.getCurrentScore(x, y, player, chess);
    let attackScore = attack.sum;
    if (attack.hs >= SCORESHEET.COMB || attack.ps >= SCORESHEET.COMB || attack.ss >= SCORESHEET.COMB || attack.vs >= SCORESHEET.COMB) {
      attackScore += 100000;
    }
    chess[y][x] = enemy;
    let defend = this.getCurrentScore(x, y, enemy, chess);
    let defendScore = defend.sum;
    if (defend.hs === SCORESHEET.LIVE_3 || defend.ps === SCORESHEET.LIVE_3 || defend.ss === SCORESHEET.LIVE_3 || defend.vs === SCORESHEET.LIVE_3) {
      defendScore += 600;
    } else if (defend.hs === SCORESHEET.COMB || defend.ps === SCORESHEET.COMB || defend.ss === SCORESHEET.COMB || defend.vs === SCORESHEET.COMB) {
      defendScore += 90000;
    }
    let score = {
      positionScore: positionScore,
      attackScore: attackScore,
      defendScore: defendScore,
      sum: positionScore + attackScore + defendScore
    }
    chess[y][x] = 0;
    //console.log("y:"+y+" x:"+x);
    //console.log("位置分："+positionScore);
    //console.log("攻击分:"+attackScore);
    //console.log("防守分:"+defendScore);
    //console.log("总得分:"+score.sum);
    return score;
  }

  orderTableChange = (x, y) => {
    let orderTable = this.state.orderTable;
    let point = { x: x, y: y };
    orderTable.push(point);
    this.setState({ orderTable });
  }

  nextStep = (x, y) => {
    this.borderChange(x, y);
    this.orderTableChange(x, y);
    const { currentStep, chess, SCORESHEET, winner } = this.state;
    let isGameOver = this.state.isGameOver;
    let temp = chess;

    if (currentStep % 2 === 0) {
      if (this.allScore(x, y, 2, temp).attackScore >= SCORESHEET.PERFECT) {
        isGameOver = true;
        this.setState({ isGameOver: true, winner: "黑方获胜" });
      }
      temp[y][x] = 2;
    } else {
      if (this.allScore(x, y, 1, temp).attackScore >= SCORESHEET.PERFECT) {
        isGameOver = true;
        this.setState({ isGameOver: true, winner: "白方获胜" });
      }
      temp[y][x] = 1;
    }
    let isDraw = true;
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (chess[i][j] === 0) {
          isDraw = false;
          break;
        }
      }
    }
    if (isDraw) {
      this.setState({ isGameOver: true, winner: "和棋" })
    }
    this.setState({ chess: temp, currentStep: currentStep + 1 });
    return isGameOver;
  }

  eventClick = (x, y) => {
    const { isGameOver } = this.state;
    if (isGameOver) {
      return;
    }
    if (this.nextStep(x, y)) {
      return;
    } else {
      setTimeout(() => {
        //this.easyAI(2);
        this.alpha_beta_ai(2);
      }, 50);
    }

  }

  help = () => {
    const { isGameOver } = this.state;
    if (isGameOver) {
      return;
    }
    this.alpha_beta_ai(1);
    //this.easyAI(1);
    setTimeout(() => {
      this.easyAI(2);
      //this.alpha_beta_ai(2);
    }, 10);

  }


  add = (res, p) => {
    for (let i = 0; i < res.length; i++) {
      if (p.s > res[i].s) {
        for (let j = res.length; j >= i; j--) {
          res[j] = res[j - 1];
        }
        res[i] = p;
        return;
      }
    }
  }

  getOrderScore = (chess,player) => { //统计当前可用节点的分数并排序
    const { border } = this.state;
    let max = { s: -1000000, x: -1, y: -1 };
    let res = [];
    for (let j = border.top; j <= border.bottom; j++) {
      for (let i = border.left; i <= border.right; i++) {
        //计算(i,j)点的得分,并与max进行比较，超过则替换
        if (chess[j][i] === 0) {
          let s = this.allScore(i, j, player, chess).sum;
          let p = { s: s, x: i, y: j };
          if (res.length > 0) {
            this.add(res, p);
          } else {
            res.push(p);
          }
        }
      }
    }
    // for(let i=0;i<res.length;i++){
    //   console.log(res[i].s);
    // }
    return res;
  }

  easyAI = (player) => { //简单智能
    const { chess } = this.state;
    let max = [];
    // for (let j = border.top; j <= border.bottom; j++) {
    //   for (let i = border.left; i <= border.right; i++) {
    //     //计算(i,j)点的得分,并与max进行比较，超过则替换
    //     if (chess[j][i] === 0) {
    //       let s = this.allScore(i, j, player, chess).sum;
    //       if (s > max.s) {
    //         max.s = s;
    //         max.x = i;
    //         max.y = j;
    //       } else if (s === max.s) { //处理一样的情况，随机选择
    //         let rand = Math.round(Math.random() * 100);
    //         if (rand < 30) {
    //           max.s = s;
    //           max.x = i;
    //           max.y = j;
    //         }
    //       }
    //     }
    //   }
    // }
    // if (max.x === -1 || max.y === -1) {
    //   return;
    // }

    let res = this.getOrderScore(chess,player);
    if (res.length < 1) {
      return;
    }
    max.push(res[0]);
    for (let i = 1; i < res.length; i++) {
      if (res[i].s >= res[i - 1].s) {
        max.push(res[i]);
        //console.log(res[i].s);
      } else {
        break;
      }
    }
    let rand = Math.floor(Math.random() * max.length);
    //console.log(rand);
    this.nextStep(max[rand].x, max[rand].y);
  }

  clone = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      newArr[i] = [];
      for (let j = 0; j < arr[i].length; j++) {
        newArr[i][j] = arr[i][j];
      }
    }
    return newArr;
  }

  alpha_beta = (depth, border, temp, pos,k, player, enemy, alpha, beta) => { //αβ剪枝算法
   
    //let temp = this.clone(chess);
    //console.log("depth:"+depth);
    //const level = this.state.level; //搜索深度
    const {SCORESHEET} = this.state;
    const level = 8;
    //console.log("border:"+border[k].s+" x:"+border[k].x+" y:"+border[k].y);
    if(border[k].s>=SCORESHEET.PERFECT){
      let p = { x: border[k].x, y: border[k].y };
      pos.push(p);
      return depth % 2 !== 0 ? alpha : beta;
    }
    if (depth === level) {
      //let m = temp[x][y];
      //temp[x][y] = 0;
      //console.log("1");

      let sc = this.allScore(border[k].x, border[k].y, player, temp);
      //temp[x][y] = m;
      //console.log("temp:" + temp);
      //console.log("x:"+x+" y:"+y);
      //console.log("score:"+sc.sum+"     p:"+sc.positionScore+" a:"+sc.attackScore+" d:"+sc.defendScore);
      //if(sc.sum>=7){
      //console.log("x:"+x+" y:"+y);
      //console.log("score:"+sc.sum+"     p:"+sc.positionScore+" a:"+sc.attackScore+" d:"+sc.defendScore);
      //}
      return sc.sum; //返回什么呢？当前位置得分
    }
    
    for (let i = 0; i < border.length&&i<=(17-level); i++) {
      if (temp[border[i].y][border[i].x] === 0) {
        if (depth % 2 !== 0) {
          temp[border[i].y][border[i].x] = player;
        } else {
          temp[border[i].y][border[i].x] = enemy;
        }
      } else {
        continue;
      }
      let value = this.alpha_beta(depth + 1,border, temp, pos, i, 1, 2, alpha, beta);
      temp[border[i].y][border[i].x] = 0;
      if (depth % 2 !== 0) { //MAX
        if (value > alpha) {
          if (pos.length > 0) {
            pos.pop();
          }
          let p = { x: border[i].x, y: border[i].y };
          pos.push(p);
          alpha = value;
          //continue;
        }
        if (alpha >= beta) {
          return alpha;
        }
      } else { //MIN
        //value = -value;
        if (value < beta) {
          beta = value;
          //continue;
        }
        if (alpha >= beta) {
          return beta;
        }
      }

    }
    return depth % 2 !== 0 ? alpha : beta;
  }

  alpha_beta_ai = (player) => { //使用αβ剪枝算法的AI
    const { chess,SCORESHEET } = this.state;
    let temp = this.clone(chess);
    let border = this.getOrderScore(temp,player);
    let enemy = 1;
    if(player===1){
      enemy = 2;
    }
    // for(let k=0;k<border.length;k++){
    //   console.log("K:"+border[k].s);
    // }
    let pos = [];
    if(border.length<=0){
      return;
    }else{
      if(border[0].s>=SCORESHEET.COMB){
        this.easyAI(player);
      }else{
        this.alpha_beta(1, border, temp, pos, 0, player, enemy, -Infinity, Infinity);
        if(pos.length<1){
          this.easyAI(player);
        }else{
          this.nextStep(pos[0].x, pos[0].y);
        }
        
      }
    }
    
  }

  render() {
    const { chess, num, winner, isGameOver, orderTable } = this.state;
    let width = 0;
    let height = 0;
    if (isGameOver) {
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
            return <LineChess orderTable={orderTable} key={index} eventClick={this.eventClick} y={index} set={set} top={10 + index * 36}></LineChess>

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
              return <div key={index} style={Style.HorizontalLine}></div>
            })
          }
        </div>
        <div style={{ ...Style.gameOver, width: width, height: height }}>{winner}</div>
        <div style={{ ...Style.label_1 }} onClick={this.help}>{"求助AI"}</div>
      </div>
    )
  }
}
