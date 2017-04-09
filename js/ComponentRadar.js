/**
 * Created by Dovahkiin on 2017/4/5.
 */
var ComponentRadar = function (name, cfg) {
    var component = new ComponentBase(name, cfg)
    var width = cfg.width
    var height = cfg.height
    var cns = document.createElement('canvas')
    var ctx = cns.getContext('2d')
    cns.width = ctx.width = width
    cns.height = ctx.height = height
    component.append(cns)
    var r = width / 2
    // ctx.beginPath()
    // ctx.arc(r, r, 5, 0, 2 * Math.PI)
    // ctx.stroke()
    // ctx.beginPath()
    // ctx.arc(r, r, r, 0, 2 * Math.PI)
    // ctx.stroke()
    //计算多边形顶点坐标
    //圆心(a,b)
    //rad=(2*Math.PI/360)*(360/data.length)*i
    //x=a+Math.sin(rad)*r
    //y=b+Math.cos(rad)*r
    var step = cfg.data.length
    var isBlue = false
    for (var s = 10; s > 0; s--) {
        ctx.beginPath()
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step) * i
            var x = r + Math.sin(rad) * r * (s / 10)
            var y = r + Math.cos(rad) * r * (s / 10)
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = (isBlue = !isBlue) ? '#696868' : '#565858'
        ctx.fill()
        // ctx.stroke()
    }
    //绘制伞骨
    for (var i = 0; i < step; i++) {
        var rad = (2 * Math.PI / 360) * (360 / step) * i
        var x = r + Math.sin(rad) * r
        var y = r + Math.cos(rad) * r
        ctx.moveTo(r, r)
        ctx.lineTo(x, y)
        //输出项目名
        if (cfg.data[i]) {
            var text = $('<div class="text"></div>')
            text.text(cfg.data[i][0])
            text.css('transition', 'all .5s ' + i * .2 + 's')//顺序延迟
            if (x > width / 2) {
                text.css('left', x / 2 + 5)
            }
            else {
                text.css('right', (width - x) / 2 + 5)
            }
            if (y > height / 2) {
                text.css('top', y / 2 + 5)
            } else {
                text.css('bottom', (height - y) / 2 + 5)
            }
            if (cfg.data[i][2]) {
                text.css('color', cfg.data[i][2])
            }
            text.css('opacity', 0)
            // text.css('width', text_w / 2).css('left', x / 2 + text_w / 4)
            component.append(text)
        }
    }
    ctx.lineWidth=5
    ctx.strokeStyle = '#e0e0e0'
    ctx.stroke()
    ctx.closePath()
    var cns = document.createElement('canvas')
    var ctx = cns.getContext('2d')
    cns.width = ctx.width = width
    cns.height = ctx.height = height
    component.append(cns)
    ctx.strokeStyle = '#e87777'
    var draw = function (per) {
        if (per >= 1) {
            component.find('.text').css('opacity', 1)
        }
        if (per <= 1) {
            component.find('.text').css('opacity', 0)
        }
        //输出数据折线
        ctx.clearRect(0, 0, width, height)
        ctx.beginPath()
        ctx.lineWidth=20
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step) * i
            var rate = cfg.data[i][1] * per
            var x = r + Math.sin(rad) * rate * r
            var y = r + Math.cos(rad) * rate * r
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.fillStyle = '#e87777'
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step) * i
            var rate = cfg.data[i][1]
            var x = r + Math.sin(rad) * rate * per * r
            var y = r + Math.cos(rad) * rate * per * r
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, 2 * Math.PI)
            ctx.fill()
            ctx.closePath()
        }
    }
    component.on('afterLoad', function () {
        var s = 0
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += 0.01
                draw(s)
            }, i * 10 + 500)
        }
    })
    component.on('onLeave', function () {
        var s = 1
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= 0.01
                draw(s)
            }, i * 10 + 500)
        }
    })
    return component
}
