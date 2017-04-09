/**
 * Created by Dovahkiin on 2017/4/2.
 */
var ComponentBase = function (name, cfg) {
    var cfg = cfg || {}
    var id = ('Cpt_' + Math.random()).replace('.', '_')
    var cls = 'Cpt_' + cfg.type
    var component = $('<div class="component ' + cls + ' component_name_' + name + '" id="' + id + '"></div>')
    cfg.text && component.text(cfg.text)
    cfg.width && component.width(cfg.width / 2)
    cfg.height && component.height(cfg.height / 2)
    cfg.css && component.css(cfg.css)
    cfg.bg && component.css('backgroundImage', 'url(' + cfg.bg + ')')
    if (cfg.center === true) {
        component.css({
            marginLeft: (cfg.width / 4 * -1) + 'px',
            left: '50%'
        })
    }
    if (typeof cfg.onclick === 'function') {
        component.on('click', cfg.onclick);
    }
    component.on('afterLoad', function () {
        setTimeout(function () {
            component.addClass(cls + '_load').removeClass(cls + '_leave')
            cfg.animateIn && component.animate(cfg.animateIn)
        }, cfg.delay || 0)
        return false
    })
    component.on('onLeave', function () {
        setTimeout(function () {
            component.addClass(cls + '_leave').removeClass(cls + '_load')
            cfg.animateOut && component.animate(cfg.animateOut)
        }, cfg.delay || 0)
        return false
    })
    return component
}
