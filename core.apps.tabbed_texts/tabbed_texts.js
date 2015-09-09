core.apps.tabbed_texts = function(args) {

    this.bodyText=[];
    this.summaryText=[];
    this.defaultProfile = {
        title: "",
        app_style: "",
        labels: [],
        text_ids: [],
        texts_content: [],
        icons: [],
        style: "",
        speed: 1,
        variable_content: false,
        auto_height: true
    };

    this.active_tab = null;

    this.intervals = [ 10, 30, 45 ];

};


core.apps.tabbed_texts.prototype = {


    buildContent: function(el) {
        this.displayTpl(el, "tabbed_texts");
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refreshTabs();
        this.callFunction("addTextListenters");
    },


    applyTabbedStyle: function() {
        this.$["tabbed"].className = "tabbed " + this.profile["style"];
    },


    refreshTabs: function() {
        var is_admin = core.usertype >= USERTYPE_ADMIN;

        this.applyTabbedStyle();

        this.$["content_roller_box"].style.height = "";

        this.$["tabs_box"].className = "tabbed_tabs";
        var w = this.$["content_roller_box"].offsetWidth + "px";

        var tabs_el = this.$["tabs_roller"];
        var row_el = this.$["row"];

        tabs_el.innerHTML = "";
        core.browser.element.removeChilds(row_el);


        this.data_source = this.getDataSource();

        var labels = this.data_source.labels;
        var icons = this.data_source.icons;
        var texts = this.data_source.text_ids;
        if(labels.length == 0) return;

        for(var i=0; i<labels.length; i++) {
            var label = (icons[i] ? "<img src='" + core.common.getUserFile(icons[i]) + "'/>" : "") + labels[i];
            this.buildModel(tabs_el,
                { tag: "a",
                  id: "tab" + i,
                  events: { onclick: ["onTabClick", i] },
                  innerHTML: "<span>" + label + "</span>"}
            );


            var m = 
                { tag: "td",
                  style: { width: w },
                  childs: [
                    { tag: "div",
                      style: { minHeight: "10px" },
                      id: "text" + texts[i] }
                  ]};
            if(is_admin) {
                m.events = { onclick: "onTabContentClick" }
            }
            
            this.buildModel(row_el, m);
            core.data.texts.get(texts[i], this.setTabContent.bind(this, i));
        }

        this.content_ofs = 0;
        this.initTabsNav();
        this.selectTab(this.active_tab || 0);
    },





    getDataSource: function() {
        if(this.profile["variable_content"]) {
            var res = {
                labels: [],
                icons: [],
                text_ids: [],
                texts_content: {}
            };
            if(core.data.variable_content.docs && core.data.variable_content.docs.length) {
                for(var i=0; i<core.data.variable_content.docs.length; i++) {
                    var d = core.data.variable_content.docs[i];
                    res.labels[i] = d.title;
                    res.text_ids[i] = d.doc.id;
                    res.texts_content[d.doc.id] = d.doc.content;
                }
            } else if(core.usertype < USERTYPE_ADMIN && this.profile["hide_if_empty"]) {
                this.hideElement("window");
            }
            return res;
        } else {
            return this.profile;
        }
    },



    onTabClick: function(e, idx) {
        if(this.active_tab == idx) return;
        if(this.active_tab != null) {
            this.$["tab" + this.active_tab].className = "";
        }
        this.selectTab(idx);
    },


    selectTab: function(idx) {
        if(this.active_tab == null) {
            this.active_content_height = this.$["row"].childNodes[idx].firstChild.offsetHeight;
        } else {
            this.active_content_height = this.$["row"].childNodes[this.active_tab].firstChild.offsetHeight;
        }
        this.target_content_height = this.$["row"].childNodes[idx].firstChild.offsetHeight;

        var el = this.$["tab" + idx];
        el.className = "active";
        el.blur();
        this.active_tab = idx;

        clearInterval(this.content_timer);
        this.content_timer = setInterval(this.scrollContent.bind(this), this.intervals[this.profile["speed"]]);
    },

    
    setTabContent: function(idx, doc) {
        var el = this.$["text" + doc.id];
        if(!el) return;
        el.innerHTML = doc[this.data_source.texts_content[doc.id] || "content"];

        if(idx == 0 && this.profile["auto_height"]) {
            this.active_content_height = this.$["row"].childNodes[idx].firstChild.offsetHeight;
            this.$["content_roller_box"].style.height = this.active_content_height + "px";
        }
    },




    // content animation

    scrollContent: function() {
        var w = this.$["content_roller_box"].offsetWidth;
        var wpx = w + "px";

        var row = this.$["row"];

        // update content width
        for(var i=0; i<row.childNodes.length; i++) {
            row.childNodes[i].style.width = wpx;
        }

        // scroll
        var nx = this.active_tab * w;
        this.content_ofs = this.content_ofs + (nx - this.content_ofs) * 0.2;
        if(Math.abs(nx - this.content_ofs) <= 1) {
            this.content_ofs = nx;
            clearInterval(this.content_timer);
        }
        this.$["content_roller"].style.marginLeft = (-this.content_ofs) + "px";

        if(this.profile["auto_height"] && this.active_content_height != null) {
            this.active_content_height = this.active_content_height + (this.target_content_height - this.active_content_height) * 0.2;
            if(Math.abs(this.active_content_height - this.target_content_height) <= 1) {
                this.active_content_height = this.target_content_height;
            }   
            this.$["content_roller_box"].style.height = this.active_content_height + "px";
        }
    },



    // tabs navigation
    initTabsNav: function() {
        if(core.values.skip_tabs_scroll) return;
        var tabs_box = this.$["tabs_roller_box"];
        var tabs_el = this.$["tabs_roller"];
        var w = 0;
        for(var i=0; i<tabs_el.childNodes.length; i++) {
            w += tabs_el.childNodes[i].offsetWidth;
            if(w > tabs_box.offsetWidth) {
                var fl = 1;
                break;
            }
        }

        if(fl) {
            this.$["tabs_box"].className = "tabbed_tabs tabbed_tabs_navigated";
            this.showTabsFrom(0);
        }
        this.updateTabsNav();
    },


    updateTabsNav: function() {
        var tabs_el = this.$["tabs_roller"];
        this.$["nav_l"].className = this.first_visible_tab == 0 ? "nav_lna" : "nav_l";
        this.$["nav_r"].className = tabs_el.lastChild.offsetWidth != 0 ? "nav_rna" : "nav_r";
    },


    scrollTabs: function(dir) {
        var tabs_el = this.$["tabs_roller"];
        var f = this.first_visible_tab + dir;
        if(dir != - 1 && tabs_el.lastChild.offsetWidth) return;
        if(f < 0) return;

        this.showTabsFrom(f);
        this.updateTabsNav();
    },



    showTabsFrom: function(first) {
        this.first_visible_tab = first;

        var tabs_box = this.$["tabs_roller_box"];
        var tabs_el = this.$["tabs_roller"];
        var l = tabs_el.childNodes.length;

        for(var i=0; i<l; i++) {
            tabs_el.childNodes[i].style.display = "none";
        }
        var w = 0;
        for(var i=first; i<l; i++) {    
            var el = tabs_el.childNodes[i];
            el.style.display = "block";
            w += el.offsetWidth;
            if(w > tabs_box.offsetWidth) {
                el.style.display = "none";
                break;
            }
        }
    },


    onTabsNavLeftClick: function(e) {
        this.scrollTabs(-1);
    },

    onTabsNavRightClick: function(e) {
        this.scrollTabs(1);
    }

};
core.apps.tabbed_texts.extendPrototype(core.components.html_component);
core.apps.tabbed_texts.extendPrototype(core.components.desktop_app);