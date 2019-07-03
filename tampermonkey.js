// ==UserScript==
// @name         Tripletex enhancements
// @namespace    https://www.digifix.no/
// @version      0.1
// @description  Små forbedringer til Tripletex, tilpasset DigiFix AS
// @author       You
// @match        https://tripletex.no/execute/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    /* These are the modifications: */
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        updateDFAURL();
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replaceState'));
        window.dispatchEvent(new Event('locationchange'));
        updateDFAURL();
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });

    window.addEventListener('locationchange', function(){
        updateDFAURL();
    })

    setTimeout(function () {
        var numberPattern = /\d{5}/g;
        var customerNameNumber = document.getElementById('tt-mdl-layout-title');
        var customerNumber = customerNameNumber.innerHTML.match( numberPattern );
        var newLink = document.createElement( 'a' );
        var css = "color: white; font-size: 14px;     text-transform: uppercase; font-family: roboto; padding: 5px 10px 4px; background-color: var(--tlx-theme-button-color); border-radius: 3px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); display: inline-block; margin-right: 20px;";
        var buttonText = " Åpne kunde i DFA ";
        if(customerNumber==null) {
            customerNumber = "";
            buttonText = "";
        }
        newLink.innerHTML = buttonText;
        newLink.href = "https://app.digifix.no/customers/" + customerNumber;
        newLink.id = "dfalink";
        newLink.style = "color: white; font-size: 14px;     text-transform: uppercase; font-family: roboto; padding: 5px 10px 4px; background-color: var(--tlx-theme-button-color); border-radius: 3px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); display: inline-block; margin-right: 20px;";
        newLink.setAttribute('target', '_blank');
        customerNameNumber.parentNode.insertBefore( newLink, customerNameNumber.nextSibling );
    }, 500);

    function updateDFAURL() {
        setTimeout(function () {
            var dfaLink = document.getElementById('dfalink');
            var numberPattern2 = /\d{5}/g;
            var customerNameNumber2 = document.getElementById('tt-mdl-layout-title');
            var customerNumber2 = customerNameNumber2.innerHTML.match( numberPattern2 );
            if(customerNumber2 == null) {
                customerNumber2 = "";
                dfaLink.innerHTML = "";
            } else {
                dfaLink.innerHTML = " Åpne kunde i DFA ";
                dfaLink.href = "https://app.digifix.no/customers/" + customerNumber2;
            }
        }, 500);
    }
    /*
    setTimeout(function () {
        window.onhashchange = function() {
            var dfaLink = document.getElementById('dfalink');
            var numberPattern2 = /\d+/g;
            var customerNameNumber2 = document.getElementById('tt-mdl-layout-title');
            var customerNumber2 = customerNameNumber2.innerHTML.match( numberPattern2 );
            dfaLink.href = "https://app.digifix.no/customers/" + customerNumber2;
        }
    }, 500);

    jQuery(window).bind('hashchange', function() {
        console.log("chage");
        var dfaLink = document.getElementById('dfalink');
        var numberPattern2 = /\d+/g;
        var customerNameNumber2 = document.getElementById('tt-mdl-layout-title');
        var customerNumber2 = customerNameNumber2.innerHTML.match( numberPattern2 );
        dfaLink.href = "https://app.digifix.no/customers/" + customerNumber2;
    });
    */
})();
