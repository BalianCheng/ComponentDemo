/**
 * Created by Dovahkiin on 2017/4/7.
 */
var Content_loading = function (images, firstPage) {
    var id = this.id
    if (this._images === undefined) {
        this._images = (images || []).length
        this._load = 0
        window[id] = this
        for (var s in images) {
            var item = images[s]
            var img = new Image
            img.onload = function () {
                window[id].loader();
            }
            img.src = item
        }
        $('#rate').text('0%')
        return this
    }
    else {
        this._load++
        $('#rate').text(((this._load / this._images * 100) >> 0) + '%')
        if (this._load < this._images) {
            return this
        }
    }
    window[id] = null
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