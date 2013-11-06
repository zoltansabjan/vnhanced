// ==UserScript==
// @name         vNhanced
// @namespace    https://github.com/zoltansabjan
// @run-at document-end
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version      1.0.7.3
// @downloadURL  http://userscripts.org/scripts/source/163618.user.js
// @updateURL    http://userscripts.org/scripts/source/163618.meta.js
// @description  Changing the look and some of the functions of the browser game Virtual Nations
// @include      http://www.vnations.net/*
// @exclude      http://www.vnations.net/chat.php*
// @copyright    2013+, Zoltan Sabjan
// ==/UserScript==

// *********************************************************************************** deprecated styling

// recent topics style
GM_addStyle('.well {margin-bottom: 7px !important;}'); // change topics distance
GM_addStyle('p {margin: 0 0 0px !important;}'); // change topics internal margin
GM_addStyle('.well-small {padding: 5px !important;}'); // change topics padding
GM_addStyle('.well-small {border-radius: 2px !important;}'); // change topics border radius
GM_addStyle('.well {background-image: url(http://vnhub.net/vnhanced/images/maintoolbg.jpg) !important;}'); // change topics background

// *********************************************************************************** jquery functions

// alert($); // check if the dollar (jquery) function works
// alert($().jquery); // checks jquery version

// declare global variables
var $navbar_brand = $('.brand'); // assign top navbar brand

$(document).ready(function () {
    
    // declare variables
    var $move_citizen_select = $('#shownat'); // assign move citizen select dropdown
    var $nation_select = $('#flagselect'); // assign nation select dropdown
    var $navbar = $('.navbar.navbar-fixed-top'); // assign top navbar
	var $navbar_inner = $('.navbar.navbar-fixed-top .navbar-inner'); // assign top navbar inner
    var $navbar_fluid = $('.navbar.navbar-fixed-top .navbar-inner .container-fluid'); // assign top navbar fluid
    var $navbar_usermenu = $('#nav user_menu pull-right'); // assign top navbar user menu
    var $script_version = GM_info.script.version; // assign script version
    var $citizen_stats; // for each citizen stat on the page return it's inner text and build an array for them
    $citizen_stats = $('.act-success').map(function () {
        return $(this).text();
    }).get();
    var $cit_health = Math.round($citizen_stats[0]);
    var $cit_happiness = Math.round($citizen_stats[1]);
    var $cit_wounds = $citizen_stats[2];
    var $cit_prestige = $citizen_stats[3];
    var $cit_currency = $citizen_stats[4].replace('$', '');
    var $cit_currency_name = $('th img[src*="flags"]').parent().text();
    var $cit_vbux = $citizen_stats[5].replace('$', '');
    var $cit_iq = $citizen_stats[6];
    var $cit_xp = $citizen_stats[7];
    var $cit_level = $("th:contains('Level')").text().replace(/^\D+/g, '');
    var $cit_name = $.trim($(".dropdown-toggle:last").text());
    var $wounds_icon = "http://vnhub.net/vnhanced/images/iconwounds.png";
    var $gnl_holder = $(".span7:first"); // gnl holder
    var $gnl_box = $gnl_holder.children(".w-box"); // gnl box
    var $gnl_header = $gnl_box.children(".w-box-header"); // gnl header
    var $gnl_content = $gnl_box.children(".w-box-content.cnt_a"); // gnl content
    var $citizenbox_holder = $(".span5:first"); // citizenbox holder
    var $citizenbox_box = $citizenbox_holder.children(".w-box"); // citizenbox box
    var $citizenbox_header = $citizenbox_box.children(".w-box-header"); // citizenbox header
    var $citizenbox_content = $citizenbox_box.children(".w-box-content"); // citizenbox content
    var $avatar_url = $('img[src*="citizen"]').attr("src"); // citizen avatar url
    var $event_holder = $(".span12:contains('Zombie')"); // event holder
    var $event_box = $event_holder.children(".w-box"); // event box
    var $event_header = $event_box.children(".w-box-header"); // event header
    var $event_content = $event_box.children(".w-box-content"); // event content

    freeze_gifs(); // freeze all gif images
    navbar($navbar, $navbar_inner, $navbar_fluid, $script_version); // ****************************** navbar styling
    event($event_holder, $event_box, $event_header, $event_content); // ****************************** event styling

    // load settings
    var $pocket, $details;
    $pocket = $.cookie("pocket");
    $details = $.cookie("details");
    if ($pocket != 'true'){
        $pocket = 'false';
    }
        if ($details != 'true'){
        $details = 'false';
    }

    // declare variables



    // load API
    var $cit_military_rank, $cit_military_rank_icon, $cit_citizenship, $country_shortname, $flag_url;
    $.ajax({
        type: "GET",
        url: "http://rss.vnations.net/citizen/name/" + $cit_name + "/xml",
        cache: false,
        dataType: "xml",
        success: function (xml) {
            $cit_military_rank = $(xml).find('milrank').text().replace(/\D/g, '');
            $cit_military_rank_icon = "/images/military/rank_" + $cit_military_rank + ".png";
            $citizenbox_box.after("<div id='citizenbox_military_rank' style='left: 155px; top: -27px; position: relative; width: 50px; height: 50px; z-index: 20;'><img src='" + $cit_military_rank_icon + "' width='50px' height='50px'></div>"); // create military rank div
            $cit_citizenship = $.trim($(xml).find('citizenship').text());
			$country_shortname = countryshortname($cit_citizenship);
			$flag_url = "http://flagpedia.net/data/flags/normal/" + $country_shortname + ".png";
        }
    });

    // layout setup
    $($gnl_holder).insertAfter($citizenbox_holder); // changing the order of the events and citizen stats boxes 

    // global news live
    $gnl_holder.css({
        "width": "auto",
        "height": "173px",
        "overflow": "hidden",
        "float": "none",
        "border": "1px solid #ddd",
        "margin": "0px"
    }); // set holder attributes
    $gnl_box.css({
        "height": "173px",
        "font-size": "11px"
    }); // set box attributes
    $gnl_content.css({
        "z-index": "3",
        "padding": "0px 0px 0px 2px",
        "overflow-x": "hidden",
        "height": "146px",
        "background-image": "url(http://vnhub.net/vnhanced/images/maintoolbg.jpg)",
        "border": "none"
    }); // set content attributes
    $gnl_header.css({
        "padding": "0px 0px 0px 0px",
        "position": "relative",
        "z-index": "1",
        "height": "25px",
        "line-height": "25px",
        "background-image": "url(http://img339.imageshack.us/img339/8044/gnlmenuheaderbg.jpg)",
        "border-bottom": "none",
        "border": "none"
    }); // set header header attributes
    $gnl_header.text(""); // remove text from header
    $gnl_header.html("<img style='float:left' src='http://img198.imageshack.us/img198/7518/gnlmenuheaderleft.jpg' alt='' width='99' height='25'>");

    $gnl_box.after("<div id='gnl_header_title' style='z-index: 5; width: 143px; height: 25px; line-height: 25px; position: relative; left: 10px; top: -198px; color: #FFFFFF; opacity: 0.5;'>Global News L!ve</div>"); // create div for header title
    $gnl_box.after("<div id='gnl_header_title_shadow' style='z-index: 4; width: 143px; height: 25px; line-height: 25px; position: relative; left: 9px; top: -174px;'>Global News L!ve</div>"); // create div for header title shadow
    $gnl_header.after("<div id='gnl_menu' style='z-index: 2; background-image: url(http://img7.imageshack.us/img7/9105/gnlmenubg.jpg); width: 99px; height: 147px; float: left;'></div>"); // create div for menu

    // citizen info box
    $citizenbox_content.after("<div id='citizenbox_stats_wrapper' style='float: right; width: 44px; height: 146px;'></div>"); // create stats wrapper div
    $citizenbox_content.after("<div id='citizenbox_avatar_holder' style='width: 143px; float: right; height: 140px;padding: 3px 3px 3px 3px;'><img src=" + $avatar_url + " alt='avatar' width='140' height='140'></div>"); // create div for avatar
    $("#citizenbox_stats_wrapper").append("<div id='citizenbox_stats_container1' style='float: right; width: 44px; height: 146px;'></div>"); // create stats container 1
    $("#citizenbox_stats_wrapper").append("<div id='citizenbox_stats_container2' style='float: right; height: 140px; margin: 3px;'></div>"); // create stats container 2
    $("#citizenbox_stats_container1").append("<div id='health_holder' style='height: 44px; width: 44px; margin: 5px 0px 2px 0px;'><input type='text' value=" + $cit_health + " class='health_pb'></div>"); // create div for health
    $("#health_holder").append("<div id='icon_health' style='position: relative; top: -34px; left: 12px; width: 20px; height: 18px; background-image: url(http://vnhub.net/vnhanced/images/iconhealth.png);'></div>"); // icon for health
    $("#health_holder").append("<div id='text_health' style='position: relative; top: -36px; font-size: 10px; text-align: center; color: #FFFFFF;'>" + $cit_health + "</div>"); // textual for health
    $(".health_pb").knob({
        'min': 0,
        'max': 100,
        'width': 44,
        'height': 44,
        'readOnly': true,
        'angleOffset': 90,
        'displayInput': false,
        'fgColor': '#74B2E8',
        'bgColor': '#E2E4E5',
        'thickness': '.43'
    }); // progress-bar for health
    $("#citizenbox_stats_container1").append("<div id='happiness_holder' style='height: 44px; width: 44px; margin: 2px 0px 2px 0px;'><input type='text' value=" + $cit_happiness + " class='happiness_pb'></div>"); // create div for happiness
    $("#happiness_holder").append("<div id='icon_happiness' style='position: relative; top: -36px; left: 12px; width: 20px; height: 20px; background-image: url(http://vnhub.net/vnhanced/images/iconhappiness.png);'></div>"); // icon for happiness
    $("#happiness_holder").append("<div id='text_happiness' style='position: relative; top: -38px; font-size: 10px; text-align: center; color: #FFFFFF;'>" + $cit_happiness + "</div>"); // textual for happiness
    $(".happiness_pb").knob({
        'min': 0,
        'max': 100,
        'width': 44,
        'height': 44,
        'readOnly': true,
        'angleOffset': 90,
        'displayInput': false,
        'fgColor': '#74B2E8',
        'bgColor': '#E2E4E5',
        'thickness': '.43'
    }); // progress-bar for happiness
    $("#citizenbox_stats_container1").append("<div id='wounds_holder' style='height: 44px; width: 44px; margin: 2px 0px 5px 0px;'><input type='text' value=" + $cit_wounds + " class='wounds_pb'></div>"); // create div for wounds
    if ($cit_wounds == 0.00) {
        $wounds_icon = "http://vnhub.net/vnhanced/images/iconwoundsinactive.png";
    } // icon inactive if there is no wounds
    $("#wounds_holder").append("<div id='icon_wounds' style='position: relative; top: -37px; left: 10px; width: 24px; height: 21px; background-image: url(" + $wounds_icon + ");'></div>"); // icon for wounds
    $(".wounds_pb").knob({
        'min': 0,
        'max': 100,
        'width': 44,
        'height': 44,
        'readOnly': true,
        'angleOffset': 90,
        'displayInput': false,
        'fgColor': '#E87474',
        'bgColor': '#E5E2E2',
        'thickness': '.43'
    }); // progress-bar for wounds
    $citizenbox_holder.css({
        "width": "199px",
        "height": "173px",
        "margin-left": "40px",
        "float": "right",
        "border": "1px solid #ddd"
    }); // set holder attributes
    $citizenbox_box.css({
        "width": "100%",
        "height": "100%",
        "background-image": "url(http://vnhub.net/vnhanced/images/98501186.png)",
        "z-index": "10",
        "position": "relative"
    }); // set box attributes
    $citizenbox_content.remove(); // remove old content
    $citizenbox_header.removeAttr("style"); // remove header style
    $citizenbox_header.css({
        "z-index": "1",
        "height": "25px",
        "background-image": "url(http://img339.imageshack.us/img339/8044/gnlmenuheaderbg.jpg)",
        "border": "none"
    }); // set header attributes
    $citizenbox_header.text(""); // remove text from header
    $citizenbox_header.append("<div id='citizenbox_header_name_shadow' style='position: relative; top: -1px; left: -1px; height: 25px; line-height: 25px; font-size: 12px; color: #000000; font-weight: 400;'>" + $cit_name + "</div>"); // created div for name shadow
    $citizenbox_header.append("<div id='citizenbox_header_name' style='position: relative;top: -25px; height: 25px; line-height: 25px; font-size: 12px; color: #FFFFFF; opacity: 0.5; font-weight: 400;'>" + $cit_name + "</div>"); // created div for name

    $citizenbox_holder.append("<div id='citizenbox_details_wrapper' style='z-index: 4; left: -19px; top: -196px; position: relative; width: 126px; height: 102px; font-size: 10px; line-height: 20px; color: rgb(31, 31, 31);'></div>"); // create details wrapper div
    $("#citizenbox_details_wrapper").append("<div id='citizenbox_details_wrapper_button' style='z-index: 4; position: relative; top: 56px;'><img src='http://vnhub.net/vnhanced/images/sliderdetails.png' alt='details button' width='19' height='45'></div>"); // create details wrapper button div
    
    $citizenbox_holder.append("<div id='citizenbox_money_wrapper' style='z-index: 3; left: -19px; top: -196px; position: relative; width: 127px; height: 45px; font-size: 10px; line-height: 20px; color: rgb(31, 31, 31);'></div>"); // create money wrapper div
    $citizenbox_holder.append("<div id='citizenbox_money_wrapper_shadow' style='display: none; z-index: 10; left: -4px; top: -241px; position: relative; width: 4px; height: 45px; opacity: 0.4;background-image: url(http://vnhub.net/vnhanced/images/pocket1shadow.png);'></div>"); // create money wrapper shadow div
    $("#citizenbox_money_wrapper").append("<div id='citizenbox_money_wrapper_button' style='position: relative; width: 19px; height: 45px; float: left;'><img src='http://vnhub.net/vnhanced/images/slidermoney.png' alt='pocket button' width='19' height='45'></div>"); // create money wrapper button div
    $("#citizenbox_money_wrapper").append("<div id='citizenbox_money_content_wrapper' style='border-top: 1px solid rgb(221, 221, 221); border-bottom: 1px solid rgb(221, 221, 221); position: relative; height: 43px; background-image: url(http://vnhub.net/vnhanced/images/46374461.png); float: left;'></div>"); // create content wrapper div
    $("#citizenbox_money_content_wrapper").append("<div id='citizenbox_money_currency' style='text-align: right; position:relative; width: 105px; height: 20px; background-image: url(http://img210.imageshack.us/img210/9181/75243682.png); background-repeat: no-repeat; padding-bottom: 1px; margin-left: 3px; margin-top: 1px; line-height:  20px;'>" + $cit_currency + $cit_currency_name + "</div>"); // create currency div
    $("#citizenbox_money_content_wrapper").append("<div id='citizenbox_money_vbux' style='text-align: right; position:relative; width: 105px; height: 20px; background-image: url(http://vnhub.net/vnhanced/images/aaamdf.png); background-repeat: no-repeat; padding-top: 1px; margin-left: 3px; line-height:  20px;'>" + $cit_vbux + " vBux</div>"); // create currency div
	// $citizenbox_box.append("<div id='citizenbox_mesh' style='background-image: url(http://vnhub.net/vnhanced/images/transparentgridmesh.png); width: 197px; height: 146px;'></div>"); // create div for mesh
    
    if($pocket == 'true'){
        open_pocket();
    }
        if($details == 'true'){
        open_details();
    }
    
    function open_pocket(){
        	$("#citizenbox_money_wrapper").stop().animate({'left': '-128px'}, 75);
            $citizenbox_holder.stop().animate({'marginLeft': '149px'}, 75);
            $("#citizenbox_money_wrapper_shadow").show();
        	$pocket = 'true';
        	$.cookie("pocket", "true", { expires: 365, path: '/' });
    }
    
    function close_pocket(){
            $("#citizenbox_money_wrapper").stop().animate({'left': '-19px'}, 50, function() {$("#citizenbox_money_wrapper_shadow").hide();});
            $citizenbox_holder.stop().animate({'marginLeft': '40px'}, 50);
        	$pocket = 'false';
            $.cookie("pocket", "false", { expires: 365, path: '/' });
    }
    
    function open_details(){
        	$("#citizenbox_details_wrapper").stop().animate({'left': '-128px'}, 75);
            $gnl_holder.stop().animate({'width': '-=109px'}, 75);
            $("#citizenbox_money_wrapper_shadow").show();
        	$details = 'true';
        	$.cookie("details", "true", { expires: 365, path: '/' });
    }
    
    function close_details(){
            $("#citizenbox_details_wrapper").stop().animate({'left': '-19px'}, 50, function() {$("#citizenbox_money_wrapper_shadow").hide();});
            $gnl_holder.stop().animate({'width': '+=109px'}, 50);
        	$details = 'false';
            $.cookie("details", "false", { expires: 365, path: '/' });
    }

    $("#citizenbox_details_wrapper").click(function() {
        if ($details == 'false'){
            //open_details();
            }
        else if ($details == 'true'){
            //close_details();
        }
	});

    $("#citizenbox_money_wrapper").click(function() {
        if ($pocket == 'false'){
            open_pocket();
            }
        else if ($pocket == 'true'){
            close_pocket();
        }
	});
    
    // daily tasks
    if ($('.dshb_icoNav.tac.nav')[0]) {
        $(".span7:first").children(".w-box").css({
            "background-image": "url(http://img543.imageshack.us/img543/3819/maintoolbg.jpg)"
        }); // set background
        $('.dshb_icoNav.tac.nav').removeAttr("style"); // remove style
        $('.dshb_icoNav.tac.nav').css({
            "padding-top": "9px"
        }); // set attributes
        $gnl_holder.css({
            "height": "119px"
        });
        $("#gnl_header_icons").remove(); // remove extra div
        $("#gnl_header_title").text("Daily Tasks"); // remove extra div
        $("#gnl_header_title_shadow").text("Daily Tasks"); // remove extra div
        $("#gnl_content").remove(); // remove extra div
        $("#gnl_menu").remove(); // remove extra div
        $(".w-box-content").css({
            "border": "none"
        });
    }
});

function freeze_gifs(){
    [].slice.apply(document.images).filter(is_gif_image).map(freeze_gif);
}

function is_gif_image(i) {
    return /^(?!data:).*\.gif/i.test(i.src);
}

function freeze_gif(i) {
  var c = document.createElement('canvas');
  var w = c.width = i.width;
  var h = c.height = i.height;
  c.getContext('2d').drawImage(i, 0, 0, w, h);
  try {
    i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
  } catch(e) { // cross-domain -- mimic original with all its tag attributes
    for (var j = 0, a; a = i.attributes[j]; j++)
      c.setAttribute(a.name, a.value);
    i.parentNode.replaceChild(c, i);
  }
}

function navbar($navbar, $navbar_inner, $navbar_fluid, $script_version) {

    $navbar.css({
        "height": "40px",
        "line-height": "40px"
    });
    $navbar_inner.css({
        "height": "40px",
        "line-height": "40px"
    });
    $navbar_fluid.css({
        "height": "40px",
        "line-height": "40px"
    });
    $navbar_brand.remove(); // remove original brand
	$navbar_fluid.prepend('<a class="brand" style="left: -140px; top: 30px; font-size: 9px; height: 9px; line-height: 9px; padding: 0px; margin: 0px; width: auto; z-index: 2; position: relative; color: rgb(255, 255, 255); opacity: 0.5;">vNhanced v' + $script_version + '</a>'); // add script version
    $navbar_fluid.prepend('<a class="brand" href="/dashboard.php" style="top: 9px; font-size: 20px; height: 20px; line-height: 20px; padding: 0px; margin: 0px; width: auto; z-index: 2; position: relative; text-shadow: -1px -1px 0px rgb(0, 0, 0); color: rgb(255, 255, 255); opacity: 0.5; z-index: 3;">Virtual Nations</a>'); // add new brand
	$navbar_brand = $('.brand'); // re-assign top navbar brand
	$navbar_brand.hover(function() {
    $(this).stop().fadeTo(100, 0.8);
    $(this).css('cursor','pointer');
  	}, function() {
    	$(this).stop().fadeTo(200, 0.5);
        $(this).css('cursor','default');
  	});
}

function event($event_holder, $event_box, $event_header, $event_content){
    $event_holder.css({
        "width": "auto",
        "height": "173px",
        "overflow": "hidden",
        "float": "none",
        "border": "1px solid #ddd",
        "margin": "0px"
    });
    $event_box.css({
        "height": "173px",
        "font-size": "11px",
        "border": "none"
    }); // set box attributes
    $event_content.css({
        "z-index": "3",
        "padding": "0px 0px 0px 2px",
        "overflow-x": "hidden",
        "height": "146px",
        "background-image": "url(http://vnhub.net/vnhanced/images/maintoolbg.jpg)",
        "border": "none"
    }); // set content attributes
    $event_header.css({
        "padding": "0px 0px 0px 0px",
        "position": "relative",
        "z-index": "1",
        "height": "25px",
        "line-height": "25px",
        "background-image": "url(http://img339.imageshack.us/img339/8044/gnlmenuheaderbg.jpg)",
        "border": "none"
    }); // set header header attributes
}

function countryshortname($countryname) {
    var $shortname;
    switch ($countryname) {
        case "Alien Invaders":
            $shortname = "alien";
            break;
        case "Argentina":
            $shortname = "ar";
            break;
        case "AUSTR Empire":
            $shortname = "ru";
            break;
        case "Australia":
            $shortname = "au";
            break;
        case "Bolivia":
            $shortname = "bo";
            break;
        case "Brazil":
            $shortname = "br";
            break;
        case "Bulgaria":
            $shortname = "bg";
            break;
        case "Croatia":
            $shortname = "hr";
            break;
        case "Czechoslovakia":
            $shortname = "cz";
            break;
        case "Germany":
            $shortname = "de";
            break;
        case "Greater Malaysia":
            $shortname = "my";
            break;
        case "Hellas":
            $shortname = "gr";
            break;
        case "Hungary":
            $shortname = "hu";
            break;
        case "India":
            $shortname = "in";
            break;
        case "Indonesia":
            $shortname = "id";
            break;
        case "Ireland":
            $shortname = "ie";
            break;
        case "Israel":
            $shortname = "il";
            break;
        case "Italia":
            $shortname = "it";
            break;
        case "Japan":
            $shortname = "jp";
            break;
        case "Knezevia Slovenija":
            $shortname = "si";
            break;
        case "Latvia":
            $shortname = "lv";
            break;
        case "Poland":
            $shortname = "pl";
            break;
        case "Portugal":
            $shortname = "pt";
            break;
        case "Romania":
            $shortname = "ro";
            break;
        case "Serbia":
            $shortname = "rs";
            break;
        case "Spain":
            $shortname = "es";
            break;
        case "Turkey":
            $shortname = "tr";
            break;
        case "United Kingdom":
            $shortname = "gb";
            break;
        case "USA":
            $shortname = "us";
            break;
        default:
            $shortname = "alien";
    }
    return $shortname;
}

// *********************************************************************************** 3rd party functions

/*!jQuery Knob*/
/**
 * Downward compatible, touchable dial
 *
 * Version: 1.2.0 (15/07/2012)
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2012 Anthony Terrien
 * Under MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to vor, eskimoblood, spiffistan, FabrizioC
 */ (function ($) {

    /**
     * Kontrol library
     */
    "use strict";

    /**
     * Definition of globals and core
     */
    var k = {}, // kontrol
        max = Math.max,
        min = Math.min;

    k.c = {};
    k.c.d = $(document);
    k.c.t = function (e) {
        return e.originalEvent.touches.length - 1;
    };

    /**
     * Kontrol Object
     *
     * Definition of an abstract UI control
     *
     * Each concrete component must call this one.
     * <code>
     * k.o.call(this);
     * </code>
     */
    k.o = function () {
        var s = this;

        this.o = null; // array of options
        this.$ = null; // jQuery wrapped element
        this.i = null; // mixed HTMLInputElement or array of HTMLInputElement
        this.g = null; // 2D graphics context for 'pre-rendering'
        this.v = null; // value ; mixed array or integer
        this.cv = null; // change value ; not commited value
        this.x = 0; // canvas x position
        this.y = 0; // canvas y position
        this.$c = null; // jQuery canvas element
        this.c = null; // rendered canvas context
        this.t = 0; // touches index
        this.isInit = false;
        this.fgColor = null; // main color
        this.pColor = null; // previous color
        this.dH = null; // draw hook
        this.cH = null; // change hook
        this.eH = null; // cancel hook
        this.rH = null; // release hook

        this.run = function () {
            var cf = function (e, conf) {
                var k;
                for (k in conf) {
                    s.o[k] = conf[k];
                }
                s.init();
                s._configure()
                    ._draw();
            };

            if (this.$.data('kontroled')) return;
            this.$.data('kontroled', true);

            this.extend();
            this.o = $.extend({
                // Config
                min: this.$.data('min') || 0,
                max: this.$.data('max') || 100,
                stopper: true,
                readOnly: this.$.data('readonly'),

                // UI
                cursor: (this.$.data('cursor') === true && 30) || this.$.data('cursor') || 0,
                thickness: this.$.data('thickness') || 0.35,
                lineCap: this.$.data('linecap') || 'butt',
                width: this.$.data('width') || 200,
                height: this.$.data('height') || 200,
                displayInput: this.$.data('displayinput') == null || this.$.data('displayinput'),
                displayPrevious: this.$.data('displayprevious'),
                fgColor: this.$.data('fgcolor') || '#87CEEB',
                inputColor: this.$.data('inputcolor') || this.$.data('fgcolor') || '#87CEEB',
                inline: false,
                step: this.$.data('step') || 1,

                // Hooks
                draw: null, // function () {}
                change: null, // function (value) {}
                cancel: null, // function () {}
                release: null // function (value) {}
            }, this.o);

            // routing value
            if (this.$.is('fieldset')) {

                // fieldset = array of integer
                this.v = {};
                this.i = this.$.find('input');
                this.i.each(function (k) {
                    var $this = $(this);
                    s.i[k] = $this;
                    s.v[k] = $this.val();

                    $this.bind(
                        'change', function () {
                        var val = {};
                        val[k] = $this.val();
                        s.val(val);
                    });
                });
                this.$.find('legend').remove();

            } else {
                // input = integer
                this.i = this.$;
                this.v = this.$.val();
                (this.v == '') && (this.v = this.o.min);

                this.$.bind(
                    'change', function () {
                    s.val(s._validate(s.$.val()));
                });
            }

            (!this.o.displayInput) && this.$.hide();

            this.$c = $('<canvas width="' +
                this.o.width + 'px" height="' +
                this.o.height + 'px"></canvas>');
            this.c = this.$c[0].getContext("2d");

            this.$
                .wrap($('<div style="' + (this.o.inline ? 'display:inline;' : '') +
                'width:' + this.o.width + 'px;height:' +
                this.o.height + 'px;"></div>'))
                .before(this.$c);

            if (this.v instanceof Object) {
                this.cv = {};
                this.copy(this.v, this.cv);
            } else {
                this.cv = this.v;
            }

            this.$
                .bind("configure", cf)
                .parent()
                .bind("configure", cf);

            this._listen()
                ._configure()
                ._xy()
                .init();

            this.isInit = true;

            this._draw();

            return this;
        };

        this._draw = function () {

            // canvas pre-rendering
            var d = true,
                c = document.createElement('canvas');

            c.width = s.o.width;
            c.height = s.o.height;
            s.g = c.getContext('2d');

            s.clear();

            s.dH && (d = s.dH());

            (d !== false) && s.draw();

            s.c.drawImage(c, 0, 0);
            c = null;
        };

        this._touch = function (e) {

            var touchMove = function (e) {

                var v = s.xy2val(
                    e.originalEvent.touches[s.t].pageX,
                    e.originalEvent.touches[s.t].pageY);

                if (v == s.cv) return;

                if (
                    s.cH && (s.cH(v) === false)) return;


                s.change(s._validate(v));
                s._draw();
            };

            // get touches index
            this.t = k.c.t(e);

            // First touch
            touchMove(e);

            // Touch events listeners
            k.c.d
                .bind("touchmove.k", touchMove)
                .bind(
                "touchend.k", function () {
                k.c.d.unbind('touchmove.k touchend.k');

                if (
                    s.rH && (s.rH(s.cv) === false)) return;

                s.val(s.cv);
            });

            return this;
        };

        this._mouse = function (e) {

            var mouseMove = function (e) {
                var v = s.xy2val(e.pageX, e.pageY);
                if (v == s.cv) return;

                if (
                    s.cH && (s.cH(v) === false)) return;

                s.change(s._validate(v));
                s._draw();
            };

            // First click
            mouseMove(e);

            // Mouse events listeners
            k.c.d
                .bind("mousemove.k", mouseMove)
                .bind(
            // Escape key cancel current change
            "keyup.k", function (e) {
                if (e.keyCode === 27) {
                    k.c.d.unbind("mouseup.k mousemove.k keyup.k");

                    if (
                        s.eH && (s.eH() === false)) return;

                    s.cancel();
                }
            })
                .bind(
                "mouseup.k", function (e) {
                k.c.d.unbind('mousemove.k mouseup.k keyup.k');

                if (
                    s.rH && (s.rH(s.cv) === false)) return;

                s.val(s.cv);
            });

            return this;
        };

        this._xy = function () {
            var o = this.$c.offset();
            this.x = o.left;
            this.y = o.top;
            return this;
        };

        this._listen = function () {

            if (!this.o.readOnly) {
                this.$c
                    .bind(
                    "mousedown", function (e) {
                    e.preventDefault();
                    s._xy()._mouse(e);
                })
                    .bind(
                    "touchstart", function (e) {
                    e.preventDefault();
                    s._xy()._touch(e);
                });
                this.listen();
            } else {
                this.$.attr('readonly', 'readonly');
            }

            return this;
        };

        this._configure = function () {

            // Hooks
            if (this.o.draw) this.dH = this.o.draw;
            if (this.o.change) this.cH = this.o.change;
            if (this.o.cancel) this.eH = this.o.cancel;
            if (this.o.release) this.rH = this.o.release;

            if (this.o.displayPrevious) {
                this.pColor = this.h2rgba(this.o.fgColor, "0.4");
                this.fgColor = this.h2rgba(this.o.fgColor, "0.6");
            } else {
                this.fgColor = this.o.fgColor;
            }

            return this;
        };

        this._clear = function () {
            this.$c[0].width = this.$c[0].width;
        };

        this._validate = function (v) {
            //return (~~(((v < 0) ? -0.5 : 0.5) + (v / this.o.step))) * this.o.step;
            return (Math.floor((((v < 0) ? -0.5 : 0.5) + (v / this.o.step))) * this.o.step);
        };

        // Abstract methods
        this.listen = function () {}; // on start, one time
        this.extend = function () {}; // each time configure triggered
        this.init = function () {}; // each time configure triggered
        this.change = function (v) {}; // on change
        this.val = function (v) {}; // on release
        this.xy2val = function (x, y) {}; //
        this.draw = function () {}; // on change / on release
        this.clear = function () {
            this._clear();
        };

        // Utils
        this.h2rgba = function (h, a) {
            var rgb;
            h = h.substring(1, 7);
            rgb = [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
            return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
        };

        
        this.copy = function (f, t) {
            var i;
            for (i in f) {
                t[i] = f[i];
            }
        };
    };


    /**
     * k.Dial
     */
    k.Dial = function () {
        k.o.call(this);

        this.startAngle = null;
        this.xy = null;
        this.radius = null;
        this.lineWidth = null;
        this.cursorExt = null;
        this.w2 = null;
        this.PI2 = 2 * Math.PI;

        this.extend = function () {
            this.o = $.extend({
                bgColor: this.$.data('bgcolor') || '#EEEEEE',
                angleOffset: this.$.data('angleoffset') || 0,
                angleArc: this.$.data('anglearc') || 360,
                inline: true
            }, this.o);
        };

        this.val = function (v) {
            if (null != v) {
                this.cv = this.o.stopper ? max(min(v, this.o.max), this.o.min) : v;
                this.v = this.cv;
                this.$.val(this.v);
                this._draw();
            } else {
                return this.v;
            }
        };

        this.xy2val = function (x, y) {
            var a, ret;

            a = Math.atan2(
                x - (this.x + this.w2), -(y - this.y - this.w2)) - this.angleOffset;

            if (this.angleArc != this.PI2 && (a < 0) && (a > -0.5)) {
                // if isset angleArc option, set to min if .5 under min
                a = 0;
            } else if (a < 0) {
                a += this.PI2;
            }

            ret = Math.floor((0.5 + (a * (this.o.max - this.o.min) / this.angleArc)) + this.o.min);

            this.o.stopper && (ret = max(min(ret, this.o.max), this.o.min));

            return ret;
        };

        this.listen = function () {
            // bind MouseWheel
            var s = this,
                mw = function (e) {
                    e.preventDefault();
                    var ori = e.originalEvent,
                        deltaX = ori.detail || ori.wheelDeltaX,
                        deltaY = ori.detail || ori.wheelDeltaY,
                        v = parseInt(s.$.val()) + (deltaX > 0 || deltaY > 0 ? s.o.step : deltaX < 0 || deltaY < 0 ? -s.o.step : 0);

                    if (
                        s.cH && (s.cH(v) === false)) return;

                    s.val(v);
                }, kval, to, m = 1,
                kv = {
                    37: -s.o.step,
                    38: s.o.step,
                    39: s.o.step,
                    40: -s.o.step
                };

            this.$
                .bind(
                "keydown", function (e) {
                var kc = e.keyCode;

                // numpad support
                if (kc >= 96 && kc <= 105) {
                    kc = e.keyCode = kc - 48;
                }

                kval = parseInt(String.fromCharCode(kc));

                if (isNaN(kval)) {

                    (kc !== 13) // enter
                    && (kc !== 8) // bs
                    && (kc !== 9) // tab
                    && (kc !== 189) // -
                    && e.preventDefault();

                    // arrows
                    if ($.inArray(kc, [37, 38, 39, 40]) > -1) {
                        e.preventDefault();

                        var v = parseInt(s.$.val()) + kv[kc] * m;

                        s.o.stopper && (v = max(min(v, s.o.max), s.o.min));

                        s.change(v);
                        s._draw();

                        // long time keydown speed-up
                        to = window.setTimeout(function () {
                            m *= 2;
                        }, 30);
                    }
                }
            })
                .bind(
                "keyup", function (e) {
                if (isNaN(kval)) {
                    if (to) {
                        window.clearTimeout(to);
                        to = null;
                        m = 1;
                        s.val(s.$.val());
                    }
                } else {
                    // kval postcond
                    (s.$.val() > s.o.max && s.$.val(s.o.max)) || (s.$.val() < s.o.min && s.$.val(s.o.min));
                }

            });

            this.$c.bind("mousewheel DOMMouseScroll", mw);
            this.$.bind("mousewheel DOMMouseScroll", mw);
        };

        this.init = function () {

            if (
                this.v < this.o.min || this.v > this.o.max) this.v = this.o.min;

            this.$.val(this.v);
            this.w2 = this.o.width / 2;
            this.cursorExt = this.o.cursor / 100;
            this.xy = this.w2;
            this.lineWidth = this.xy * this.o.thickness;
            this.lineCap = this.o.lineCap;
            this.radius = this.xy - this.lineWidth / 2;

            this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset);

            this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc);

            // deg to rad
            this.angleOffset = this.o.angleOffset * Math.PI / 180;
            this.angleArc = this.o.angleArc * Math.PI / 180;

            // compute start and end angles
            this.startAngle = 1.5 * Math.PI + this.angleOffset;
            this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;

            var s = max(
                String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;

            this.o.displayInput && this.i.css({
                'width': ((this.o.width / 2 + 4) >> 0) + 'px',
                'height': ((this.o.width / 3) >> 0) + 'px',
                'position': 'absolute',
                'vertical-align': 'middle',
                'margin-top': ((this.o.width / 3) >> 0) + 'px',
                'margin-left': '-' + ((this.o.width * 3 / 4 + 2) >> 0) + 'px',
                'border': 0,
                'background': 'none',
                'font': 'bold ' + ((this.o.width / s) >> 0) + 'px Arial',
                'text-align': 'center',
                'color': this.o.inputColor || this.o.fgColor,
                'padding': '0px',
                '-webkit-appearance': 'none'
            }) || this.i.css({
                'width': '0px',
                'visibility': 'hidden'
            });
        };

        this.change = function (v) {
            this.cv = v;
            this.$.val(v);
        };

        this.angle = function (v) {
            return (v - this.o.min) * this.angleArc / (this.o.max - this.o.min);
        };

        this.draw = function () {

            var c = this.g, // context
                a = this.angle(this.cv) // Angle
                ,
                sat = this.startAngle // Start angle
                ,
                eat = sat + a // End angle
                ,
                sa, ea // Previous angles
                , r = 1;

            c.lineWidth = this.lineWidth;

            c.lineCap = this.lineCap;

            this.o.cursor && (sat = eat - this.cursorExt) && (eat = eat + this.cursorExt);

            c.beginPath();
            c.strokeStyle = this.o.bgColor;
            c.arc(this.xy, this.xy, this.radius, this.endAngle, this.startAngle, true);
            c.stroke();

            if (this.o.displayPrevious) {
                ea = this.startAngle + this.angle(this.v);
                sa = this.startAngle;
                this.o.cursor && (sa = ea - this.cursorExt) && (ea = ea + this.cursorExt);

                c.beginPath();
                c.strokeStyle = this.pColor;
                c.arc(this.xy, this.xy, this.radius, sa, ea, false);
                c.stroke();
                r = (this.cv == this.v);
            }

            c.beginPath();
            c.strokeStyle = r ? this.o.fgColor : this.fgColor;
            c.arc(this.xy, this.xy, this.radius, sat, eat, false);
            c.stroke();
        };

        this.cancel = function () {
            this.val(this.v);
        };
    };

    $.fn.dial = $.fn.knob = function (o) {
        return this.each(function () {
            var d = new k.Dial();
            d.o = o;
            d.$ = $(this);
            d.run();
        }).parent();
    };

})(jQuery);

/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));
