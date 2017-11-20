import React, {Component} from "react";
import "./TableCard.css";
import $ from "jquery";

let t, ws, wsUrl, status, sw, sh, ew, eh,filename ;

class TableCard extends Component {
    constructor() {
        super();
        this.state = {
            flawsName: [],
            canvasT: "",
            fName: ""
        };
        this.getFlaws = this.getFlaws.bind(this);
        this.cPrint = this.cPrint.bind(this);
        this.sendMessege = this.sendMessege.bind(this);
        this.getStatus = this.getStatus.bind(this);
    }

    componentDidMount() {
        let self = this;
        status = document.getElementById("status");
        if (window.localStorage.canvasTime) {
            t = new Date(window.localStorage.canvasTime);
            self.setState({
                canvasT: t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日"
            })
        }
        this.getFlaws();
        $(".TableCard-button").click(() => {
            // window.html2canvas($(".TableCard-table"), {
            //     onrendered: function (canvas) {
            //         //         // let url=canvas.toDataURL();
            //         //         // $(".TableCard-table")[0].insertBefore(canvas, null);
            //         //
            //         //
            //         // 将canvas下载到本地
            //         var type = 'bmp';//你想要什么图片格式 就选什么吧
            //         var imgdata = canvas.toDataURL(type);
            //         //2.0 将mime-type改为image/octet-stream,强制让浏览器下载
            //         var fixtype = function (type) {
            //             type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
            //             var r = type.match(/png|jpeg|bmp|gif/)[0];
            //             return 'image/' + r;
            //         };
            //
            //
            //         // var wantType = "image/bmp";
            //         // var dataUri = canvas.toDataURL(wantType);
            //         // if (dataUri.indexOf(wantType) < 0) {  // or use substr etc. data: + mime
            //         //     console.log("不支持！");
            //         //     // Format NOT supported - provide workaround/inform user
            //         //     // See update below for workaround (or replacement)
            //         // }
            //
            //         imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
            //         // var imgdata = canvas.toDataURL();
            //         filename = new Date().getSeconds() + '.' + type;
            //         //3.0 将图片保存到本地
            //         var savaFile = function (data, filename) {
            //             var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            //             save_link.href = data;
            //             save_link.download = filename;
            //             var event = document.createEvent('MouseEvents');
            //             event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            //             save_link.dispatchEvent(event);
            //         };
            //         //我想用当前秒是可以解决重名的问题了 不行你就换成毫秒
            //         savaFile(imgdata, filename);
            //     }
            // });

            // let os = self.getOs();
            // if(os === "windows"){
            //     self.setState({
            //         filePath:
            //     })
            // }else if(os === "MacOSX"){
            //
            // }
            let inputs = $("input");
            sw=$(".TableCard-table").offset().left;
            sh=$(".TableCard-table").offset().top;
            ew=$(".TableCard-table").offset().left+$(".TableCard-table").width();
            eh=$(".TableCard-table").offset().top+$(".TableCard-table").height();
            console.log(sw,sh,ew,eh);

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
            fetch("http://192.168.199.11:8088/cloth/form/print", {
                mode:"cors",
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
                    self.cPrint();
                    setTimeout(()=>{
                        self.sendMessege();
                        // self.getStatus();
                    },3000);
                    // console.log(status.value);
                    // self.sendMessege();
                }else {
                    console.log("不成功");
                }
            });
        });
    }

    getOs = () => {

        let userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';

        let vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';

        let appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

        if (/mac/i.test(appVersion)) {
            return 'MacOSX';
        } else if (/win/i.test(appVersion)) {
            return 'windows';
        } else if (/linux/i.test(appVersion)) {
            return 'linux'
        } else if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) {
            return 'ios';
        } else if (/android/i.test(userAgent)) {
            return 'android';
        } else if (/win/i.test(appVersion) && /phone/i.test(userAgent)) {
            return 'windowsPhone';
        }
    };

    cPrint() {
        wsUrl = 'ws://localhost:2012';
        if ('WebSocket' in window) {
            ws = new WebSocket(wsUrl);
        }
        // else if ('MozWebSocket' in window) {
        //     ws = new MozWebSocket(wsUrl);
        // }
        else {
            alert('当前浏览器不支持');
        }

        //注册各类回调
        ws.onopen = function () {
            alert("连接打印后台成功");
        };

        ws.onclose = function () {
            alert('与打印后台断开连接');
        };
        ws.onerror = function () {
            alert('数据传输发生错误');
        };
        ws.onmessage = function (receiveMsg) {
            if (receiveMsg.data.split("|")[0] == "B_GetPrinterStatus") {
                var ret = receiveMsg.data.split("|")[1];
                if (ret == 2) {
                    status.value = "2:USB端口开启失败";
                    return;
                } else if (ret == 7) {
                    status.value = "7:纸张/碳带用完！";
                    return;
                } else if (ret == 4) {
                    status.value = "4:内存溢出！";          //4:内存溢出！
                    return;
                } else if (ret == 4) {
                    status.value = "4 碳带用完或安装错误！";                       //碳带用完或安装错误！";
                    return;
                } else if (ret == 3) {
                    status.value = "3:条码格式错误！";           //3:条码格式错误！";
                    return;
                } else if (ret == 1) {
                    status.value = "1:打印命令错误！";                 //1:打印命令错误！
                    return;
                } else if (ret == 6) {
                    status.value = "6:串口通信异常！";                 //6:串口通信异常！
                    return;
                } else if (ret == 50) {
                    status.value = "50:打印机忙碌！";                 //50:打印机忙碌！
                    return;
                } else if (ret == 12) {
                    status.value = "12:打印机暂停！";                 //12:打印机暂停
                    return;
                } else if (ret == 9) {
                    status.value = "9:未取得返回值";                 //9:未取得返回值
                    return;
                } else if (ret == 0) {
                    status.value = "0:等待列印!";                 //0:等待列印!
                    return;
                }
            }
        }
    }

    sendMessege() {
        ws.send('B_EnumUSB');
        ws.send('B_CreateUSBPort|1');
        // ws.send('DownloadFile|http://192.168.199.143:3000/111.bmp|aaa.bmp');

        ws.send('B_Get_Graphic_ColorBMP|0|0|C:\\Users\\Administrator\\Desktop\\test.bmp');
        ws.send('B_Print_Out|1');
        ws.send('B_ClosePrn');
    }

    getStatus() {
        ws.send('B_EnumUSB');
        ws.send('B_CreateUSBPort|1');
        ws.send('B_GetPrinterStatus');

        ws.send('B_ClosePrn');
    }

    getFlaws() {
        let self = this;
        // 请求瑕疵名称
        fetch("http://192.168.199.11:8088/defects/init",{
            mode: "cors"
        }).then(res => res.json()).then(r => {
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
                                    <textarea rows="8">
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
                <input type="text" id="status"/>
            </div>
        )
    }
}

export default TableCard;