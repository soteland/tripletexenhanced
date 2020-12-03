// ==UserScript==
// @name         Tripletex enhancements
// @namespace    https://www.digifix.no/
// @version      0.1
// @description  Små forbedringer til Tripletex, tilpasset DigiFix AS
// @source       https://github.com/soteland/tripletexenhanced
// @author       You
// @match        https://tripletex.no/execute/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const cssButton = "color: white; font-size: 14px; text-transform: uppercase; font-family: roboto; padding: 5px 10px 4px; background-color: var(--tlx-theme-button-color); border-radius: 3px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); display: inline-block; margin-right: 20px;";
    const cssHideButton = "display: none;"
    const customerNoPattern = /\((\d{5})\)/g;
    const buttonText = " Åpne kunde i DFA ";

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
        let el = document.getElementById('tt-mdl-layout-title');
        let customerNumber = getCustomerNumber(el);

        //Create link-tag
        let newLink = document.createElement( 'a' );
        newLink.style = cssButton;

        if(customerNumber==""||customerNumber==undefined) {
            newLink.style = cssHideButton;
        }

        newLink.innerHTML = buttonText;
        newLink.href = "https://app.digifix.no/customers/" + customerNumber;
        console.log("https://app.digifix.no/customers/", customerNumber);
        newLink.id = "CRM_URL";
        newLink.setAttribute('target', '_blank');
        el.parentNode.insertBefore( newLink, el.nextSibling );
    }, 500);

    function updateDFAURL() {
        setTimeout(function () {
            let el = document.getElementById('tt-mdl-layout-title');
            let customerNumber = getCustomerNumber(el);

            //Update URL
            let crmURL = document.getElementById('CRM_URL');

            if(customerNumber==""||customerNumber==undefined) {
                crmURL.style = cssHideButton;
            } else {
                crmURL.innerHTML = buttonText;
                crmURL.href = "https://app.digifix.no/customers/" + customerNumber;
                crmURL.style = cssButton;
            }
        }, 500);
    }

    function getCustomerNumber(el) {
        //Get customerNumber
        let customerNumber;
        let elVal = el.innerHTML;
        let valMatches = elVal.matchAll( customerNoPattern );

        for (const match of valMatches) {
            customerNumber = match[1];
        }
        return customerNumber;
    }
})();
