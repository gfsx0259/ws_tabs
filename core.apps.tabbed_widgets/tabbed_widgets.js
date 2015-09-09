core.apps.tabbed_widgets = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        style: "",
        speed: 1,
        tabs: [],
        icons: []
    };

    this.active_tab = null;

    this.intervals = [ 10, 30, 45 ];

};


core.apps.tabbed_widgets.prototype = {


    buildContent: function(el) {
        this.displayTpl(el, "tabbed");
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refreshTabs();
    },


    applyTabbedStyle: function() {
        this.$["tabbed"].className = "tabbed " + this.profile["style"];
    },


    refreshTabs: function() {
        this.applyTabbedStyle();

        var tabs = this.profile["tabs"];
        if(tabs.length == 0) return;


        this.$["tabs_box"].className = "tabbed_tabs";
        var w = this.$["content_roller_box"].offsetWidth + "px";

        var tabs_el = this.$["tabs_roller"];
        var row_el = this.$["row"];

        tabs_el.innerHTML = "";
        core.browser.element.removeChilds(row_el);

        var tabs = this.profile["tabs"];
        var icons = this.profile["icons"];

        if(tabs.length == 0) return;

        for(var i=0; i<tabs.length; i++) {
            var label = (icons[i] ? "<img src='" + core.common.getUserFile(icons[i]) + "'/>" : "") + tabs[i];
            this.buildModel(tabs_el,
                { tag: "a",
                  id: "tab" + i,
                  events: { onclick: ["onTabClick", i] },
                  innerHTML: "<span>" + label + "</span>" }
            );

            this.buildModel(row_el,
                { tag: "td",
                  style: { width: w, minHeight: "60px" },
                  childs: [
                    { tag: "div", 
                      wid: "cell",
                      is_app_cell: true,
                      style: { minHeight: "50px", width: w, overflow: "hidden" },
                      id: "cell" + i }
                  ] }
            );
        }

        this.content_ofs = 0;
        this.initTabsNav();
        this.selectTab(this.active_tab || 0);
/*
        for(var i=0; i<tabs.length; i++) {
            this.buildModel(this.$["tabs"],
                { tag: "a",
                  id: "tab" + i,
                  events: { onclick: ["onTabClick", i] },
                  innerHTML: "<span>" + tabs[i] + "</span>" }
            );

            this.buildModel(this.$["texts"],
                { tag: "div", className: "tabber_text", 
                  wid: "cell",
                  is_app_cell: true,
                  display: false,
                  style: { minHeight: "50px" },
                  id: "cell" + i }
            );
        }
        this.selectTab(this.activeTab == null ? 0 : this.activeTab);
        */
    },


    onTabClick: function(e, idx) {
        if(this.active_tab == idx) return;
        if(this.active_tab != null) {
            this.$["tab" + this.active_tab].className = "";
        }
        this.selectTab(idx);
    },



    selectTab: function(idx) {
        var el = this.$["tab" + idx];
        el.className = "active";
        el.blur();
        this.active_tab = idx;

        clearInterval(this.content_timer);
        this.content_timer = setInterval(this.scrollContent.bind(this), this.intervals[this.profile["speed"]]);

        var el = this.$["cell" + idx];
        for(var i=0; i<el.childNodes.length; i++) {
            var app = desktop.layout.getApp(el.childNodes[i].wid);
            if(app) {
                app.callFunction("onResize");
            }
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
    },



    // tabs navigation
    initTabsNav: function() {
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
    },


    getCell: function(c) {
        return this.$["cell" + c];
    }

};
core.apps.tabbed_widgets.extendPrototype(core.components.html_component);
core.apps.tabbed_widgets.extendPrototype(core.components.desktop_app);