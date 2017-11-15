import React, {Component} from "react";
import "./DetailedCard.css";
import $ from "jquery";

class DetailedCard extends Component {
    constructor(){
        super();
        this.state={
            picUrl:[]
        };
        this.delete = this.delete.bind(this);
    }
    componentDidMount() {
        $(".DetailedCard-detailed-insert").click(() => {
            window.location.href = "/choosescore/"+this.props.clothId;
        })
    }

    delete(e) {
        let self = this;
        if (e.target.className === "Detailed-container") {
            return;
        } else if (e.target.className === "iconfont icon-guanbi" && $(e.target).parents("li")[0].className === "active") {
            fetch("/defects/detail/" + $(e.target).parents("li")[0].getAttribute("data-id"), {
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
            let picUrl=this.state.picUrl.filter(v=>v.id == $(e.target).parents("li").attr("data-id"));
            if(picUrl.length){
                $(".DetailedCard-canvas img").attr("src",picUrl[0].url);
            }
        }
    }
    render() {
        let detail = this.props.detailInfo.length ? this.props.detailInfo.map((v, i) => {
            let tt=this.state.picUrl.filter(x=>{
                return v.id===x.id
            });
            if(!tt.length){
                v.path?this.state.picUrl.push({"id":v.id,"url":v.path}):null;
            }
            v.cTime = v.createdTime.split(" ")[1].split(".")[0];
            if (i === 0) {
                return (
                    <li key={v.id} data-id={v.id} className="active">
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
            } else {
                return (
                    <li key={v.id} data-id={v.id}>
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
            }
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
                    <img src={this.state.picUrl.length?this.state.picUrl[0].url:null} alt=""/>
                </div>
            </div>
        )
    }
}

export default DetailedCard;