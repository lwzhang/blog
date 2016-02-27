/**
 * Created by lenovo on 2016/2/27.
 */
var canvas = document.createElement("canvas");
canvas.id="wheelCanvas";
canvas.width="300";
canvas.height="300";
document.getElementById("canvasBox").appendChild(canvas);
(function () {
    var Pinwheel = function (canvas, options) {
        this.canvas = document.getElementById(canvas);
        this.options = options;
    };
    Pinwheel.prototype = {
        constructor: Pinwheel,
        show: function () {
            var canvas = this.canvas,//取得canvas元素
                width = canvas.width,//canvas元素的宽度
                height = canvas.height,//canvas元素的高度
                color = this.options.color,//风车叶子的颜色
                radius = this.options.radius,//整个风车的半径
                wheelRadius = this.options.wheelRadius,//风车叶子的半径
                part = this.options.part,//PI/2分成几份
                ctx = canvas.getContext("2d"),//获取上下文
                num = this.options.num,//叶子数量
                center = {x: width / 2, y: height / 2},//绘图区域的中心
                point, //叶子圆心位置
                start = 0,//绘制叶子的开始角
                angle = 0,//start = angle
                end = Math.PI,//绘制叶子的结束角
                offset = Math.PI * (360 / num) / 180,//两个相邻叶子之间的角度
                rotateAngle = offset / part;//每次旋转的角度
            window.timer2 = setInterval(function () {
                ctx.clearRect(0, 0, width, height);
                for (var i = 0; i < num; i += 1) {
                    ctx.beginPath();//开始绘制叶子
                    var wheelGradient = ctx.createRadialGradient(center.x, center.y, 100, center.x, center.y, 0);//创建径向渐变
                    wheelGradient.addColorStop(0, color[i]);//起始颜色
                    wheelGradient.addColorStop(1, "#000");//结束颜色
                    ctx.fillStyle = wheelGradient;//填充渐变样式
                    point = {x: center.x + Math.cos(offset * i + angle) * radius, y: center.y + Math.sin(offset * i + angle) * radius};//叶子圆心位置
                    var x = start + offset * i;//绘制叶子的开始角
                    var y = end + offset * i;//绘制叶子的结束角
                    ctx.arc(point.x, point.y, wheelRadius, x, y, false);//绘制
                    ctx.fill();//填充
                    ctx.closePath();//结束绘制
                }
                ctx.beginPath();
                var dotGradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 40);
                dotGradient.addColorStop(0, "#fff");
                dotGradient.addColorStop(1, "#666");
                ctx.fillStyle = dotGradient;
                ctx.arc(center.x, center.y, 25, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
                angle += rotateAngle;
                start = angle;
                end = Math.PI + angle;
            }, 20)
        },
        hide: function () {
            clearInterval(window.timer2);
        }
    };

    var options = {
        num: 4,
        color: ["red", "yellow", "blue", "green"],
        radius: 50,
        wheelRadius: 50,
        part: 50
    };

    var a = new Pinwheel("wheelCanvas", options);
    a.show();
}());