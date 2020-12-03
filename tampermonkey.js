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
    const cssButton = "color: white; font-size: 14px;     text-transform: uppercase; font-family: roboto; padding: 5px 10px 4px; background-color: var(--tlx-theme-button-color); border-radius: 3px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); display: inline-block; margin-right: 20px;";
    const cssHideButton = "display: none;"
    const customerNoPattern = /\((\d{5})\)/g;
    const buttonText = " Åpne kunde i DFA ";
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

        /*

        const string = "Eske AS (10035)";
        const regexp = /\((\d{5})\)/g;
        const matches = string.matchAll(customerNoPattern);

        for (const match of matches) {
            console.log(match);
            console.log(match[0]);
            console.log(match[1]);
            console.log(match.index);
        }*/

        //console.log("START first getting of customerNumber: ");
        let el = document.getElementById('tt-mdl-layout-title');
        //console.log("el = ", el);

        let elVal = el.innerHTML;
        //console.log("elVal = ", elVal);

        let valMatches = elVal.matchAll( customerNoPattern );
        //console.log("valMatches = ", valMatches);

        let customerNumber = "";

        for (const match of valMatches) {
            //console.log("match 1: ", match[1]);
            customerNumber = match[1];
            //console.log("customernumber: ", match[1]);
        }

        //console.log("customerNumber = ", customerNumber);

        let newLink = document.createElement( 'a' );
        newLink.style = cssButton;

        if(customerNumber=="") {
            customerNumber = "";
            buttonText = "";
            newLink.style = cssHideButton;
        }

        newLink.innerHTML = buttonText;
        newLink.href = "https://app.digifix.no/customers/" + customerNumber;
        console.log("https://app.digifix.no/customers/", customerNumber);
        newLink.id = "dfalink";
        newLink.setAttribute('target', '_blank');
        el.parentNode.insertBefore( newLink, el.nextSibling );
    }, 500);

    function updateDFAURL() {
        setTimeout(function () {
            //ui-id-2customerIdSelect
            let el = document.getElementById('tt-mdl-layout-title');
            let elVal = el.innerHTML;
            let valMatches = elVal.matchAll( customerNoPattern );
            let customerNumber = "";
            for (const match of valMatches) {
                customerNumber = match[1];
            }

            let dfaLink = document.getElementById('dfalink');

            if(customerNumber == "") {
                customerNumber = "";
                dfaLink.innerHTML = "";
                dfaLink.style = cssHideButton;
            } else {
                dfaLink.innerHTML = buttonText;
                dfaLink.href = "https://app.digifix.no/customers/" + customerNumber;
                dfaLink.style = cssButton;
            }
        }, 500);
    }
})();
