core.apps.slides = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        slides: [],
        interval: 5,
        text_effect: "fade",
        image_effect: "fade",
        height: 200,
        navigation: true
    };

    this.active_slide = 0;
    this.is_show_started = false;
    this.timeout = null;


    this.fade_start = 2;
    this.fade_finish = 10;

    this.scroll_iterations = 20;

    this.speedEffect = 30;
    this.speedEffectAppear = 40;
};



core.apps.slides.prototype = {


    buildContent: function(el) {
        var h = this.profile["height"] + "px";

        this.buildModel(this.$["content"], 
            { tag: "div", className: "slides",
              childs: [
                { tag: "div", className: "boxes",
                  id: "boxes",
                  style: { height: h },
                  childs: [
                    { tag: "div", 
                      className: "box_text", 
                      id: "box_text" },

                    { tag: "div",
                      className: "box_image",
                      id: "box_image"}
                  ]},

                { tag: "div", 
                  className: "nav",
                  id: "nav" }
              ]}

        );
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.$["window"].style.overflow = "hidden";
        this.refresh();
    },


    onClose: function() { 
        clearTimeout(this.timeout);
    },




    // slideshow

    boldLink: function(val) {
        if(this.profile["navigation"]) {
            for(var kt=0;kt< this.profile.slides.length;kt++){
                var el = this.$["title" + kt];
                if(el) {
                    el.className = "";
                }
            }
            var el = this.$["title"+val];
            if(el) {
                el.className = "active";
                el.blur();
            }
        }
    },



    refresh: function() {
        clearTimeout(this.timeout);

        this.$["nav"].innerHTML = "";
        this.$["box_text"].innerHTML = "";
        this.$["box_image"].innerHTML = "";


        for(var i=0; i<this.profile.slides.length; i++) {
            var slide = this.profile.slides[i];

            this.buildModel(this.$["box_image"],
                { tag: "div",
                  id: "slide_image" + i,
                  className: "slide_image",
                  display: false,
                  childs: [
                    { tag: "img",
                      src: slide.file ? core.common.getUserFile(slide.file) : "" }
                  ]}
            );

            this.buildModel(this.$["box_text"],
                { tag: "div",
                  id: "slide_text" + i,
                  className: "slide_text",
                  display: false,
                  childs: [
                    { tag: "div",
                      className: "slide_doc",
                      innerHTML: slide.doc.id == null ? "" : "Loading...",
                      id: "doc" + i }
                  ]}
            );

            if(slide.doc.id != null) {
                core.data.texts.get(slide.doc.id, this.setDocument.bind(this, i));
            }

            if(this.profile.navigation) {
                this.buildModel(this.$["nav"],
                    { tag: "a", 
                      id: "title" + i,
                      innerHTML: (i+1), 
                      events: { onclick: ["onNavClick", i] }}
                );
            }
        }

        this.old_slide = null;
        if(this.profile.slides.length && !this.is_show_started) {
            this.is_show_started = true;
            this.setActiveSlide(0);
        }
    },



    // docs

    setDocument: function(idx, doc) {
        var el = this.$["doc" + idx];
        if(el) {
            el.innerHTML = doc[this.profile.slides[idx].doc.content] || "content";
        }
    },


    // navigation

    onNavClick: function(el, idx) {
//        this.setActiveSlide(idx);
        if(this.is_scroll) return;

        clearTimeout(this.timeout);
        this.old_slide = this.active_slide;
        this.active_slide = idx;
        this.boldLink(this.active_slide);
        this.showEffect("text");
        this.showEffect("image");
    },





    // slides
    
    setActiveSlide: function(idx) {
        if(this.is_scroll) return;
        if(this.active_slide != null) {
            this.hideElement("slide_text" + this.active_slide);
            this.hideElement("slide_image" + this.active_slide);
        }
        this.active_slide = parseInt(idx, 10);
        this.boldLink(idx);
        this.showSlide(idx, "text");
        this.showSlide(idx, "image");
        this.initNextSlide();
    },




    initNextSlide: function() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.showNextSlide.bind(this), 1000 * this.profile["interval"]);
    },



    showNextSlide: function (){
        clearTimeout(this.timeout);
        this.old_slide = this.active_slide;
        if(this.active_slide + 1 >= this.profile.slides.length) {
            this.active_slide = 0;
        } else {
            this.active_slide++;
        }    
        this.boldLink(this.active_slide);
        this.showEffect("text");
        this.showEffect("image");
    },

        

    showSlide: function(idx, target) {
        var id = "slide_" + target + idx;
        this.showElement(id);
        this.$[id].style.left = 0;
        this.$[id].style.top = 0;
        this.$[id].style.opacity = 1;
        this.$[id].style.filter = 'alpha(opacity=100)';
    },



    showEffect: function(target) {
        switch(this.profile[target + "_effect"]) {
            case "scroll_vertical":
                this.scrollEffect("vertical", target);
                break;
            case "scroll_horizontal":
                this.scrollEffect("horizontal", target);
                break;
            case "fade":
                this.fadeEffect(target);
                break;
            default:
                if(this.old_slide != null) {
                    this.hideElement("slide_" + target + this.old_slide);
                }
                this.showSlide(this.active_slide, target);
                this.initNextSlide();
                break;
        }
    },





    // scroll effect

    scrollEffect: function(dir, target) {
        this.is_scroll = true;

        var id = "slide_" + target + this.active_slide;

        switch(dir) {
            case "horizontal":
                this.$[id].style.left = "10000px";
                break;
            case "vertical":
                this.$[id].style.top = "10000px";
                break;
        }

        this.showElement(id);

        var mul = 100 / this.scroll_iterations;
        for(var i=1; i<=this.scroll_iterations; i++) {
            setTimeout(this.scrollUpdateImages.bind(this, dir, i * mul, target), this.speedEffectAppear * i);
        }
        setTimeout(this.onScrollEnd.bind(this), this.speedEffectAppear * (i + 1));
    },



    // pos in percents [0..100]
    scrollUpdateImages: function(dir, pos, target) {
        if(!this.is_scroll) return;
        switch(dir) {
            case "horizontal":
                var box_w = this.$["box_" + target].clientWidth;
                var d = Math.round(box_w * pos / 100);
                this.$["slide_" + target + this.old_slide].style.left = (-d) + "px";
                this.$["slide_" + target + this.active_slide].style.left = (box_w - d) + "px";
                break;
            case "vertical":
                var box_h = this.$["box_" + target].clientHeight;
                var d = Math.round(box_h * pos / 100);
                this.$["slide_" + target + this.old_slide].style.top = (-d) + "px";
                this.$["slide_" + target + this.active_slide].style.top = (box_h - d) + "px";
                break;
        }
    },


    onScrollEnd: function(target) {
        if(!this.is_scroll) return;

        if(this.old_slide != null) {
            this.hideElement("slide_" + target + this.old_slide);
        }
        this.initNextSlide();
        this.is_scroll = false;
    },



    // fade effect

    fadeEffect: function(target) {
        for(var i=this.fade_start; i<=this.fade_finish; i++) {
            setTimeout(this.setOpacity.bind(this, i, target), this.speedEffectAppear * i);
        }
    },



    setOpacity: function(value, target) {
        var el = this.$["slide_" + target + this.active_slide];
        el.style.opacity = value / this.fade_finish;
        el.style.filter = 'alpha(opacity=' + (value * this.fade_finish) + ')';
        this.showElement("slide_" + target + this.active_slide);

        if(this.old_slide != null) {
            var el = this.$["slide_" + target + this.old_slide];
            var v = this.fade_finish - value;
            el.style.opacity = v / this.fade_finish;
            el.style.filter = 'alpha(opacity=' + (v * this.fade_finish) + ')';
        }

        if(value == this.fade_finish) {
            this.hideElement("slide_" + target + this.old_slide);
            this.initNextSlide();
        }
    }


};
core.apps.slides.extendPrototype(core.components.html_component);
core.apps.slides.extendPrototype(core.components.desktop_app);