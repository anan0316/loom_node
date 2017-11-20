import React, {Component} from "react";
import "./GetCanvas.css";
import $ from "jquery";

let video;

class GetCanvas extends Component {
    constructor(){
        super();
        this.state={
            clothId:""
        };
        this.setEnd=this.setEnd.bind(this);
        this.takePhoto=this.takePhoto.bind(this);
    }
    componentDidMount() {
        let self=this;
        video = $("video")[0];
        // 打开设备摄像头
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({

                video: true,
                audio: true
            }).then(function (stream) {

                // 获取摄像的src
                video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
            }).catch(function (err) {
                console.log(err);
            })
        }

        let cooks=document.cookie.split("; ");
        let cloth=cooks.filter(v=>{
            return v.split("=")[0] === "clothId"
        });
        if(cloth.length === 0){
            // 请求新布匹初始化接口，获取clothId
            fetch("http://192.168.199.11:8088/cloth/init",{
                mode: "cors"
            })
                .then(res => res.json())
                .then(r => {
                    if (r.message === "成功") {
                        self.setState({
                            clothId:r.data.clothId
                        });
                        document.cookie="clothId="+r.data.clothId
                    }else {
                        console.log("不成功");
                    }
                });
        }else {
            self.setState({
                clothId:cloth[0].split("=")[1]
            });
        }

        // 点击修改按钮
        $(".GetCanvas-update").click(() => {
            // 跳转到明细页面
            window.location.href = "/toggle/detailed/"+self.state.clothId;
        });
    }

    // 点击拍照按钮
    takePhoto(){
        let canvas = $("canvas")[0];
        let context = canvas.getContext('2d');
        let myDate = new Date();
        let time = myDate.toJSON();
        context.drawImage(video, 0, 0, 200, 160);
        let url = canvas.toDataURL("image/jpeg");
        // 将时间和图片的base64url存到本地
        window.localStorage.canvasTime = time;
        window.localStorage.canvasUrl = url;
        // 跳转到扣分值页面
        window.location.href = "/choosescore/"+this.state.clothId;
    }

    // 点击结束按钮
    setEnd(){
        let self=this;
        let cooks = document.cookie.split(";");
        let cloth = cooks.filter(v => {
            return v.split("=")[0] === "clothId"
        });
        if(cloth.length){
            let cookieName = cloth[0].split("=")[0];
            let exp = new Date();
            exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
            document.cookie = cookieName + "=a; expires=" + exp.toGMTString();
            // 跳转到表单页面
            window.location.href = "/toggle/table/"+self.state.clothId;
        }
    }

    render() {
        return (
            <div className="GetCanvas-container">
                <canvas width={200} height={160} style={{"display": "none"}}>
                </canvas>
                <video>
                </video>
                <div className="GetCanvas-mask">
                    <button className="GetCanvas-update">
                        <i className="iconfont icon-fanhuixiugai">
                        </i>
                        修改
                    </button>
                    <button className="GetCanvas-Photograph" onClick={this.takePhoto}>
                        <i className="iconfont icon-paizhao">
                        </i>
                    </button>
                    <button className="GetCanvas-end" onClick={this.setEnd}>
                        结束
                    </button>
                </div>
            </div>
        )
    }
}

export default GetCanvas;