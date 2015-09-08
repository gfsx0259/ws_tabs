core.apps.auto_gallery.extendPrototype({


    buildContent: function(el) {
        this.buildModel(this.$["content"], 
            { tag: "div", 
              className: "image_gallery", 
              id: "image_gallery",
              childs:[
                { tag: "table", id: 'table',
                  childs: [
                    { tag: "tbody", id: "table_body" }
                  ]}
              ]}
        );
    },



    renderGallery: function() {
        core.browser.element.removeChilds(this.$["table_body"]);
        if(this.images.length == 0) return;


        var cols_count = parseInt(this.profile["cols"], 10);
        cols_count = Math.min(cols_count, this.images.length);
        var col_width = Math.floor(100 / cols_count) + "%";
        var img_height = this.profile["image_height"] + "px";

        var mtable = [], mrow = false;
        for(var i=0; i<this.images.length; i++) {
            if(i % cols_count == 0) {
                if(mrow) {
                    mtable.push(
                        { tag: "tr", 
                          className: "row", 
                          childs: mrow }
                    );
                }
                mrow = [];
            }
            mrow.push(
                { tag: "td",
                  style: { width: col_width },
                  childs: [
                    { tag: "div", className: "cell_div",
                      childs: [
                        { tag: "div", className: "img_box",
                          childs: [
                            { tag: "div", className: "t",
                              innerHTML: "<div class='tr'><div class='tc'></div></div>" },
                            { tag: "div", className: "m",
                              childs: [
                                { tag: "div", className: "mr",
                                  childs: [
                                    { tag: "div", className: "mc",
                                      childs: [
                                        { tag: "img", 
                                          events: { onclick:["showImage", i] },
                                          src: core.common.getUserFile(this.images[i]),
                                          style: {
                                            height: img_height,
                                            width: "auto",
                                            cursor: (this.profile["popup"] ? "pointer" : "default")
                                          }}
                                      ]}
                                  ]}
                              ]},
                            { tag: "div", className: "b",
                              innerHTML: "<div class='br'><div class='bc'></div></div>" }
                          ]}
                      ]}
                  ]}
            );
        }
        if(mrow.length) {
            mtable.push(mrow);
        }
        this.buildModel(this.$["table_body"], mtable);
    },


    
    showImage: function(e, image_idx) {
        if(!this.profile["popup"]) return;
        desktop.openImageBox(this.images, image_idx);
    }


});