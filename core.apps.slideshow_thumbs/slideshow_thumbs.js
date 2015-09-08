core.apps.slideshow_thumbs = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        items: [],
        height: 200
    }


    this.scroll_steps = 20;
    this.scroll_frame_delay = 20;

}



core.apps.slideshow_thumbs.prototype = {


    buildContent: function(el) {
        this.displayTpl(el, "slideshow_thumbs");
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refresh();
    },



    refresh: function() {
        this.$["scroller_content"].innerHTML = "";
        this.$["scroller_content"].style.marginTop = 0;

        this.items = this.getItems();
        var m = [];
        for(var i=0; i<this.items.length; i++) {
            var pic = core.common.getUserFile(this.items[i].file);
            m.push(
                { tag: "a", 
                  id: "thumb" + i,
                  events: { onclick: [ "onThumbClick", i ] },
                  innerHTML: "<img src='" + pic + "' alt='" + this.items[i].alt + "'/>" }
            );
        }
        this.scroll_ofs = 0;
        this.buildModel(this.$["scroller_content"], m);
        this.onHeightChange();
        if(this.items.length) {
            this.onThumbClick(null, 0);
        }
    },



    getItems: function() {
        if(this.profile["variable_content"]) {
            var res = [];
            if(core.data.variable_content.images) {
                res = core.data.variable_content.images;
            } else if(core.usertype < USERTYPE_ADMIN && this.profile["hide_if_empty"]) {
                this.hideElement("window");
            }
            return res;
        } else {
            return this.profile["items"];
        }
    },




    onThumbClick: function(e, idx) {
        if(this.active_idx) {
            this.$["thumb" + this.active_idx].className = "";
        }

        this.active_idx = idx;
        this.$["thumb" + idx].className = "active";
        this.$["img"].src = core.common.getUserFile(this.items[idx].file);
    },



    onPrevClick: function() {
        if(this.is_scroll) return;
        this.scroll_ofs_new = this.scroll_ofs - this.$["scroller_wrapper"].offsetWidth;
        if(this.scroll_ofs_new < 0) {
            this.scroll_ofs_new = 0;
        }
        this.animateScroll();
    },


    onNextClick: function() {
        if(this.is_scroll) return;
        this.scroll_ofs_new = this.scroll_ofs + this.$["scroller_wrapper"].offsetWidth;
        if(this.scroll_ofs_new + this.$["scroller_wrapper"].offsetWidth >= this.$["scroller_content"].offsetWidth) {
            this.scroll_ofs_new = this.$["scroller_content"].offsetWidth - this.$["scroller_wrapper"].offsetWidth;
        }
        this.animateScroll();
    },




    updateControls: function() {
        if(this.scroll_ofs == 0) {
            this.hideElement("btn_prev");
        } else {
            this.showElement("btn_prev");
        }

        if(this.scroll_ofs + this.$["scroller_wrapper"].offsetWidth >= this.$["scroller_content"].offsetWidth) {
            this.hideElement("btn_next");
        } else {
            this.showElement("btn_next");
        }
    },




    animateScroll: function() {
        this.is_scroll = true;
        for(var i=1; i<=this.scroll_steps; i++) {
            setTimeout(this.setScrollOfs.bind(this, i), i * this.scroll_frame_delay);
        }
    },



    setScrollOfs: function(frame) {

        var d = frame * (this.scroll_ofs_new - this.scroll_ofs) / this.scroll_steps;
        this.$["scroller_content"].style.marginLeft = -(this.scroll_ofs + d) + "px";

        if(frame == this.scroll_steps) {
            this.scroll_ofs = this.scroll_ofs_new;
            this.is_scroll = false;
            this.updateControls();
        }
    },



    onHeightChange: function() {
      //  this.$["img_box"].style.height = this.profile["height"] + "px";
        this.scroll_ofs = 0;
        this.$["scroller_content"].style.marginLeft = 0;
        this.updateControls();
    },



    onZoomClick: function() {
        var l = [];
        for(var i=0; i<this.items.length; i++) {
            l.push(this.items[i].file);
        }
        desktop.openImageBox(l, this.active_idx);
    }

}
core.apps.slideshow_thumbs.extendPrototype(core.components.html_component);
core.apps.slideshow_thumbs.extendPrototype(core.components.desktop_app);