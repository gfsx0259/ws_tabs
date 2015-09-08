core.apps.tabbed_apps = function(args) {

    this.bodyText=[];
    this.summaryText=[];

    this.defaultProfile = {
        title: "",
        app_style: "",
        list: [],
        style: "",
        speed: 1
    }

    this.active_tab_idx = null;
    this.intervals = [ 10, 30, 45 ];


    this.blocks_count = 0;

//    this.theme_style_key = "tabbed_texts";
}


core.apps.tabbed_apps.prototype = {


    buildContent: function(el) {
        this.displayTpl(el, "tabbed_apps");
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

//        this.$["content_roller_box"].style.height = "";
        this.$["tabs_box"].className = "tabbed_tabs";
        var w = this.$["content_roller_box"].offsetWidth + "px";

        var tabs_el = this.$["tabs_roller"];
        var row_el = this.$["row"];



        if(this.profile.list.length > this.blocks_count) {
            // add tabs
            for(var i=this.blocks_count; i<this.profile.list.length; i++) {
                this.buildModel(tabs_el,
                    { tag: "a",
                      id: "tab" + i,
                      events: { onclick: ["onTabClick", i] }}
                );

                this.buildModel(row_el,
                    { tag: "td",
                      style: { width: w },
                      childs: [
                        { tag: "div",
                          wid: "cell",
                          is_row: true,
                          id: "tab_content" + i }
                      ]}                
                );
            }
        } else {
            // remove tabs
            for(var i=this.profile.list.length; i<this.blocks_count; i++) {
                core.browser.element.remove(this.$["tab" + i]);
                core.browser.element.remove(this.$["tab_content" + i]);
            }
        }
        this.blocks_count = this.profile.list.length;


        for(var i=0; i<this.profile.list.length; i++) {
            var b = this.profile.list[i];
            this.$["tab" + i].innerHTML = 
                "<span>" + 
                (b.icon ? "<img src='" + core.common.getUserFile(b.icon) + "'/>" : "") + 
                b.title + 
                "</span>";
        }


        this.content_ofs = 0;
        this.initTabsNav();
        if(this.profile.list.length > 0) {
            this.selectTab(0);
        }
    },






    onTabClick: function(e, idx) {
        if(this.active_tab_idx == idx) return;
        if(this.active_tab_idx != null) {
            this.$["tab" + this.active_tab_idx].className = "";
        }
        this.selectTab(idx);
    },



    selectTab: function(idx) {
        if(this.active_tab_idx == null) {
            this.active_content_height = this.$["row"].childNodes[idx].firstChild.offsetHeight;
        } else {
            this.active_content_height = this.$["row"].childNodes[this.active_tab_idx].firstChild.offsetHeight;
        }
        this.target_content_height = this.$["row"].childNodes[idx].firstChild.offsetHeight;

        var el = this.$["tab" + idx];
        el.className = "active";
        el.blur();
        this.active_tab_idx = idx;

        clearInterval(this.content_timer);
        this.content_timer = setInterval(this.scrollContent.bind(this), this.intervals[this.profile["speed"]]);
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
        var nx = this.active_tab_idx * w;
        this.content_ofs = this.content_ofs + (nx - this.content_ofs) * 0.2;
        if(Math.abs(nx - this.content_ofs) <= 1) {
            this.content_ofs = nx;
            clearInterval(this.content_timer);
        }
        this.$["content_roller"].style.marginLeft = (-this.content_ofs) + "px";
    },



    // tabs navigation
    initTabsNav: function() {
        if(core.values.skip_tabs_scroll) return;
        var tabs_box = this.$["tabs_roller_box"];
        var tabs_el = this.$["tabs_roller"];
        var w = 0;
        for(var i=0; i<tabs_el.childNodes.length; i++) {
            tabs_el.childNodes[i].style.display = "";
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
        if(this.profile.list.length > 0) {
            var tabs_el = this.$["tabs_roller"];
            this.$["nav_l"].className = this.first_visible_tab == 0 ? "nav_lna" : "nav_l";
            this.$["nav_r"].className = tabs_el.lastChild.offsetWidth != 0 ? "nav_rna" : "nav_r";
        } else {
            this.$["nav_l"].className = "nav_lna";
            this.$["nav_r"].className = "nav_rna";
        }
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



    getContentElement: function(idx) {
        return this.$["tab_content" + idx];
    }

}
core.apps.tabbed_apps.extendPrototype(core.components.html_component);
core.apps.tabbed_apps.extendPrototype(core.components.desktop_app);