/**
 * Created by Dovahkiin on 2017/4/3.
 */
var jData = []//使用JSON.stringify(jData)将数据转化为json格式
var Content = function () {
    this.id = ('Cont_' + Math.random()).replace(".", "_")
    this.el = $('<div class="Content" id="' + this.id + '"></div>').hide()
    this.page = []
    $("body").append(this.el)
    this.addPage = function (name, text) {
        jData.push({isPage: true, name: name, text: text})
        var page = $('<div class="page section"></div>')
        if (name != undefined) {
            page.addClass('page_' + name)
        }
        if (text != undefined) {
            page.html(text)
        }
        this.el.append(page)
        this.page.push(page)
        if (typeof this.whenAddPage === 'function') {
            this.whenAddPage()
        }
        return this;
        return this
    }
    this.addComponent = function (name, cfg) {
        jData.push({isPage: false, name: name, cfg: cfg})
        var cfg = cfg || {}
        cfg = $.extend({
            type: 'base'
        }, cfg)
        var component
        var page = this.page.slice(-1)[0]
        switch (cfg.type) {
            case 'base':
                component = new ComponentBase(name, cfg)
                break

            case 'polyline' :
                component = new ComponentPolyline(name, cfg);
                break;

            case 'pie' :
                component = new ComponentPie(name, cfg);
                break;
            case 'bar' :
                component = new ComponentBar(name, cfg);
                break;
            case 'bar_v' :
                component = new ComponentBar_v(name, cfg);
                break;

            case 'radar' :
                component = new ComponentRadar(name, cfg);
                break;

            case 'pie' :
                component = new ComponentPie(name, cfg);
                break;
            case 'ring' :
                component = new ComponentRing(name, cfg);
                break;
            case 'point' :
                component = new ComponentPoint(name, cfg);
                break;
            default:
        }
        page.append(component)
        return this
    }
    this.loader = function (firstPage) {
        this.el.fullpage({
                onLeave: function (index, nextIndex, dircetion) {
                    $(this).find('.component').trigger("onLeave")
                },
                afterLoad: function (anchorLink, index) {
                    $(this).find('.component').trigger("afterLoad")
                }
            }
        )
        this.page[0].find('component').trigger("afterLoad")
        this.el.show()
        if (firstPage) {
            $.fn.fullpage.moveTo(firstPage);
        }
    }
    this.loader = typeof Content_loading == 'function' ? Content_loading : this.loader;

    return this
}
