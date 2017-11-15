import React, {Component} from "react";
import "./TableCard.css";
import $ from "jquery";

let t;

class TableCard extends Component {
    constructor() {
        super();
        this.state = {
            flawsName: [],
            canvasT: ""
        };
        this.getFlaws = this.getFlaws.bind(this);
    }

    componentDidMount() {
        if (window.localStorage.canvasTime) {
            t = new Date(window.localStorage.canvasTime);
            this.setState({
                canvasT: t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日"
            })
        }
        this.getFlaws();
        $(".TableCard-button").click(() => {
            let inputs = $("input");
            let param = {
                "clothId": this.props.clothId,
                "colorCardNumber": inputs[0].value,
                "colorNumber": inputs[1].value,
                "styleNumber": inputs[2].value,
                "provider": inputs[3].value,
                "dyelotNumber": inputs[4].value,
                "reelNumber": inputs[5].value,
                "packageWidth": inputs[6].value,
                "initalWeight": inputs[7].value,
                "initalLength": inputs[8].value,
                "usefulWidth": inputs[9].value,
                "actulWeight": inputs[10].value,
                "actulLength": inputs[11].value,
                "note": $("textarea")[0].value
            };
            fetch("/cloth/form/print", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(param)
            }).then(res => res.json()).then(r => {
                if (r.message === "成功") {
                    if(window.localStorage.canvasTime){
                        localStorage.removeItem("canvasTime");
                    }
                    if(window.localStorage.canvasUrl){
                        localStorage.removeItem("canvasUrl");
                    }
                }else {
                    console.log("不成功");
                }
            });
        });
    }

    getFlaws() {
        let self = this;
        // 请求瑕疵名称
        fetch("/defects/init").then(res => res.json()).then(r => {
            if (r.message === "成功") {
                self.setState({
                    flawsName: r.data.names
                })
            }
        });
    }

    render() {
        let defectList = this.props.tableInfos.length ? this.props.tableInfos : [];
        let nn = this.state.flawsName.length;
        if (nn < 18) {
            for (let i = 0; i < (18 - nn); i++) {
                this.state.flawsName.push("");
            }
        }
        let flaws = this.state.flawsName && nn ? this.state.flawsName.map((v, i) => {
            let index = defectList.filter(item => item.nameId === i);
            if (index.length) {
                return (<div key={i + 1} className="TableCard-table-little">
                    <span>{v}</span>
                    <span>{index[0].num}</span>
                </div>)
            } else {
                if (i < (this.state.flawsName.length - 1)) {
                    return (<div key={i + 1} className="TableCard-table-little">
                        <span>{v}</span>
                        <span>{0}</span>
                    </div>)
                } else {
                    return (<div key={i + 1} className="TableCard-table-little">
                        <span>
                        </span>
                        <span>
                        </span>
                    </div>)
                }

            }
        }) : null;
        return (
            <div className="TableCard-content-table">
                <div className="TableCard-table">
                    <div className="TableCard-table-header">
                        <div className="table-header-left">
                            <img src={require('../../images/logo.png')} alt=""/>
                            入库布料检验单
                        </div>
                        <div className="table-header-right">
                            <span>{this.state.canvasT}</span>
                            <span>XX制表</span>
                        </div>
                    </div>
                    <div className="TableCard-table-tabs">
                        <table className="table1" frame="box" rules="all">
                            <tbody align="center">
                            <tr>
                                <th>色卡编号</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>色号</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>款号</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>供应商</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>缸号</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>卷号</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>包边门幅</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>来料公斤</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>来料米数</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>可用门幅</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>实称公斤</th>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>打码米数</th>
                                <td><input type="text"/></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="TableCard-table-tab">
                            {flaws}
                        </div>
                        <table className="table3" frame="box" rules="all">
                            <tbody align="center">
                            <tr>
                                <th>备注</th>
                                <td colSpan="2">
                                    <textarea  rows="8">
                                    </textarea>
                                </td>
                            </tr>
                            <tr>
                                <th>瑕疵个数</th>
                                <th>总扣分</th>
                                <th>扣损</th>
                            </tr>
                            <tr>
                                <td>{this.props.count}</td>
                                <td>{this.props.score}</td>
                                <td>4%</td>
                            </tr>
                            <tr>
                                <th colSpan="3">结论</th>
                            </tr>
                            <tr>
                                <td colSpan="3">合格</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="TableCard-button">
                    打印表单
                </div>
            </div>
        )
    }
}

export default TableCard;