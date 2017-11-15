import React, {Component} from "react";
import "./Video.css";

let mediaStreamTrack;

class Video extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        var video = document.querySelector('video');
        var canvas = document.querySelector('canvas');
        var context = canvas.getContext('2d');
        var snap = document.getElementById("snap");

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(function (stream) {

                mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];

                video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
            }).catch(function (err) {
                console.log(err);
            })
        }

        var that = this;
        snap.addEventListener('click', function () {
            var myDate = new Date();
            var time = myDate.toLocaleString();
            context.drawImage(video, 0, 0, 200, 150);
            var url = canvas.toDataURL("image/jpeg");
            fetch("/modbus/data")
                .then(res => res.json())
                .then(r => {
                    let state = that.state;
                    state.data.unshift({"w": r.long, "h": r.width, "t": time, "url": url});
                    that.setState(state);
                })
        }, false);
    }

    render() {
        return (
            <div className="video">
                <canvas width="200" height="150"></canvas>
                <div className="video-up">
                    <video width="90%" height="auto"></video>
                    <button id="snap">拍照</button>
                </div>
                <div className="video-right">
                    <div className="video-scroll">
                        {this.state.data.length ? this.state.data.map((v, i) => (
                            <div className="video-down" key={i}>
                                <img src={v.url} alt=""/>
                                <div className="video-data">
                                    <div className="wh">
                                        <p><em>布长：</em><span>{v.w / 1000}</span><em>米</em></p>
                                        <p><em>布宽：</em><span>{v.h / 1000}</span><em>米</em></p>
                                    </div>
                                    <div className="time">{v.t}</div>
                                </div>
                            </div>
                        )) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Video;