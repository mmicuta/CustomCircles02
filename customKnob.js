
$(function() {

    $(".knob").knob({
        /*change : function (value) {
            //console.log("change : " + value);
        },
        release : function (value) {
            console.log("release : " + value);
        },
        cancel : function () {
            console.log("cancel : " + this.value);
        },*/

        draw : function () {
        },

        min : 1, 
        max : 20,
        stopper : false,
        width : $(".knobcontainer").width(),
        height : $(".knobcontainer").width(),
        step : 1,
        bgColor : "white",
        fgColor : "black",
        thickness : 0.2,
        value : 15

    });
});
