import React, {Component} from "react";
import "./ChooseScore.css";
import $ from "jquery";

let t;
// 转换为时间磋
// var timestamp2 = Date.parse(t);

class ChooseScore extends Component {
    constructor() {
        super();
        this.state = {
            currentClothId:"",
            chooseScore: "",
            canvasT: "",
            canvasUrl: "",
            flawCoordinate: {},
            flawNames: {}
        }
    }

    componentDidMount() {
        let self = this;
        if (window.localStorage.canvasTime) {
            t = new Date(window.localStorage.canvasTime);
            self.setState({
                canvasT: t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日"
            })
        }
        if (window.localStorage.canvasUrl) {
            self.setState({
                canvasUrl: window.localStorage.canvasUrl
            })
        }

        let cooks=document.cookie.split("; ");
        let cloth=cooks.filter(v=>{
            return v.split("=")[0] === "clothId"
        });
        if(cloth.length){
            self.setState({
                currentClothId:cloth[0].split("=")[1]
            })
        }
        // 获取当前瑕疵位置信息
        // fetch("/cloth/location")
        //     .then(res => res.json())
        //     .then(r => {
        //         if (r.message === "成功") {
        //             self.setState({
        //                 flawCoordinate:r.date
        //             })
        //         }
        //     });

        // 请求瑕疵名称
        fetch("/defects/init").then(res => res.json()).then(r => {
            if (r.message === "成功") {
                self.setState({
                    flawNames: r.data
                })
            }
        });

        $(".ChooseScore-score ul li").click((e) => {
            $(".ChooseScore-score ul li").removeClass("active");
            $(e.target).addClass("active");
            self.setState({
                chooseScore: Math.abs(e.target.innerText).toString()
            })
        });
        $(".ChooseScore-flaw ul").click((e) => {
            $(".ChooseScore-flaw ul li").removeClass("active");
            $(e.target).addClass("active");
            let bodyInfo = {
                "clothId": self.state.currentClothId,
                "nameId": e.target.getAttribute("data-id"),
                "score": self.state.chooseScore,
                "height": "1111122",
                "width": "2222233",
                "picStr": self.state.canvasUrl
            };
            // 提交一个瑕疵信息
            fetch("/defects/detail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyInfo)
            }).then(res => res.json()).then(r => {
                if (r.message === "成功") {
                    window.location.href = "/toggle/detailed/"+self.props.match.params.clothId;
                }
            });
        });
    }

    render() {
        let flawNameArr = this.state.flawNames && this.state.flawNames.names ? this.state.flawNames.names.map((v, i) => (
            <li key={i} data-id={i}>{v}</li>)) : null;
        return (
            <div className="ChooseScore-container">
                <div className="ChooseScore-header">
                    <div className="ChooseScore-header-left">
                        <p>检测长度位置：{this.state.flawCoordinate ? this.state.flawCoordinate.width : null}米</p>
                        <p>水平位置：{this.state.flawCoordinate ? this.state.flawCoordinate.height : null}米</p>
                    </div>
                    <div className="ChooseScore-header-right">
                        {this.state.canvasT}
                    </div>
                </div>
                <div className="ChooseScore-score" style={{"display": this.state.chooseScore === "" ? "flex" : "none"}}>
                    <ul>
                        <li>-1</li>
                        <li>-2</li>
                        <li>-3</li>
                        <li>-4</li>
                        <li>-5</li>
                    </ul>
                    选择扣分值
                </div>
                <div className="ChooseScore-flaw" style={{"display": this.state.chooseScore === "" ? "none" : "flex"}}>
                    <ul>
                        {flawNameArr}
                    </ul>
                </div>
            </div>
        )
    }
}

export default ChooseScore;