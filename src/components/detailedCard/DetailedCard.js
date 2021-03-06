import React, {Component} from "react";
import "./DetailedCard.css";
import $ from "jquery";

class DetailedCard extends Component {
    constructor() {
        super();
        this.state = {
            picUrl: []
        };
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        $(".DetailedCard-detailed-insert").click(() => {
            window.location.href = "/choosescore/" + this.props.clothId;
        })
    }

    delete(e) {
        let self = this;
        if (e.target.className === "Detailed-container") {
            return;
        } else if (e.target.className === "iconfont icon-guanbi" && $(e.target).parents("li")[0].className === "active") {
            let deleteLis = self.state.picUrl.filter(v => v.id == $(e.target).parents("li")[0].getAttribute("data-id"));
            if (deleteLis.length) {
                self.state.picUrl = self.state.picUrl.filter((v, i) => {
                    if (i == 0) {
                        $(".DetailedCard-canvas img").attr("src", "http://192.168.199.11/img/" + v.url);
                        $(".Detailed-container li")[0].setAttribute("class", "active");
                    }
                    return v.id != $(e.target).parents("li")[0].getAttribute("data-id")
                });
            }
            fetch("http://192.168.199.11:8088/defects/detail/" + $(e.target).parents("li")[0].getAttribute("data-id"), {
                mode: "cors",
                method: "DELETE"
            })
                .then(res => res.json())
                .then(r => {
                    if (r.message === "成功") {
                        self.props.retDetails();
                    }
                });
        } else if (e.target.className !== "iconfont icon-guanbi") {
            $(".Detailed-container").find("li").removeClass("active");
            $(e.target).parents("li").addClass("active");
            let picUrl = this.state.picUrl.filter(v => v.id == $(e.target).parents("li").attr("data-id"));
            if (picUrl.length) {
                $(".DetailedCard-canvas img").attr("src", "http://192.168.199.11/img/" + picUrl[0].url);
            }
        }
    }

    render() {
        let detail = this.props.detailInfo.length ? this.props.detailInfo.map((v, i) => {
            let tt = this.state.picUrl.filter(x => {
                return v.id === x.id
            });
            if (!tt.length) {
                v.path ? this.state.picUrl.push({"id": v.id, "url": v.path}) : null;
            }
            v.cTime = v.createdTime.split(" ")[1].split(".")[0];
            if (i === 0) {
                v.act = "active";
            } else {
                v.act = "";
            }
            return (
                <li key={v.id} data-id={v.id} className={v.act}>
                    <div className="Detailed-left">
                        <span>{i + 1}</span>
                        <span>{v.name}</span>
                        <span>{v.height}</span>
                        <span>{v.width}</span>
                        <span>{v.score}</span>
                        <span>{v.cTime}</span>
                    </div>
                    <div className="Detailed-delete">
                        <i className="iconfont icon-guanbi">
                        </i>
                    </div>
                </li>
            )
        }) : null;
        return (
            <div className="DetailedCard-content-detailed" ref="detailed">
                <div className="DetailedCard-detailed">
                    <div className="DetailedCard-detailed-header">
                        <ul>
                            <li>编号</li>
                            <li>瑕疵名称</li>
                            <li>长度位置</li>
                            <li>水平位置</li>
                            <li>扣分</li>
                            <li>时间</li>
                        </ul>
                        <div className="DetailedCard-detailed-insert">
                            <i className="iconfont icon-Group">
                            </i>
                            新增瑕疵
                        </div>
                    </div>
                    <div className="DetailedCard-detailed-content">
                        <ul className="Detailed-container" onClick={this.delete}>
                            {detail}
                        </ul>
                    </div>
                </div>
                <div className="DetailedCard-canvas">
                    瑕疵图
                    <img src={this.state.picUrl.length ? "http://192.168.199.11/img/" + this.state.picUrl[0].url : null}
                         alt=""/>
                </div>
            </div>
        )
    }
}

export default DetailedCard;