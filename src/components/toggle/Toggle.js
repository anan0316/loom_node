import React, {Component} from "react";
import "./Toggle.css";
import $ from "jquery";
import DetailedCard from "../detailedCard/DetailedCard";
import TableCard from "../tableCard/TableCard";

let tabs;

class Toggle extends Component {
    constructor() {
        super();
        this.state = {
            disFlag: false,
            details: [],
            defectList:{},
            score:"",
            num:""
        };
        this.getDetails = this.getDetails.bind(this);
        this.getTable = this.getTable.bind(this);
    }

    componentDidMount() {
        let self = this;
        self.getDetails();
        self.getTable();

        tabs = $(".Toggle-tabs");
        if (this.props.match.params.type === "detailed") {
            tabs.eq(1).addClass(" active");
            self.setState({
                disFlag: true
            })
        } else if (this.props.match.params.type === "table") {
            tabs.eq(0).addClass(" active");
            self.setState({
                disFlag: false
            });
            $(".Toggle-sider")[0].addEventListener("click", (e) => {
                if (e.target.className === "Toggle-tabs") {
                    tabs.removeClass(" active");
                    $(e.target).addClass(" active");
                }
                let btns = tabs.filter((i, v) => v.className === "Toggle-tabs active");
                if (btns.length && btns[0].innerText === "明细") {
                    self.setState({
                        disFlag: true
                    })
                } else if (btns.length && btns[0].innerText === "表单") {
                    self.setState({
                        disFlag: false
                    })
                }
            })
        }

        $(".Toggle-back")[0].addEventListener("click", () => {
            window.location.href = "/";
        });
    }

    delete(e) {
        let self = this;
        if (e.target.className === "Detailed-container") {
            return;
        } else if (e.target.className === "iconfont icon-guanbi" && $(e.target).parents("li")[0].className === "active") {
            fetch("http://192.168.199.11:8088/defects/detail/" + $(e.target).parents("li")[0].getAttribute("data-id"), {
                mode: "cors",
                method: "DELETE"
            })
                .then(res => res.json())
                .then(r => {
                    if (r.message === "成功") {
                        self.getDetails();
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

    getDetails() {
        let self = this;
        // 请求查看某皮布的明细
        fetch("http://192.168.199.11:8088/defects/all-details/" + self.props.match.params.clothId,{
            mode: "cors"
        }).then(res => res.json()).then(r => {
            if (r.message === "成功") {
                self.setState({
                    details: r.data
                })
            }
        });

    }

    getTable() {
        let self = this;
        fetch("http://192.168.199.11:8088/cloth/form/init/" + self.props.match.params.clothId,{
            mode: "cors"
        })
            .then(res => res.json())
            .then(r =>{
                if(r.message === "成功"){
                    self.setState({
                        defectList:r.data.defectList,
                        score:r.data.scoreNums.score,
                        num:r.data.scoreNums.num
                    })
                }
            });
    }

    render() {
        return (
            <div className="Toggle-container">
                <div className="Toggle-sider">
                    <div className="Toggle-tabs">
                        表单
                    </div>
                    <div className="Toggle-tabs">
                        明细
                    </div>
                    <div className="Toggle-back">
                        返回
                    </div>
                </div>
                <div className="Toggle-content">
                    <div className="Toggle-case" style={{"display": !this.state.disFlag ? "block" : "none"}}>
                        <TableCard clothId={this.props.match.params.clothId} tableInfos={this.state.defectList} score={this.state.score} count={this.state.num}>
                        </TableCard>
                    </div>
                    <div className="Toggle-case" style={{"display": this.state.disFlag ? "block" : "none"}}>
                        <DetailedCard clothId={this.props.match.params.clothId} detailInfo={this.state.details} clickDelete={() => this.delete} retDetails={this.getDetails}>
                        </DetailedCard>
                    </div>
                </div>
            </div>
        )
    }
}

export default Toggle;