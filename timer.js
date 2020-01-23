/**
 * #class timer
 *
 * @param {string} option.containerId : used in  which element
 * @param {number} option.mode :  0: 00:00:00 1: 23:59:59 2: now time
 * return time array (hh mm ss)
 * 
 * WING 20200122
 * */

function RSTimer(option) {
    var _option = {
        containerId: "#",
        mode: 0
    };

    $.extend(true, _option, option);
    
    var initTimeStr     = (_option.mode == 0 ? "00:00:00" : (_option.mode == 1 ? "23:59:59" : (new Date()).toLocaleTimeString())),
        timeArr         = initTimeStr.split(":"),
        curentVal       = 0,
        curentInputObj  = {};
        target          = this;

    init();
    bindEvents();//when it's loaded

    //outside API
    this.getTimerVal = function () {
        return timeArr;
    };

    function setTime() {
        timeArr[0] = $(_option.containerId).find(".t-input[data-type='hour']").val() + '';
        timeArr[1] = $(_option.containerId).find(".t-input[data-type='minute']").val() + '';
        timeArr[2] = $(_option.containerId).find(".t-input[data-type='second']").val() + '';
    }

    function changeValue (operation) {
        var changeNum   = eval(curentVal + operation + 1) + "",
            numStr      = formatNumberWithZero((changeNum < 0 ? 0 : changeNum)),
            type        = curentInputObj.attr("data-type");

        if ( type == "hour" )           curentInputObj.val(numStr > 23 ? 23 : numStr);
        else if ( type == "minute" )    curentInputObj.val(numStr > 59 ? 59 : numStr);
        else if ( type == "second" )    curentInputObj.val(numStr > 59 ? 59 : numStr);
        setTime();
    }

    function formatNumberWithZero(num) {
        num = num * 1;
        return (num < 10 ? ("0" + num) : num);
    }

    function init() {
        var _html = '<div id="timerContainer">' +
                        '<div class="timer-item  t-branch">' +
                            '<input type="text" value="23" data-type="hour" class="t-input">' +
                        '</div>' +
                        '<div class="timer-item t-branch">' +
                            '<input type="text" value="59" data-type="minute" class="t-input">' +
                        '</div>' +
                        '<div class="timer-item">' +
                            '<input type="text" value="59" data-type="second" class="t-input">' +
                        '</div>' +
                    '</div>';

        $(_option.containerId).empty().append(_html);

        $(_option.containerId).find(".t-input[data-type='hour']").val(timeArr[0]);
        $(_option.containerId).find(".t-input[data-type='minute']").val(timeArr[1]);
        $(_option.containerId).find(".t-input[data-type='second']").val(timeArr[2]);
    }

    function bindEvents() {
        $(_option.containerId).on("focus", ".t-input", function () {
            curentInputObj = $(this);

            $(this).attr("name", "active");
        }).on("blur", ".t-input", function () {
            $(this).attr("name", "");

            if ( $(this).val() == "" )  $(this).val("00");
            else                        $(this).val(formatNumberWithZero($(this).val()));
        }).on("keyup", ".t-input", function (e) {
            var _event      = window.event || e,
                _type       = $(this).attr("data-type"),
                _value      = $(this).val() + "",
                _formatVal  = _value.replace(/\D/g, ''),
                _keyCode    = _event.keyCode;

            if ( _keyCode == 37 ) {//<-
                ($(this).parent().prev()).find(".t-input").focus();
                return;
            } else if ( _keyCode == 39 ) {//->
                ($(this).parent().next()).find(".t-input").focus();
                return;
            } else if ( _keyCode == 38 || _keyCode == 40 ) {// + -
                return;
            }
            
            if ( _type == "hour" )           $(this).val(_formatVal > 23 ? 23 : _formatVal);
            else if ( _type == "minute" )    $(this).val(_formatVal > 59 ? 59 : _formatVal);
            else if ( _type == "second" )    $(this).val(_formatVal > 59 ? 59 : _formatVal);
            setTime();

        }).on("keydown", ".t-input", function (e) {
            var _event          = window.event || e,
                _value          = $(this).val() + "",
                _keyCode        = _event.keyCode;
                curentInputObj  = $(this);
            
            if ( _keyCode == 38 ) {//+
                curentVal = parseInt(_value);
                
                changeValue("+");
                return;
            } else if ( _keyCode == 40 ) {//-
                curentVal = parseInt(_value);

                changeValue("-");
                return;
            }

        }).on("mousewheel", ".t-input", function (e) {
            var _event      = window.event || e,
                _type       = $(this).attr("data-type"),
                _delta      = _event.deltaY,
                numStr      = "";
                curentVal   = parseInt($(this).val())

            if ( _delta > 0 )       curentVal -= 1;
            else if ( _delta < 0 )  curentVal++;

            numStr = formatNumberWithZero((curentVal < 0 ? 0 : curentVal));

            if ( _type == "hour" )           $(this).val(numStr >= 23 ? 23 : numStr);
            else if ( _type == "minute" )    $(this).val(numStr >= 59 ? 59 : numStr);
            else if ( _type == "second" )    $(this).val(numStr >= 59 ? 59 : numStr);
            setTime();
        });

    }
}