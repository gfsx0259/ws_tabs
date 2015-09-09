core.apps.carosel = function (args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        opacity: false,
        labels: [],
        texts: [],
        texts_content: [],
        layout_dir: 1,
        type: "content",
        speed: 20,
        pause: false,
        auto_scroll: false,
        auto_scroll_time_interval: 5,
        event: "onclick"
    };
    this.active_text_id = null;
    this.steps = 10;
    this.pause = false;
    this.modify_text_id = null;
    this.loop_counter = null;
    this.auto_timer = null;

};


core.apps.carosel.prototype = {


    buildContent: function (el) {
        this.callFunction("addTextListenters");
        this.buildModel(this.$["content"],
            {
                tag: "div", id: "carosel", className: "carosel",
                childs: [
                    {
                        tag: "div", className: "carosel_slider",
                        childs: [
                            {tag: "div", id: "carosel_contents"}
                        ]
                    }
                ]
            }
        );
    },


    onOpen: function () {
        this.setTitle(this.profile["title"]);
        this.refresh();
    },


    setBlockContent: function (text) {
        var key = "section-" + text.id;
        if (!this.$[key]) return;
        this.$[key].innerHTML = text[this.profile.texts_content[text.id] || this.profile.type];
        if (core.usertype >= USERTYPE_ADMIN)
            this.$[key].onclick = this.onTextClick.bindAsEventListener(this);
    },


    refresh: function () {
        if (this.auto_timer != null) {
            clearTimeout(this.auto_timer);
        }

        this.$["carosel_contents"].innerHTML = "";
        this.displayTpl(this.$["carosel_contents"], "carosel");

        this.states = [];
        var first_text_id = -1;
        var labels = this.profile["labels"];
        var vert_dir = this.profile["layout_dir"] == 0;

        for (var i = 0; i < labels.length; i++) {
            var text_id = this.profile.texts[i];
            if (text_id != null) {
                if (i == 0) {
                    this.active_text_id = text_id;
                }

                var m = [
                    {
                        tag: (vert_dir ? "div" : "td"),
                        style: {verticalAlign: "top"},
                        id: "section-" + text_id,
                        childs: [
                            {tag: "div", innerHTML: labels[i]}
                        ]
                    }
                ];


                this.states[text_id] = 0;
                if (first_text_id == -1) {
                    first_text_id = text_id;
                }
            }

            if (vert_dir) {
                this.buildModel(this.$["carosel_maincontainer_cell"], m);
            } else {
                if (i == 0) {
                    this.$["carosel_maincontainer_row"].removeChild(this.$["carosel_maincontainer_row"].firstChild);
                }
                this.buildModel(this.$["carosel_maincontainer_row"], m);
            }
            core.data.texts.get(text_id, this.setBlockContent.bind(this));
        }


        if (this.profile["layout_dir"] == 0) {
            core.browser.event.attach(this.$["arrow_bottom"], this.profile["event"], this["onMoveBack"].bindAsEventListener(this));
            core.browser.event.attach(this.$["arrow_top"], this.profile["event"], this["onMoveNext"].bindAsEventListener(this));
        } else {
            core.browser.event.attach(this.$["arrow_right"], this.profile["event"], this["onMoveBack"].bindAsEventListener(this));
            core.browser.event.attach(this.$["arrow_left"], this.profile["event"], this["onMoveNext"].bindAsEventListener(this));
        }

        if (this.profile["pause"]) {
            core.browser.event.attach(this.$["carosel_maincontainer_table"], "onmouseover", this["onPause"].bindAsEventListener(this));
            core.browser.event.attach(this.$["carosel_maincontainer_table"], "onmouseout", this["onResume"].bindAsEventListener(this));
        }
        this.slideContent(this.active_text_id);
    },


    onPause: function () {
        this.pause = true;
    },

    onResume: function () {
        this.pause = false;
    },


    hideShowArrows: function () {
        var dir_fl = this.profile["layout_dir"] == 0;

        if (dir_fl) {
            this.showElements(["arrow_top", "arrow_bottom"]);
            this.hideElements(["arrow_left", "arrow_right"]);
        } else {
            this.hideElements(["arrow_top", "arrow_bottom"]);
            this.showElements(["arrow_left", "arrow_right"]);
        }

        for (var i = 0; i < this.profile.texts.length; i++) {
            if (this.profile.texts[i] == this.active_text_id) break;
        }

        if (i <= 0) {
            this.hideElement(dir_fl ? "arrow_bottom" : "arrow_right");
        } else {
            this.showElement(dir_fl ? "arrow_bottom" : "arrow_right");
        }

        if (i >= this.profile.texts.length - 1) {
            this.hideElement(dir_fl ? "arrow_top" : "arrow_left");
        } else {
            this.showElement(dir_fl ? "arrow_top" : "arrow_left");
        }
    },


    onMoveNext: function () {
        for (var i = 0; i < this.profile.texts.length; i++) {
            if (this.profile.texts[i] == this.active_text_id)
                break;
        }
        if (i < this.profile.texts.length - 1) {
            this.active_text_id = this.profile.texts[i + 1];
            this.slideContent(this.active_text_id);
        }
    },


    onMoveBack: function () {
        for (var i = 0; i < this.profile.texts.length; i++) {
            if (this.profile.texts[i] == this.active_text_id)
                break;
        }
        if (i > 0) {
            this.active_text_id = this.profile.texts[i - 1];
            this.slideContent(this.active_text_id);
        }
    },


    onAutoScroll: function () {
        for (var i = 0; i < this.profile.texts.length; i++) {
            if (this.profile.texts[i] == this.active_text_id)
                break;
        }
        if (this.active_text_id != this.profile.texts[this.profile.texts.length - 1])
            this.active_text_id = this.profile.texts[i + 1];
        else
            this.active_text_id = this.profile.texts[0];
        this.slideContent(this.active_text_id);
    },


    slideContent: function (id, skip_animation) {
        if (this.auto_timer != null) {
            clearTimeout(this.auto_timer);
        }
        if (!id) return;

        var parent = this.$['carosel'].parentNode;
        if (this.profile["layout_dir"] == 1) {
            var new_width = parent.clientWidth - 100;
        } else {
            var new_width = parent.clientWidth - 10;
        }

        if (new_width < 0) {
            if (this.profile["layout_dir"] == 1)
                new_width = parent.offsetWidth - 100;
            else
                new_width = parent.offsetWidth - 10;
        }

        var new_table_width = this.profile.texts.length * new_width;
        var slider = this.$['subcontainer'];

        if (this.profile["layout_dir"] == 1) {
            this.$['carosel_maincontainer_table'].style.width = new_table_width + "px";
            slider.style.width = new_table_width + "px";
        } else {
            this.$['carosel_maincontainer_table'].style.width = new_width + "px";
            slider.style.width = new_width + "px";
        }
        id = "section-" + id;
        var div = this.$[id];
        div.style.width = new_width + "px";
        clearInterval(slider.timer);
        this.$['maincontainer'].style.height = div.clientHeight + "px";
        this.$['maincontainer'].style.width = new_width + "px";
        slider.section = parseInt(id.replace(/\D/g, ''));
        if (this.profile["layout_dir"] == 1) {
            slider.target = div.offsetLeft;
            slider.style.left = slider.style.left || '0px';
            slider.current = slider.style.left.replace('px', '');
        } else {
            slider.target = div.offsetTop;
            slider.style.top = slider.style.top || '0px';
            slider.current = slider.style.top.replace('px', '');
        }
        slider.direction = (Math.abs(slider.current) > slider.target) ? 1 : -1;
        if (this.profile["opacity"]) {
            slider.style.opacity = 40 * .01;
            slider.style.filter = 'alpha(opacity=' + 40 + ')';
        }

        this.hideShowArrows();
        if (skip_animation) return;
        slider.timer = setInterval(this.slideAnimate.bind(this, slider), this.profile["speed"]);
    },


    slideAnimate: function (slider) {
        if (this.pause) return;

        var speed = parseInt(this.profile["speed"]);

        var curr = Math.abs(slider.current);
        var tar = Math.abs(slider.target);

        var dir = slider.direction;
        if ((tar - curr <= speed && dir == -1) || (curr - tar <= speed && dir == 1)) {
            if (this.profile["layout_dir"] == 1) {
                slider.style.left = (slider.target * -1) + 'px';
            } else {
                slider.style.top = (slider.target * -1) + 'px';
                slider.style.left = '0px';
            }
            if (this.profile["opacity"]) {
                slider.style.opacity = 1;
                slider.style.filter = 'alpha(opacity=100)';
            }
            slider.style.width = slider.clientWidth + "px";
            clearInterval(slider.timer);
            if (this.profile["auto_scroll"]) {
                this.auto_timer = setTimeout(
                    this.onAutoScroll.bind(this, slider),
                    this.profile["auto_scroll_time_interval"] * 1000
                );
            }
        } else {
            var pos = parseInt(slider.current) + (dir == 1 ? speed : -speed);

            slider.current = pos;
            if (this.profile["layout_dir"] == 1) {
                slider.style.left = pos + 'px';
            } else {
                slider.style.top = pos + 'px';
            }
        }
    }

};
core.apps.carosel.extendPrototype(core.components.html_component);
core.apps.carosel.extendPrototype(core.components.desktop_app);