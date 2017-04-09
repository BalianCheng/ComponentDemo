/**
 * Created by Dovahkiin on 2017/4/5.
 */
var ComponentPolyline = function (name, cfg) {
    var component = new ComponentBase(name, cfg)
    var width = cfg.width
    var height = cfg.height
    var cns = document.createElement('canvas')
    var ctx = cns.getContext('2d')
    cns.width = ctx.width = width
    cns.height = ctx.height = height
    component.append(cns)
    var step = 10
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = 'white'
    window.ctx = ctx
    //画网格线
    for (var i = 0; i < step + 1; i++) {
        var y = height / step * i
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
    }
    step = cfg.data.length + 1
    var text_w = width / step >> 0
    for (var i = 0; i < step + 1; i++) {
        var x = (width / step) * i
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        if (cfg.data[i]) {
            var text = $('<div class="text"></div>')
            text.text(cfg.data[i][0])
            text.css('width', text_w / 2).css('left', x / 2 + text_w / 4)
            component.append(text)
        }
    }
    ctx.stroke()
    //画折线
    var cns = document.createElement('canvas')
    var ctx = cns.getContext('2d')
    cns.width = ctx.width = width
    cns.height = ctx.height = height
    component.append(cns)
    var draw = function (per) {
        ctx.clearRect(0, 0, width, height)
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = '#c5c2c2'
        //描点
        var x = 0
        var y = 0
        var pst_x = (width / step) + 1
        for (i in cfg.data) {
            var item = cfg.data[i]
            x = pst_x * i + pst_x
            y = height - item[1] * height * per
            ctx.moveTo(x, y)
            ctx.arc(x, y, 5, 0, 2 * Math.PI)
        }
        //连线
        ctx.moveTo(0, height)
        ctx.lineTo(pst_x, height - cfg.data[0][1] * height * per)
        ctx.moveTo(pst_x, height - cfg.data[0][1] * height * per)
        for (i in cfg.data) {
            var item = cfg.data[i]
            x = pst_x * i + pst_x
            y = height - item[1] * height * per
            ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.stroke()
        //绘制阴影
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(0,0,0,0)'
        ctx.fillStyle = 'rgba(197,194,194,0.2)'
        //写数据
        ctx.lineTo(x, height)
        ctx.lineTo(0, height)
        ctx.fill()
        for (i in cfg.data) {
            var item = cfg.data[i]
            x = pst_x * i + pst_x
            y = height - item[1] * height * per
            ctx.moveTo(x, y)
            ctx.fillStyle = item[2] ? item[2] : '#595959'
            ctx.font="35px Arial"
            ctx.fillText(((item[1] * 100) >> 0) + '%', x - 10, y - 10)
        }
        ctx.stroke()
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
