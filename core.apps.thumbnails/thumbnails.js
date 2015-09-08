core.apps.thumbnails = function(args) {

    this.defaultProfile = {
        title: "",
        new_page: 1,
        items: [],
        enable_scrolling: 1,
        use_featured_list: 0,
        speed: 5,
        enable_auto_scroll:0,
        stop_hover:0

    }

    this.k = 100;//softness
    this.timer;//for animation
    this.timer_active = false;
    this.is_featured_list = {};
    this.autoTimer;
}


core.apps.thumbnails.prototype = {


    buildContent: function(el) {
        this.displayTpl(el, "thumbnails");
    },

    getFeaturedList:function(){

        if(this.is_featured_list.length>0){
            this.refresh(true);
            return false;
        }

        var data = {};
        data.dialog = "ecommerce";
        data.act = "products_get_featured_list";
        core.transport.send("/controller.php", data, this.onRpGetFeaturedList.bind(this), "POST");
        return false;
    },

    onOpen: function() {
        this.setTitle(this.profile["title"]);
        if(this.profile["use_featured_list"] == 1){
         this.getFeaturedList();
        }else{
            this.refresh();
        }

    },

    onRpGetFeaturedList: function(r){
        this.is_featured_list = r.data;
        this.refresh(true);
    },



    refresh: function(is_featured) {
        var is_admin = core.usertype >= USERTYPE_ADMIN;
        var target = this.profile["new_page"] == 1 ? " target='_blank'" : "";
        var html = "";

        if(is_featured){
            this.items = this.is_featured_list;

        }else{
            this.items = this.getItems();
        }

        for(var i=0; i<this.items.length; i++) {
            var m = this.items[i];
            var url = m.url;
            if(url == "" || url == "http://") {
                url = "javascript:void(0)";
                target = "";
            }

            if(is_featured && m.id){
                url = '/products/'+ m.alias+'.html';
            }
            html +=
                "<a  id='"+ m.id+"' class='thumb' href='" + url + "' " + target + ">" +
                "<div class='border'>" +
                "<i style='display:none' onclick='core.apps.thumbnails.prototype.onFeatureProductDelete(event);return false;' class='clear_site_title_btn "+ (is_featured && is_admin ? "featured_list" : '')+"'></i>"+
                "<div class='pic' style='"+ (is_featured && is_admin ? "position:absolute;" : '')+"background: url(\"" + core.common.getUserFile(m.pic) + "\") 50% 50% no-repeat'></div>" +
                "</div>" +
                "<div class='title'>" + m.title + "</div>" +
                "</a>";
        }

        var el = this.$["scroller_body"];
        el.style.left = -200+".px";//init left offset

        el.innerHTML = html;

        this.ofs = 0;
        this.step = html != "" ? el.childNodes[0].offsetWidth : 0;
        el.style.width = (this.step * (i+1)) + "px";//init width

        this.showElements(["btn_roll_left", "btn_roll_right"]);
        if(this.profile["enable_auto_scroll"]){
            this.setActive();
        }
    },

    setActive:function(){


       this.autoTimer = setTimeout(this.onRollRightClick.bind(this), 1000 * this.profile["speed"]);
    },

    onFeatureProductDelete:function(event){
        var thumb = this.getParentByClassName(event.target, 'thumb');
        var id = thumb.id;
        var data = {};
        data.dialog = "ecommerce";
        data.act = "delete_product_from_featured_list";
        data.id= id;
        core.transport.send("/controller.php", data, this.onRpDeleteFromFeaturedList.bind(this,thumb), "POST");
    },

    onRpDeleteFromFeaturedList:function(thumb){
        thumb.remove();
    },

    getParentByClassName:function (el,className){
        if(el.className === className){
            return el;
        }else{
            return this.getParentByClassName(el.parentNode,className);
        }
    },
        getItems: function() {
            return this.profile["items"];
    },

    putLeft:function(){
        var actualChildNodes = this.$["scroller_body"].childNodes;
        var last = actualChildNodes[actualChildNodes.length-1].cloneNode(true);
        this.$["scroller_body"].insertBefore(last,actualChildNodes[0]);
        this.deleteLeft();
    },


    deleteLeft:function(){//delete from right side after completion of animation
        var actualChildNodes = this.$["scroller_body"].childNodes;
        actualChildNodes[actualChildNodes.length-1].remove();
        this.$["scroller_body"].style.left = -this.step+"px";
    },

    putRight:function(){
        var actualChildNodes = this.$["scroller_body"].childNodes;
        var first = actualChildNodes[0].cloneNode(true);
        this.$["scroller_body"].appendChild(first);
    },

    deleteRight:function(){//remove from left side before completion of animation
        var actualChildNodes = this.$["scroller_body"].childNodes;
        actualChildNodes[0].remove();
        this.$["scroller_body"].style.left = -this.step+"px";
    },


    onRollLeftClick: function() {
        if(this.timer_active){
            return false;//stop if timer active
        }
        this.animate(this.$["scroller_body"],this.step,1000*this.profile["speed"],0,this.putLeft);//move to left and insert new to left in callback and remove last from right (with saving position offset)
        if(this.profile["enable_auto_scroll"]){
            this.setActive();
        }
    },


    onRollRightClick: function() {//insert new to right and move to right and remove from left (with saving position offset)
        if(this.profile["enable_auto_scroll"]){
            clearTimeout((this.autoTimer));
            this.setActive();
        }

       if(this.timer_active){
           return false;//stop if timer active
       }

        this.putRight();
        this.animate(this.$["scroller_body"],-this.step,1000*this.profile["speed"],0,this.deleteRight);//Р·Р°С‚РµРј РґРІРёРіР°РµРј, РїРѕСЃР»Рµ СѓРґР°Р»СЏРµРј РїРµСЂРІС‹Р№ СЌР»РµРјРµРЅС‚


    },


        animate:function(el,offset,duration,already,callback,environ){

        var obj = environ ? environ : this;
        var el = obj.$["scroller_body"]

        already = already || 0;
        var actualOffset = offset/this.k;
        var actualDuration = duration/this.k;
        var elementOffset = parseFloat(el.style.left);

        el.style.left = (elementOffset+actualOffset)+"px";

        already+=actualOffset;

        clearTimeout(this.timer);
            this.timer_active = false;

        if(parseFloat(Math.abs(already))<=parseFloat(Math.abs(offset)) && typeof(already)!='undefined'){
            this.timer_active = true;
            this.timer = setTimeout(function(){obj.animate(el,offset,duration,already,callback,obj)},actualDuration);
        }else{
            if (callback && typeof(callback) === "function") {
                callback.call(obj);
            }
        }

    },


    OnWheel:function(e){
        if(!this.profile["enable_scrolling"]){
            return false;
        }

        var delta = e.deltaY || e.detail || e.wheelDelta;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        var direct = delta / Math.abs(delta);

            if(direct==1){
                this.onRollRightClick();
            }else{
                this.onRollLeftClick();
            }
    },

    onMouseOver: function(){
        if( this.profile["stop_hover"]){
            clearTimeout(this.autoTimer);
        }

    },

    onMouseOut:function(){
        if( this.profile["stop_hover"]){
            this.setActive();
        }
    }

}
core.apps.thumbnails.extendPrototype(core.components.html_component);
core.apps.thumbnails.extendPrototype(core.components.desktop_app);