/**
 * Created by Dovahkiin on 2017/4/5.
 */
var ComponentPie = function (name, cfg) {
    var component = new ComponentBase(name, cfg)
    var width = cfg.width
    var height = cfg.height
    var cns = document.createElement('canvas')
    var ctx = cns.getContext('2d')
    cns.width = ctx.width = width
    cns.height = ctx.height = height
    $(cns).css('zIndex', 1)
    component.append(cns)
    var r = width / 2
    //底图层
    ctx.beginPath()
    ctx.fillStyle = '##282828'
    ctx.strokeStyle = '##282828'
    ctx.lineWidth = 1
    ctx.arc(r, r, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    //绘制数据层
    var cns = document.createElement('canvas')
    var ctx = cns.getContext('2d')
    cns.width = ctx.width = width
    cns.height = ctx.height = height
    $(cns).css('zIndex', 2)
    component.append(cns)
    var colors = ['black', 'blue', 'green', 'cyan', 'gery', 'orange']//备用颜色
    var startAngle = 1.5 * Math.PI//开始角度
    var endAngle = 0//结束角度
    var aAngel = Math.PI * 2//100%结束的圆角

    var step = cfg.data.length
    for (var i = 0; i < step; i++) {
        var item = cfg.data[i]
        endAngle = startAngle + aAngel * item[1]
        var color = item[2] || (item[2] = colors.pop())
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.strokeStyle = color
        ctx.lineWidth = 0.1
        ctx.moveTo(r, r)
        ctx.arc(r, r, r, startAngle, endAngle)
        ctx.fill()
        ctx.stroke()
        startAngle = endAngle
        //加入文本与百分百
        var text = $('<div class="text"></div>')//TODO css modify size
        text.text(item[0])
        var per = $('<div class="per"></div>')
        per.text(item[1] * 100 + '%')
        text.append(per)
        var x = r + Math.sin(0.5 * Math.PI - startAngle) * r
        var y = r + Math.cos(0.5 * Math.PI - endAngle) * r
        if (x >= width / 2) {
            text.css('left', x / 2)
        } else {
            text.css('right', (width - x) / 2)
        }
        if (y >= height / 2) {
            text.css('top', y / 2)
        } else {
            text.css('bottom', (height - y) / 2)
        }
        if (item[2]) {
            text.css('color', item[2])
        }
        text.css('transition', 'all .5s ' + i * .2 + 's')//顺序延迟
        text.css('opacity', 0)
        component.append(text)
    }
    //加入蒙版层
    var cns = document.createElement('canvas')
    var ctx = cns.getContext('2d')
    cns.width = ctx.width = width
    cns.height = ctx.height = height
    $(cns).css('zIndex', 3)
    component.append(cns)

    ctx.fillStyle = '#2c2c2c'
    ctx.strokeStyle = '#2c2c2c'
    ctx.lineWidth = 1


    //生长动画
    startAngle = 1.5 * Math.PI
    var draw = function (per) {
        ctx.clearRect(0, 0, width, height)
        ctx.beginPath()
        ctx.moveTo(r, r)
        if (per <= 0) {
            ctx.arc(r, r, r, 0, aAngel)
            component.find('.text').css('opacity', 0)
        }
        else {
            ctx.arc(r, r, r, startAngle, startAngle + aAngel * per, true)
        }
        ctx.fill()
        ctx.stroke()
        if (per >= 1) {
            component.find('.text').css('transition', 'all 0s')
            ComponentPie.reSort(component.find('.text'))
            component.find('.text').css('transition', 'all 1s')
            component.find('.text').css('opacity', 1)
        }
    }

    draw(0)

    component.on('afterLoad', function () {
        var s = 0
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += 0.01
                draw(s)
            }, i * 10)
        }
    })
    component.on('onLeave', function () {
        var s = 1
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= 0.01
                draw(s)
            }, i * 10)
        }
    })
    return component
}
ComponentPie.reSort = function (list) {
    //检测相交
    var compare = function (domA, domB) {
        var offsetA = $(domA).offset//直接获得偏移值
        var offsetB = $(domB).offset
        var shadowA_x = [offsetA.left, $(domA).width() + offsetA.left]
        var shadowA_y = [offsetA.top, $(domA).height() + offsetA.top]
        var shadowB_x = [offsetB.left, $(domB).width() + offsetB.left]
        var shadowB_y = [offsetB.top, $(domB).height() + offsetB.top]
        var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1]) || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1])
        var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1]) || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1])
        return intersect_x && intersect_y
    }
    //错开重排
    var reset = function (domA, domB) {
        if ($(domA).css('top') != 'auto') {
            $(domA).css('top', parseInt($(domA).css('top')) + $(domB).height())
        }
        if ($(domA).css('bottom') != 'auto') {
            $(domA).css('bottom', parseInt($(domA).css('bottom')) + $(domB).height())
        }
    }
    var willReset = [list[0]]
    $.each(list, function (i, domTarget) {
        if (compare(willReset[willReset.length - 1], domTarget)) {
            willReset.push(domTarget)
        }
        if (willReset.length > 1) {
            $.each(willReset, function (i, domA) {
                if (willReset[i + 1])
                    reset(domA, willReset[i + 1])
            })
            ComponentPie.reSort(willReset)
        }
    })
}