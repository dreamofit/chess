
const all = {
    position: "relative",
    left: 300,
    top: 20,
    width: 660,
    height: 540,
    background: "#F57F17",
}

const checkerboard = {
    position: "relative",
    left: 20,
    top: 20,
    width: 504,
    height: 504,
    background: "#FBC02D",
    border: '0 #000 solid',
    borderTopWidth: 1,
    borderLeftWidth: 1
}
const HorizontalLine = {
    position: "relative",
    left: 0,
    top: 0,
    width: 504,
    height: 35,
    borderBottom: '1px #000 solid',
}
const VerticalLine = {
    position: "relative",
    float: "left",
    left: 0,
    top: 0,
    width: 35,
    height: 504,
    borderRight: '1px #000 solid',
}

const allChess = {
    position:"absolute",
    zIndex:999,
    width:24,
    height:24,
    borderRadius:100
}

const black = {
    position:"absolute",
    zIndex:999,
    width:20,
    height:20,
    background:"#000",
    border:"1px #757575 solid",
    textAlign:"center",
    alignItems: 'center',
    lineHeight:2,
    fontSize:10,
    borderRadius:100
}
const white = {
    position:"absolute",
    zIndex:999,
    width:20,
    height:20,
    background:"#FFFFFF",
    border:"1px #757575 solid",
    textAlign:"center",
    lineHeight:2,
    fontSize:10,
    alignItems: 'center',
    borderRadius:100
}

const blackPoint = {
    position:"absolute",
    zIndex:900,
    width:10,
    height:10,
    background:"#000",
    borderRadius:100
}

const gameOver = {
    position:"absolute",
    zIndex:1000,
    left:182,
    top:220,
    textAlign:"center",
    lineHeight:3,
    color:"#FF1744",
    fontSize:30,
    background:"RGB(198, 255, 0,0.5)"
}

const label_1 = {
    position:"absolute",
    left:540,
    top:20,
    fontSize:22,
    color:"#FFFFFF",
    cursor:"pointer"
}

export default {
    all,
    checkerboard,
    HorizontalLine,
    VerticalLine,
    allChess,
    black,
    white,
    blackPoint,
    gameOver,
    label_1
}
