core.apps.tabbed_widgets.extendPrototype({



    // settings

    settingsBlocks: [
        { title: "Tabs style:", 
          controls: [
            { tag: "wsc_select", id: "inp_style", 
              options: [
                { text: "None", value: "" },
                { text: "A", value: "tbd_a" },
                { text: "B", value: "tbd_b" },
                { text: "C", value: "tbd_c" },
                { text: "D", value: "tbd_d" }
              ]}
          ]},

        { title: "Scroll speed:", 
          controls: [
            { tag: "wsc_slider", id: "inp_speed", 
              options: [
                { text: "Slow", value: 2 },
                { text: "Medium", value: 1 },
                { text: "Fast", value: 0 }
              ]}
          ]},

        { title: "Tabs:",
          controls: [
            { tag: "a", events: { onclick: "openTabsManager" },
              html: "Manage tabs" }
          ]}
    ],


    fillSettingsForm: function() {
        this.tmpCount = this.profile["tabs"].length;
        this.$["inp_style"].setValue(this.profile["style"]);
        this.$["inp_speed"].setValue(this.profile["speed"]);
    },


    processSettingsForm: function() {
        this.profile["style"] = this.$["inp_style"].value;
        this.profile["speed"] = this.$["inp_speed"].value;
    },


    onSettingsUpdated: function() {
        var nc = this.profile["tabs"].length;
        this.updateAppsPositions(this.tmpCount, nc);
        this.tmpCount = nc;
    },





    // manage tabs

    openTabsManager: function() {
        var p = this.profile;
        var list = [];
        for(var i=0; i<p.tabs.length; i++) {
            list.push({
                title: p.tabs[i],
                file: p.icons[i] || ""
            });
        }

        core.values.list_editor = {
            popup_title: "Tabs manager",
            list: list,
            callback: this.onTabsListChanged.bind(this),
            default_item: {
                title: "Tab",
                file: ""
            },
            labels: {
                title: "Title:",
                file: "Icon:"
            },
            files_filter: "pictures"
        }
        desktop.showPopupApp("list_editor");
    },


    onTabsListChanged: function(list) {
        var p = this.profile;
        p.tabs = [];
        p.icons = [];
        for(var i=0; i<list.length; i++) {
            p.tabs[i] = list[i].title;
            p.icons[i] = list[i].file;
        }
    },




    updateAppsPositions: function(oldCount, newCount) {
        var alist = this.getApps(oldCount);

        for(var i=0; i<alist.length; i++) {
            desktop.layout.getApp(alist[i].wid).setParent(desktop.$["tmp_hidden"]);
        }
        this.refreshTabs();

        for(var i=0; i<alist.length; i++) {
            var app = desktop.layout.getApp(alist[i].wid);
            if(alist[i].pos < newCount) {
                app.setParent(this.getCell(alist[i].pos));
            } else {
                app.close();
            }
        }
    },


    getApps: function(cellsCount) {
        var res = [];
        var c = !isNaN(cellsCount) ? cellsCount : this.profile["tabs"].length;
        for(var i=0; i<c; i++) {
            var el = this.getCell(i);
            for(var j=0; j<el.childNodes.length; j++) {
                var wid = parseInt(el.childNodes[j].wid);
                if(wid) {
                    var app = desktop.layout.getApp(wid);
                    res.push({ 
                        wid: wid, 
                        name: app.appName, 
                        pos: i, 
                        owner: this.id 
                    });
                }
            }
        }
        return res;
    },


    onClose: function() {
        var apps = this.getApps();
        for(var i=0; i<apps.length; i++) {
            var app = desktop.layout.getApp(apps[i].wid);
            app.close();
        }
    }


});