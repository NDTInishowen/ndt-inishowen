// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // --------------------- EmailJS

    // ------------ Initialise EmailJs service

    (function(){
        emailjs.init({
          publicKey: "H4tUqmSw0a15UeRcT",
        });
     })();

    //  ------------------ Contact forms

    /* Get contact form(s) from the page and if found: first define Google
       reCAPTCHA's onload callback function (called by API in HTML 'head'
       element), passing each form to security cookie permission handler
       function; then pass each form to main contact form handler */

    const contactForms = document.querySelectorAll('.contact-form');

    if (contactForms.length > 0) {
        /* Has to be defined globally (on window object) so that reCAPTCHA API can
           find it */
        window.grecaptchaOnloadCallback = function() {
            console.log("reCAPTCHA has loaded!");
            for (let form of contactForms) {
                handleContactFormSecurityPermission(form);
            }
        };

        for (let form of contactForms) {
            handleContactFormEmailJS(form);
        }
    }

    // -----------------  Bootstrap modals

    /* Get all Bootstrap modals from the page and if found, add Bootstrap's
       native jQuery 'shown' event listener to each one, passing to handler
       function to trap keyboard navigation inside modal */

    const modals = document.querySelectorAll('.modal');

    if (modals.length > 0) {
        for (let modal of modals) {
            /* have to use jquery '.on' instead of 'addEventListener'
               for Bootstrap 4.3 modal events compatability */
            $(modal).on('shown.bs.modal', () => trapKeyNavFocus(modal));
        }
    }

    // ---------------------- Main menu

    /* Get main menu from the DOM and pass to handler functions if
       found */

    const menu = document.querySelector('#main-menu');

    if (menu) {
        // Set initial aria properties based on screen size
        handleMainMenuAria (menu);

        // Handle main dropdown menu behaviour (event listeners)
        handleMainMenuDropdown(menu);
    }

    // ----------------- Navigation dropdowns

    /* Get all navigation dropdown lists from the page and if found, pass each
       one to handler function */

    const dropdowns = document.querySelectorAll('.navbar-dropdown-menu-container');

    if (dropdowns.length > 0) {
        for (let dropdown of dropdowns) {
            handleDropdownMenu(dropdown);
        }
    }

    /* Get all navigation dropdown list link from the page and, if found, get any
       sections from the page that they might link to. If sections found, pass both
       lists to handler function along with appropriate 'active' class for styling */

    const navbarDropdownLinks = document.querySelectorAll('.navbar-dropdown-item');
    const activeClass = 'active-link'

    if (navbarDropdownLinks.length > 0) {
        const navbarLinkedEls = document.querySelectorAll('.navbar-linked-section');
        if (navbarLinkedEls.length > 0) {
            handleActiveLinkStyleOnScroll(navbarDropdownLinks, navbarLinkedEls, activeClass);
        }
    }

    // ---------------------- Footer

    // Set current year in copyright statement if found

    const copYears = document.querySelectorAll('.copyright-year');
    
    if (copYears.length > 0) {
        for (let copYear of copYears) {
            copYear.innerHTML = new Date().getFullYear();
        }
    }

    // ---------------- Bootstrap Accordions

    /* Get all Bootstrap 'accordion' components from the page and if found,
       pass each one to handler function */

    const accordions = document.querySelectorAll('.accordion');

    if (accordions.length > 0) {
        for (let accordion of accordions) {
            handleBootstrapAccordionPageBreach(accordion);
        }
    }

    // -------------- Screening questionnaire

    /* Get screening questionnaire section element and if found, pass to
       embedded content cookie permission handler function */

    const questionnaireSection = document.querySelector('#questionnaire');

    if (questionnaireSection) {
        handleQuestionnaireEmbContPermission(questionnaireSection);
    }

    // ---------------- 'More' menu pages

    /* Get 'More' menu page's <main> element and if found, pass to handler
       function for content to be dynamically populated from Google Sheets */

    const moreMain = document.querySelector('.more-main');

    if (moreMain) {
        handleMorePageContent(moreMain);
    }

    // -------------- Cookie consent banner

    /* Get cookie consent banner from the page and if found, call its
       associated init() method */
    
    const cookieBanner = document.querySelector('#clearcookiehwd');

    if (cookieBanner) {
        clearCookieHWD.init();
    }

    // --------------- 'Back to Top' links

    /* Get all 'Back to Top' links/buttons from the page and, if found,
       pass each one to handler function */
    
    const topLinks = document.querySelectorAll('.top-link');

    if (topLinks.length > 0) {
        for (let link of topLinks) {
            handleBackToTopLink(link);
        }
    }
    
});

// -------------------- Handler functions

// ------------------------ Main menu

/**
 * Get main menu button, items list and navigation links. Set their
 * initial aria and focus properties based on screen width (i.e. if
 * in dropdown menu mode).
 * 
 * Add event listener to set aria and focus properties of all
 * elements if screen is resized (e.g. mobile device flipped
 * between portrait & landscape mode).
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element.
 */
 function handleMainMenuAria (menu) {
    const button = menu.querySelector('#main-menu-btn')
    const dropdown = menu.querySelector('#main-menu-items');
    const menuOpenClass = 'main-menu-open';
    const links = dropdown.querySelectorAll('.main-menu-item');

    if (window.innerWidth <= 768) {
        handlePopupAria(button, menuOpenClass);
    }
       
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            button.setAttribute('aria-expanded', false);
            dropdown.removeAttribute('aria-hidden');
            for (let link of links) {
                link.removeAttribute('tabindex');
            }
        } else {
            handlePopupAria(button, menuOpenClass);
        }
    });
}

/**
 * Get main header navigation menu toggle button. Set names of
 * toggle button's 'active' class and dropdown menu's 'menu open'
 * class.
 * 
 * Pass toggle button and both class names to handlePopup function.
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element. 
 */
function handleMainMenuDropdown(menu) {
    const button = menu.querySelector('#main-menu-btn');
    const buttonActiveClass = 'menu-toggle-btn-active';
    const menuOpenClass = 'main-menu-open';

    handlePopup(button, buttonActiveClass, menuOpenClass);
}

// ------------------- Main menu functions end

// ----------------- Navigation dropdown functions

/**
 * Get passed-in dropdown's toggle button and set button 'active'
 * class name. Set dropdown's menu 'open' class name and get menu
 * links.
 * 
 * Pass toggle button and class name(s) to handlePopup and
 * handleDropdownAria functions.
 * 
 * Add event listener to close dropdowns and set appropriate aria 
 * properties if screen is resized (e.g. mobile device flipped
 * between portrait & landscape mode).
 * 
 * Add 'click' event listener to each menu link, passing event
 * handler function as callback to throttleEvent function with
 * 'interval' parameter of 300ms, thus limiting click events to
 * max 3 per second.
 * 
 * On click, after 300ms: close dropdown by passing it to
 * handleCloseNavDropdown function along with button 'active'
 * class; on smaller screens, (width <= 768px), main-menu will be
 * in dropdown mode, so get it along with its toggle button and
 * dropdown menu; set main menu 'open' class and pass it and menu
 * to handleCloseNestedDropdown function, remove 'open' class from
 * main menu dropdown and 'active' class from main menu toggle
 * button, thus closing entire main menu; pass main menu's toggle
 * button and 'open' class to handlePopupAria function.
 * 
 * @param {HTMLElement} dropdown - Element containing or consisting of navigation dropdown to be handled.
 */
 function handleDropdownMenu(dropdown) {
    const dropdownToggleButton = dropdown.querySelector('.menu-toggle-btn');
    const buttonActiveClass = 'menu-toggle-btn-active';
    const dropdownOpenClass = 'navbar-dropdown-open';
    const menuLinks = dropdown.querySelectorAll('.navbar-dropdown-item');


    handleDropdownAria(dropdownToggleButton, dropdownOpenClass);
    handlePopup(dropdownToggleButton, buttonActiveClass, dropdownOpenClass);

    window.addEventListener('resize', () => {
        const ddId = dropdownToggleButton.getAttribute('aria-controls');
        const dropdownMenu = dropdown.querySelector(`#${ddId}`);
        dropdownMenu.classList.remove(dropdownOpenClass);
        handleDropdownAria(dropdownToggleButton, dropdownOpenClass);
        dropdownToggleButton.classList.remove(buttonActiveClass);
    });

    if (menuLinks.length > 0) {
        for (let link of menuLinks) {
            link.addEventListener('click', throttleEvent(e => {
                // Only target link anchor element
                let targetLink = e.target.closest('a');
                if (!targetLink) return;

                setTimeout (() => {
                    if (window.innerWidth <= 768) {
                        const mainMenu = document.querySelector('#main-menu');
                        const mainMenuButton = mainMenu.querySelector('#main-menu-btn');
                        const mainMenuDropdown = mainMenu.querySelector('#main-menu-items');
                        const mainMenuOpenClass = 'main-menu-open';

                        handleCloseNestedDropdowns(mainMenu, buttonActiveClass);
                        mainMenuDropdown.classList.remove(mainMenuOpenClass);
                        mainMenuButton.classList.remove(buttonActiveClass);
                        handlePopupAria(mainMenuButton, mainMenuOpenClass);
                    } else {
                        handleCloseNavdDropdown(dropdown, buttonActiveClass);
                    }
                }, 300);
               // Pass 300ms time interval to throttleEvent function
            }, 300));
        }
    }
}

/**
 * Get passed-in parent element's nested navigation dropdown menus and
 * pass each one, along with passed-in toggle button 'active' class to
 * handler function.
 * 
 * @param {HTMLElement} parentMenu - Element containing navigation dropdowns to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 */
 function handleCloseNestedDropdowns(parentMenu, togglerActiveClass) {
    const dropdowns = parentMenu.querySelectorAll('.navbar-dropdown-menu-container');
    for (let dropdown of dropdowns) {
        handleCloseNavdDropdown(dropdown, togglerActiveClass);
    }
}

/**
 * Get passed-in navigation dropdown menu's toggle button and associated
 * menu list. Set 'active' class name for menu list.
 * 
 * Remove 'active' class name from menu list, effectively closing it.
 * Pass toggle button and its associated menu's 'active' class name to
 * handleDropdownAria function.
 * 
 * Remove passed-in 'active' class name from toggler button.
 * 
 * @param {HTMLElement} parentMenu - Element containing navigation dropdowns to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 */
 function handleCloseNavdDropdown(dropdown, togglerActiveClass) {
    const ddToggleBtn = dropdown.querySelector('.menu-toggle-btn');
    const ddId = ddToggleBtn.getAttribute('aria-controls');
    const ddMenu = dropdown.querySelector(`#${ddId}`);
    const ddOpenClass = 'navbar-dropdown-open';
    ddMenu.classList.remove(ddOpenClass);
    handleDropdownAria(ddToggleBtn, ddOpenClass);
    ddToggleBtn.classList.remove(togglerActiveClass);
}

// --------------- Navigation dropdown functions end

// --------------------- Popups & dropdowns

// Aria properties

/**
 * Get passed-in toggle button's associated popup element. Get
 * popup's focusable child elements, exempting navigatiion dropdown
 * menu items as they have their own aria-handling function in order
 * to avoid aria-handling clashes between the main dropdown menu and
 * any navigation dropdowns nested within it.
 * 
 * Check popup for passed-in class name to determine if visible.
 * 
 * If popup hidden, set toggle button's aria-expanded attribute to
 * false, set popup's aria-hidden attribute to true and set each
 * focusable element's tabindex attribute to -1, thereby rendering 
 * them non-focusable.
 * 
 * If popup visible, set toggle button's aria-expanded attribute to
 * true, set popup's aria-hidden attribute to false and remove each
 * focusable elements' tabindex attributes so that they become
 * focusable again. Add one-time, 'focusout' event listener to
 * toggle button to set focus to specified element in popup, if any.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopupAria (toggleButton, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);
    const elements = popup.querySelectorAll('a:not(.navbar-dropdown-item), audio, button, iframe, input');
    const focusElement = popup.querySelector('.first-focus');
    
    if (!popup.classList.contains(popupOpenClass)) {
        toggleButton.setAttribute('aria-expanded', false);
        popup.setAttribute('aria-hidden', true);
        for (let el of elements) {
            el.setAttribute('tabindex', '-1');
        }
    } else {
        toggleButton.setAttribute('aria-expanded', true);
        popup.setAttribute('aria-hidden', false);
        for (let el of elements) {
            el.removeAttribute('tabindex');
        }

        toggleButton.addEventListener('focusout', () => {
            if (focusElement) {
                focusElement.focus();
            }
        }, {once: true});
    }
}

/**
 * Get passed-in toggle button's associated dropdown element. Get
 * dropdown's focusable child elements.
 * 
 * Check dropdown for passed-in class name to determine if visible.
 * 
 * If dropdown hidden, set toggle button's aria-expanded attribute to
 * false, set dropdown's aria-hidden attribute to true and set each
 * focusable element's tabindex attribute to -1, thereby rendering 
 * them non-focusable.
 * 
 * If dropdown visible, set toggle button's aria-expanded attribute to
 * true, set dropdown's aria-hidden attribute to false and remove each
 * focusable elements' tabindex attributes so that they become
 * focusable again.
 * 
 * @param {HTMLElement} toggleButton - Button controlling dropdown element to be handled.
 * @param {string} dropdownOpenClass - Class name denoting dropdown element visible.
 */
function handleDropdownAria (toggleButton, dropdownOpenClass) {
    const dropdownId = toggleButton.getAttribute('aria-controls');
    const dropdown = document.querySelector(`#${dropdownId}`);
    const elements = dropdown.querySelectorAll('a, button, iframe, input');
    
    if (!dropdown.classList.contains(dropdownOpenClass)) {
        toggleButton.setAttribute('aria-expanded', false);
        dropdown.setAttribute('aria-hidden', true);
        for (let el of elements) {
            el.setAttribute('tabindex', '-1');
        }
    } else {
        toggleButton.setAttribute('aria-expanded', true);
        dropdown.setAttribute('aria-hidden', false);
        for (let el of elements) {
            el.removeAttribute('tabindex');
        }
    }
}

// Main functionality ('click' events)

/**
 * Get passed-in toggle button's associated popup element.
 * 
 * Add 'click' event listener to toggle button, passing event
 * handler function as callback to throttleEvent function with
 * 'interval' parameter of 300ms, thus limiting click events to
 * max 3 per second.
 * 
 * On click: toggle passed-in 'popup open' class on popup or, based
 * on popup type, add/remove appropriate class names and/or call
 * appropriate handler function(s); if appropriate, toggle
 * passed-in 'active' class on toggle button; pass toggle button
 * and 'popup open' class name to handlePopupAria function or, if 
 * popup is a navigation dropdown menu, to handleDropdownAria function.
 * 
 * If appropriate, pass toggle button and both class names to
 * handlePopupExternalEvent function.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopup(toggleButton, togglerActiveClass, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);

    toggleButton.addEventListener('click', throttleEvent(e => {
        // Only target entire button element
        let targetButton = e.target.closest('button');
        if (!targetButton) return;

        /* Specific handling of news & events page article
           dropdowns */
        if (popup.classList.contains('news-item-main') || popup.classList.contains('gig-listing-main')) {
            if (popup.classList.contains(popupOpenClass)) {
                handleCollapseArticle(toggleButton, togglerActiveClass, popupOpenClass);
            } else {
                popup.classList.add(popupOpenClass);
                toggleButton.classList.add(togglerActiveClass);
            }
        /* Specific handling of main menu's nested navigation
           dropdown menus when it's in dropdown mode itself */
        } else if (popup.classList.contains('main-menu-responsive') && popup.classList.contains(popupOpenClass)) {
            handleCloseNestedDropdowns(popup, togglerActiveClass);
            popup.classList.remove(popupOpenClass);
            toggleButton.classList.remove(togglerActiveClass);
        // Handling of generic popups
        } else {
            popup.classList.toggle(popupOpenClass);
            toggleButton.classList.toggle(togglerActiveClass);
        }

        // Handling of aria properties
        if (popup.classList.contains('navbar-dropdown-menu')) {
            handleDropdownAria(toggleButton, popupOpenClass);
        } else {            
            handlePopupAria(toggleButton, popupOpenClass);
        }

        /* Exempt navigation dropdown menus from being passed to 
           external event handler if main menu is in dropdown mode - 
           will be handled along with main menu. Exempt news & events
           page articles from closing on external events in all cases. */
        if (window.innerWidth <= 768) {
            if (!(toggleButton.classList.contains('navbar-dropdown-btn') || toggleButton.classList.contains('article-toggle-btn'))) {
                handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass);
            }
        } else {
            if (!(toggleButton.classList.contains('article-toggle-btn'))) {
                handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass);
            }
        }
    // Pass 300ms time interval to throttleEvent function
    }, 300));
}

// External events

/**
 * Get passed-in toggle button's associated popup element.
 * 
 * Check popup for passed-in class name to determine if visible.
 * 
 * If popup visible, add event listeners to window object for click,
 * touch and focus events outside popup and toggle button. If
 * detected: hide popup; pass toggle button and 'popup open' class
 * name to handlePopupAria function or, if popup is a navigation 
 * dropdown menu, to handleDropdownAria function; remove 'active' 
 * class from toggle button.
 * 
 * If main menu is in dropdown mode, (screen <= 768px), navigation
 * dropdown menus won't have been passed in here, (see handlePopup
 * function), so they are dealt with along with the main menu (i.e.
 * passed to handleCloseNestedDropdowns function).
 * 
 * Remove event listeners from window. If appropriate, set focus to
 * toggle button.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);
    // Boolean variable to indicate keyboard tab key navigation
    let tabKeyNavigation = false;

    // Handler function for event listeners
    const close = e => {
        if (!popup.contains(e.target) && !toggleButton.contains(e.target)) {

            if (popup.classList.contains('main-menu-responsive')) {
                handleCloseNestedDropdowns(popup, togglerActiveClass);
            }

            popup.classList.remove(popupOpenClass);

            if (popup.classList.contains('navbar-dropdown-menu')) {
                handleDropdownAria(toggleButton, popupOpenClass);
            } else {            
                handlePopupAria(toggleButton, popupOpenClass);
            }

            toggleButton.classList.remove(togglerActiveClass);
        } else return;
        
        window.removeEventListener('click', close);
        window.removeEventListener('touchstart', close);
        window.removeEventListener('focusin', close);
        window.removeEventListener('keydown', detectTabbing);

        if (tabKeyNavigation) {
            toggleButton.focus();
        }
    }

    // Event listeners
    if (popup.classList.contains(popupOpenClass)) {
        window.addEventListener('click', close);
        /* Needed for iOS Safari as click events won't bubble up to
           window object */
        window.addEventListener('touchstart', close);
        // Needed for keyboard navigation (tabbing out of popup)
        window.addEventListener('focusin', close);
        /* Listener to detect tab key navigation & set value of
           boolean variable */
        window.addEventListener('keydown', detectTabbing = e => {
            if (e.key === 'Tab' || ((e.keyCode || e.which) === 9)) {
                let tab = true;

                if (tab || (e.shiftKey && tab)) {
                    tabKeyNavigation = true;
                }
            } else {
                tabKeyNavigation = false;
            }
        });
    }
}

// --------------- Popups & dropdowns functions end

// -------------- Bootstrap components custom handlers

// ------------------------- Accordions

/**
 * Get passed-in Bootstrap 'accordion' component's child 'card'
 * components, each of which in turn contains a Bootstrap 'collapse'
 * component in the card body and its associated control link in the
 * card header.
 * 
 * Get each card's empty, block-level anchor tag which contains its
 * CSS 'scroll-margin-top' property and hence controls its position
 * below the page's fixed header.
 * 
 * Get each card's header and 'collapse' component's controlling
 * link.
 * 
 * Add 'click' event listener to each controlling link. (Used
 * instead of Bootstrap 'show.bs.collapse' or 'hide.bs.collapse'
 * events in case they don't fire in time.)
 * 
 * On click, wait 0.5 seconds (setTimeout()) for 'collapse' component
 * to expand. If the card header has passed the bottom of the page's
 * fixed header, set the window target to the card's empty anchor tag
 * so that the card header scrolls back to the bottom of the page
 * header.
 * 
 * @param {HTMLElement} accordion - Bootstrap 'accordion' component element.
 */
function handleBootstrapAccordionPageBreach(accordion) {
    const cards = accordion.querySelectorAll('.card');

    if (cards.length > 0) {
        for (let card of cards) {
            const anchor = card.querySelector('.card-anchor');
            const header = card.querySelector('.card-header');
            const collapseLink = header.querySelector('.faq-accordion-link');

            collapseLink.addEventListener('click', () => {
                setTimeout(() => {
                    // On smaller screens (width <= 768px), page header is 140px high
                    if (window.innerWidth <= 768) {
                        if (header.getBoundingClientRect().top < 140) {
                            window.location.href = `#${anchor.id}`;                                
                        }
                    // On larger screens, page header is 207px high
                    } else {
                        if (header.getBoundingClientRect().top < 207) {
                            window.location.href = `#${anchor.id}`;                                
                        }
                    }
                }, 500);
            });
        }
    }
}

// ----------- Bootstrap components custom functions end

// ------------------- Contact Forms & EmailJS

/**
 * Get passed-in form element's child 'success' and 'failure' message
 * div elements and submit button's container div element. Get form's
 * parent pop-up modal element, if any.
 * 
 * Add 'submit' event listener to passed-in form element.
 * 
 * On submit, set template parameters object to be passed to EmailJS
 * send() method with keys matching EmailJS template variable names,
 * values populated from corresponding field in form element and Google
 * reCAPTCHA response token (if API script has loaded).
 * 
 * Call send() method to submit form details to EmailJS, passing in
 * EmailJS service ID, EmailJS template ID and template parameters
 * object, then await response. On 'success' response, display
 * 'success' message and hide submit button. On 'error' response,
 * display 'failure' message and hide submit button. On either
 * response, disable/enable other hidden, focusable elements & set
 * focus as appropriate.
 * 
 * If parent modal element exists, pass to trapKeyNavFocus() function.
 * 
 * @param {HTMLElement} contactForm - Contact form from 'Contact Us' page or footer email modal: form element.
 */
function handleContactFormEmailJS(contactForm) {
    const successMsg = contactForm.querySelector('.cf-success-message');
    const failureMsg = contactForm.querySelector('.cf-failure-message');
    const submitBtnSection = contactForm.querySelector('.contact-btn-wrapper');
    const modal = contactForm.closest('.modal');

    contactForm.addEventListener('submit', (e) => {
        // Prevent page from refreshing on form submit
        e.preventDefault();
        // get Google reCAPTCHA response token
        let captchaToken = null;
        if (!(typeof grecaptcha === 'undefined'))
            captchaToken = grecaptcha.enterprise.getResponse();
        // Set parameters to be sent to EmailJS template
        // **Key values MUST match variable names in EmailJS template
        // 'g-recaptcha-response' is the default name for the token
        let templateParams = {
            'first_name': contactForm.firstname.value,
            'last_name': contactForm.surname.value,
            'email_addr': contactForm.email.value,
            'phone_no': contactForm.phone.value,
            'message': contactForm.message.value,
            "g-recaptcha-response": captchaToken,
        }
        // Call EmailJS send() method to submit form
        emailjs.send('gmail_ndti', 'contact-form', templateParams).then(
            (response) => {
                console.log('SUCCESS!', response.status, response.text);
                submitBtnSection.classList.add('shrink-hide');
                submitBtnSection.setAttribute('aria-hidden', 'true');
                submitBtnSection.querySelector('button').setAttribute('disabled', ''); // hidden submit button
                submitBtnSection.querySelector('textarea').setAttribute('disabled', ''); // hidden Google reCAPTCHA
                /* Use of the 'disabled' attribute on anchor tags is
                   soleley for the purpose of excluding them from the
                   trapKeyNavFocus() function's list of focusable elements.
                   Functionality is addressed by CSS. */
                contactForm.querySelector('.failure-email-link').setAttribute('disabled', ''); // hidden link in failure message
                contactForm.querySelector('.failure-email-link').setAttribute('aria-disabled', 'true'); // hidden link in failure message
                successMsg.classList.remove('cf-hidden');
                if (modal) {
                    // set focus to modal close button
                    contactForm.querySelector('.close').focus();
                    // resubmit modal, if any, to trapKeyNavFocus() function
                    trapKeyNavFocus(modal);
                }
            },
            (error) => {
                console.log('FAILED...', error);
                submitBtnSection.classList.add('shrink-hide');
                submitBtnSection.setAttribute('aria-hidden', 'true');
                submitBtnSection.querySelector('button').setAttribute('disabled', ''); // hidden submit button
                submitBtnSection.querySelector('textarea').setAttribute('disabled', ''); // hidden Google reCAPTCHA
                contactForm.querySelector('.failure-email-link').removeAttribute('disabled'); // link in failure message
                contactForm.querySelector('.failure-email-link').removeAttribute('aria-disabled'); // link in failure message
                failureMsg.classList.remove('cf-hidden');
                // set focus to failure message email link
                contactForm.querySelector('.failure-email-link').focus();
                // resubmit modal, if any, to trapKeyNavFocus() function
                if (modal) 
                    trapKeyNavFocus(modal);
            },
        );
    });
}

/**
 * Get passed-in form element's 'submit' section (containing submit
 * button and Google reCAPTCHA), security cookie disclaimer section
 * (containing 'Manage Settings' button) and reCAPTCHA load error
 * message. Check for security cookies permission setting and set state.
 * 
 * If reCAPTCHA script has loaded, hide load error message (displayed
 * by default).
 * 
 * If security cookie permission state is true, render reCAPTCHA and
 * display 'submit' section (hidden by default), enabling submit button.
 * Hide cookie disclaimer section, disabling 'Manage Settings' button.
 * 
 * If security cookie state is false, delete reCAPTCHA (and thus any
 * associated cookies, local storage, etc), hide 'submit' section,
 * disabling button and display cookie disclaimer section, enabling
 * button.
 * 
 * @param {HTMLElement} contactForm - Contact form from 'Contact Us' page or footer email modal: form element. 
 */
function handleContactFormSecurityPermission(contactForm) {
    const submitBtnSection = contactForm.querySelector('.contact-btn-wrapper');
    const captchaContainer = submitBtnSection.querySelector('.captcha-outer-container');
    const cookieDisclaimer = contactForm.nextElementSibling;
    const captchaLoadErrorMsg = cookieDisclaimer.nextElementSibling;
    let securityCookiePermission;

    if (clearCookieHWD.consentSettingsStored())
        securityCookiePermission = clearCookieHWD.getUserConsentSettings().consent.security;

    if (!(typeof grecaptcha === 'undefined') && grecaptcha.enterprise.ready) {
        captchaLoadErrorMsg.classList.add('cf-hidden');

        if (securityCookiePermission) {
            let captchaContainerID = '';
            // Set unique captcha container id for each form
            if (contactForm.id === 'contact-page-form')
                captchaContainerID = 'g-recaptcha-container--contact-page';
            else if (contactForm.id === 'modal-contact-form')
                captchaContainerID = 'g-recaptcha-container--modal-form'

            captchaContainer.innerHTML = '<div id="' + captchaContainerID + '" class="captcha-container"></div>';
            grecaptcha.enterprise.render(captchaContainerID, {
                'sitekey': '6Lf02mErAAAAAEt3x20QMuB3VPm2M9e0mYvGUFF9',
                'theme': 'light',
            });
            submitBtnSection.querySelector('button').removeAttribute('disabled');
            submitBtnSection.classList.remove('cf-hidden');
            cookieDisclaimer.querySelector('button').setAttribute('disabled', '');
            cookieDisclaimer.classList.add('cf-hidden');
        } else {
            captchaContainer.innerHTML = '';
            submitBtnSection.querySelector('button').setAttribute('disabled', '');
            submitBtnSection.classList.add('cf-hidden');
            cookieDisclaimer.querySelector('button').removeAttribute('disabled');
            cookieDisclaimer.classList.remove('cf-hidden');
        }
    }
}

// ------------- Contact Forms & EmailJS functions end

// ------ Embedded Google Forms screening questionnaire functions

/**
 * Get container element for embedded Google Form and cookie disclaimer
 * element from passed-in section element.
 * 
 * Check for embedded content cookies permission setting. If cookie
 * consent given, hide cookie disclaimer and render iframe element for
 * embedded Google form. If consent not given, delete iframe (and thus
 * any associated cookies, local storage, etc) and display cookie
 * disclaimer. 
 * 
 * @param {HTMLElement} section - Section element to contain embedded Google Forms screening questionnaire.
 */
function handleQuestionnaireEmbContPermission(section) {
    const iframeContainer = section.querySelector('#questionnaire-iframe-container');
    const cookieDisclaimer = section.querySelector('.questionnaire-cookie-disclaimer-wrapper');
    let embContCookiePermission;

    if (clearCookieHWD.consentSettingsStored())
        embContCookiePermission = clearCookieHWD.getUserConsentSettings().consent['embedded-content'];

    if (embContCookiePermission) {
        cookieDisclaimer.classList.add('q-hidden');
        iframeContainer.innerHTML = `<iframe id="questionnaire-iframe" src="https://docs.google.com/forms/d/118qCKE5v6TD4X_THQz0oz--rGnaRdm9whLhMYaHQ4P0/viewform?pli=1&ts=678e4390&pli=1&edit_requested=true&fbzx=765514001506525119" title="NDP Inishowen's screening questionnaire on Google Forms, embedded here in an iframe" name="screening-questionnaire" loading="lazy"></iframe>`;
    } else {
        iframeContainer.innerHTML = '';
        cookieDisclaimer.classList.remove('q-hidden');
    }
}

// ---- Embedded Google Forms screening questionnaire functions end

// ------ 'More' menu pages (dynamically populated) functions

/**
 * Get each element to be dynamically populated from passed-in
 * 'main' element.
 * 
 * Fetch custom Google Forms / Google Sheets CMS data from custom
 * Google Apps Script endpoint, handling errors in try-catch block.
 * Get each data object array (Google Sheets data) from fetch
 * response JSON object.
 * 
 * Pass each element to be populated, along with corresponding data
 * object array, to respective handler functions. If any errors
 * thrown, display backup content from DOM instead.
 * 
 * @param {HTMLElement} moreMain - 'More' menu page's 'main' element.
 */
async function handleMorePageContent(moreMain) {
    const testimonialSection = moreMain.querySelector('#testimonials-content');
    const videoLinksSection = moreMain.querySelector('#video-links-content');
    const webLinksSection = moreMain.querySelector('#website-links-content');
    const furtherReadingSection = moreMain.querySelector('#further-reading-content');

    // URL for deployed custom Google Apps Script web app endpoint
    const url = 'https://script.google.com/macros/s/AKfycbxGufsKBOdwATMTU0dr5s91wdJOV1EvWrSuYOUkvIyh605Er3z4iKI5TZxLqkb_B16Ndw/exec';
    
    try {
        const response = await fetch(url);
        // Check fetch response is returned correctly
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        // Convert returned JSON string format to JSON object
        const spreadsheetData = await response.json();
        /* Break fetched Google Sheets spreadsheet data object down
           into object arrays consisting of individual sheet data */
        const testimonialsData = spreadsheetData.testimonialsformdata;
        const videoLinksData = spreadsheetData.videolinksformdata;
        const webLinksData = spreadsheetData.sitelinksformdata;
        const readingData = spreadsheetData.frformdata;
        // Call handler functions to populate page/hide loading screen
        if (testimonialSection) {
            populateTestimonials(testimonialSection, testimonialsData);
            hideLoadingScreen();
        }
        if (videoLinksSection) {
            populateVideoLinks(videoLinksSection, videoLinksData);
            hideLoadingScreen();
        }
        if (webLinksSection) {
            populateWebLinks(webLinksSection, webLinksData);
            hideLoadingScreen();
        }
        if (furtherReadingSection) {
            populateFurtherReading(furtherReadingSection, readingData);
            hideLoadingScreen();
        }
    } catch (error) {
        console.error(`${error.message}. Displaying backup data.`);
        // Display all backup content in case of error
        const backupContent = document.querySelectorAll('.backup-content');
        for (let backup of backupContent) {
            // If backup content contains embedded video, pass to handler
            if (backup.classList.contains('video-links-backup'))
                handleBackupEmbVidCookiePermission(backup);

            backup.classList.remove('bc-hidden');
        }
        hideLoadingScreen();
    }
}

// Testimonials page

/**
 * Check for custom error message from Google Apps Script endpoint
 * (will be present if sheet missing/mis-named). If present, call
 * sheetErrorBackup() function, with passed-in 'section' element,
 * relevant sheet name and error message as parameters, in order to
 * display backup content.
 * 
 * If no error message, for each object in passed-in Google Sheet data
 * array:
 * 
 * - Get 'clientname' and 'clienttestimonial' string values. Check
 * each is not an empty string/null/etc. If 'clientname' has no value,
 * assign 'Anonymous' as name value. If 'clientteatimonial' has no
 * value, ignore this object and move on to next object in data array.
 * 
 * - Format and sanitise name and testimonial string values using
 * formatStringForHtml() function.
 * 
 * - Create elements for each data array object (structured to match
 * backup content in DOM) and add to passed-in 'section' element.
 * 
 * If 'section' element ends up with no content, (i.e. no valid data
 * passed in), pass to sheetErrorBackup() function with relevant sheet
 * name in order to display backup content.
 * 
 * @param {HTMLElement} section - Containing div element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateTestimonials(section, data) {
    if (data.error) {
        sheetErrorBackup(section, 'Testimonials Form Data', data.error);
    } else {
        for (let obj of data) {
            let name = obj.clientname
            let quote = obj.clienttestimonial

            /* Conditional statements used to safeguard against Google
               Sheets data having missing cells */
            if (name) {
                name = formatStringForHtml(name);
            } else {
                name = 'Anonymous';
            }
            // Only use object data if testimonial content present
            if (quote) {
                quote = formatStringForHtml(quote);
                // Outer container
                const testimonialWrapper = document.createElement('div');
                testimonialWrapper.classList.add('testimonial-wrapper', 'col-12', 'col-md-4', 'mb-3');
                // Styling container
                const testimonialDiv = document.createElement('div');
                testimonialDiv.classList.add('testimonial');
                // Testimonial element
                const quoteDiv = document.createElement('div');
                quoteDiv.classList.add('testimonial-quote');
                quoteDiv.innerHTML = `<p>&#34;${quote}&#34;</p>`
                testimonialDiv.appendChild(quoteDiv);
                // client name element
                const nameDiv = document.createElement('div');
                nameDiv.classList.add('testimonial-name');
                nameDiv.innerHTML = `<p>&#45; ${name}</p>`;
                testimonialDiv.appendChild(nameDiv);

                testimonialWrapper.appendChild(testimonialDiv);
                section.appendChild(testimonialWrapper);
            }
        }
        if (!section.innerHTML) {
            sheetErrorBackup(section, 'Testimonials Form Data');
        }
    }
}

// Useful Links page: Videos section

/**
 * Construct array of trusted video source names.
 * 
 * Check for custom error message from Google Apps Script endpoint
 * (will be present if sheet missing/mis-named). If present, call
 * sheetErrorBackup() function, with passed-in 'section' element,
 * relevant sheet name and error message as parameters, in order to
 * display backup content.
 * 
 * If no error message, for each object in passed-in Google Sheet data
 * array:
 * 
 * - Get all string values. Check each 'required' value is not an
 * empty string/null/etc. If any have no value, ignore this object
 * and move on to next object in data array.
 * 
 * - Pass video URL to validator function to check for 'https'
 * protocol and that host name contains trusted source name from
 * 'sources' array. Function will either return a new URL object or
 * null. If null, again skip this object.
 * 
 * - Create required container elements, adding Bootstrap and other
 * classes for formatting/styling.
 * 
 * - Format/sanitise all non-URL string values using
 * formatStringForHtml() function, withholding any required for
 * 'aria-label'/'title' attributes until after use for that purpose.
 * 
 * - Pass video URL and aria-label string constructed of video
 * title + URL text to createExternalLinkElement() function in order
 * to create primary video link element. Add formatted/sanitised
 * video title as link text for video heading link.
 * 
 * - For any video embed code: First check for 'Embedded Content' cookies
 * permission and only continue if allowed. Pass video embed code with
 * video title and 'sources' array to createVideoEmbed() function in
 * attempt to create embedded video iframe element. If video embed code
 * (not 'required') is an empty string/null or contains an invalid
 * 'src' URL, function will return null. If iframe element returned,
 * add Bootstrap responsive embed classes to it and its container
 * element.
 * 
 * - Clone video link used in heading for primary video link and
 * replace link text with formatted/sanitised video URL text.
 * 
 * - If secondary video URL and by implication, secondary URL text,
 * (neither 'required') are not empty strings/null, validate secondary
 * video URL, only continuing if validator function doesn't return null.
 * Pass secondary video URL and aria-label string constructed of video
 * title + secondary URL text to createExternalLinkElement() function
 * in order to create secondary video link element. Add formatted/
 * sanitised secondary URL text as link text.
 * 
 * - Having added all newly created elements in order to an outer
 * container, (structured to match backup content in DOM), add outer
 * container to passed-in 'section' element.
 * 
 * If 'section' element ends up with no content, (i.e. no valid data
 * passed in), pass to sheetErrorBackup() function with relevant sheet
 * name in order to display backup content.
 * 
 * @param {HTMLElement} section - Containing div element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateVideoLinks(section, data) {
    const sources = ['youtube-nocookie.com', 'youtube.com', 'youtu.be', 'amazon.co', 'amazon.com', 'amazon.de', 'primevideo.com', 'vimeo.com', 'dailymotion.com', 'facebook.com'];

    if (data.error) {
        sheetErrorBackup(section, 'Video Links Form Data', data.error);
    } else {
        for (let obj of data) {
            const title = obj.videotitle;
            let description = obj.videodescription;
            const videoUrl = obj.videourl;
            let urlText = obj.videourltext;
            let embedCode = obj.videoembedcode;
            const altUrl = obj.secondaryurl;
            let altText = obj.secondaryurltext;

            /* The following conditional statement is to safeguard
               against missing cells in Google Sheets CMS data - i.e.
               only continue if required fields were filled out in
               linked Google Form */
            if (title && description && videoUrl && urlText) {
                /* Only continue if video URL is valid 'https' URL
                   and appears to come from a trusted domain */
                if (isValidUrl(videoUrl, 'https:', sources)) {
                    // Outer container
                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.classList.add('useful-link-wrapper', 'text-center', 'mb-4');

                    // Video heading element
                    const videoHeading = document.createElement('h4');
                    videoHeading.classList.add('h5', 'mb-0');
                    /* Retain original 'obj.videotitle' string
                       for use in aria-label' and 'title'
                       attributes of dynamically created elements */
                    const newTitle = formatStringForHtml(title);
                    // Primary video link for heading
                    const videoLink = createExternalLinkElement(videoUrl, `Watch '${title}' - ${urlText}`);
                    videoLink.innerHTML = newTitle;
                    videoHeading.appendChild(videoLink);
                    wrapperDiv.appendChild(videoHeading);
                    
                    // Video description element
                    const descriptionDiv = document.createElement('div');
                    description = formatStringForHtml(description);
                    const descriptionParag = `<p>${description}</p>`;
                    descriptionDiv.innerHTML = descriptionParag;
                    wrapperDiv.appendChild(descriptionDiv);
                    
                    // Embedded video
                    let embContCookiePermission;
                    // Only continue if embedded content cookies allowed
                    if (clearCookieHWD.consentSettingsStored())
                        embContCookiePermission = clearCookieHWD.getUserConsentSettings().consent['embedded-content'];

                    if (embContCookiePermission) {
                        embedCode = createVideoEmbed(embedCode, title, sources);
                        if (embedCode) {
                            embedCode.classList.add('embed-responsive-item');
                            const videoDiv = document.createElement('div');
                            videoDiv.classList.add('useful-links-video-wrapper', 'd-flex', 'justify-content-center', 'my-3');
                            const iframeDiv = document.createElement('div');
                            iframeDiv.classList.add('useful-links-video', 'embed-responsive', 'embed-responsive-16by9');
                            iframeDiv.appendChild(embedCode);
                            videoDiv.appendChild(iframeDiv);
                            wrapperDiv.appendChild(videoDiv);
                        }
                    }
                    
                    // Primary video link element
                    const videoLinkParag = document.createElement('p');
                    urlText = formatStringForHtml(urlText);
                    const newVideoLink = videoLink.cloneNode();
                    newVideoLink.innerHTML = urlText;
                    videoLinkParag.appendChild(newVideoLink);
                    wrapperDiv.appendChild(videoLinkParag);

                    // Secondary video link element
                    if (altUrl) {
                        // Secondary video link requires link text
                        if (altText) {
                            /* Only create secondary video link if secondary
                               URL is valid 'https' URL and appears to come
                               from a trusted domain */
                            if (isValidUrl(altUrl, 'https:', sources)) {
                                const secondLinkParag = document.createElement('p');
                                const secondaryLink = createExternalLinkElement(altUrl, `Watch '${title}' - ${altText}`);
                                altText = formatStringForHtml(altText);
                                secondaryLink.innerHTML = altText;
                                secondLinkParag.appendChild(secondaryLink);
                                wrapperDiv.appendChild(secondLinkParag);
                            }
                        }
                    }
                    section.appendChild(wrapperDiv);
                }
            }
        }
        if (!section.innerHTML) {
            sheetErrorBackup(section, 'Video Links Form Data');
        }
    }
}

/**
 * Construct object containing all attributes and their values
 * necessary for the iframe element to be created. 
 * 
 * Use RegEx match() method to get passed-in video embed code's 'src'
 * URL. Pass to validator function to check for 'https' protocol and
 * that host name contains trusted source name from passed-on array.
 * Only continue if function doesn't return null. Set 'src' attribute
 * to validated URL.
 * 
 * Check URL's source/domain and set 'title' attribute accordingly
 * using passed-in video title.
 * 
 * Create iframe element and set attributes from object.
 * 
 * Return null if passed an empty string for embedCode.
 * Return null if embedCode's 'src' URL fails validation.
 * Otherwise return new iframe element.
 * 
 * @param {string} embedCode - Video embed code from Google Sheets custom CMS data.
 * @param {string} titleString - Video title from Google Sheets custom CMS data.
 * @param {Array.<string>} sourceArray - Array of trusted source names to be passed to validator function.
 * @returns {HTMLElement | null} - Newly created iframe element or null.
 */
function createVideoEmbed(embedCode, titleString, sourceArray) {
    const attributes = {
        'class': '',
        'src': '',
        'title': '',
        'frameborder': '0',
        'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        'referrerpolicy': 'strict-origin-when-cross-origin',
        'loading': 'lazy',
        'allowfullscreen': 'true'
    };
    let embedUrl;

    if (embedCode) {
        /* Use regular expression and match() method to
           extract URL from embed code */
        const urlRegex = /(https?:\/\/[^ ]*)/gi;
        embedUrl = embedCode.match(urlRegex)[0];
        /* Only continue if extracted URL is valid 'https' URL
           and appears to come from a trusted domain */
        if (isValidUrl(embedUrl, 'https:', sourceArray)) {
            attributes.src = embedUrl

            if (embedUrl.includes('youtu')) {
                attributes.title = `YouTube video player - ${titleString}`;
            } else if (embedUrl.includes('vimeo')) {
                attributes.title = `vimeo-player - ${titleString}`;
            } else if (embedUrl.includes('dailymotion')) {
                attributes.title = `Dailymotion Video Player - ${titleString}`;
            } else {
                attributes.title = `Embedded Video Player - ${titleString}`;
            }

            embedCode = document.createElement('iframe');
            for (let key in attributes) {
                embedCode.setAttribute(key, attributes[key]);
            }

            return embedCode;
        } else return null;
    } else return null;
}

//  Useful Links page: Websites section

/**
 * Check for custom error message from Google Apps Script endpoint
 * (will be present if sheet missing/mis-named). If present, call
 * sheetErrorBackup() function, with passed-in 'section' element,
 * relevant sheet name and error message as parameters, in order to
 * display backup content.
 * 
 * If no error message, for each object in passed-in Google Sheet data
 * array:
 * 
 * - Get all string values. Check each 'required' value is not an
 * empty string/null/etc. If any have no value, ignore this object
 * and move on to next object in data array.
 * 
 * - Pass link URL to validator function to check for 'https'
 * protocol. Function will either return a new URL object or null. If
 * null, again skip this object.
 * 
 * - Create required container elements, adding Bootstrap and other
 * classes for formatting/styling.
 * 
 * - Format/sanitise all non-URL string values using
 * formatStringForHtml() function.
 * 
 * - Pass link URL and aria-label string consisting of website name
 * to createExternalLinkElement() function in order to create link
 * element. As website name ('siteName') is only used as 'aria-label'
 * attribute, no need for formatting/sanitising. Get 'hostname' property
 * from URL object returned by validator function, splitting it in order
 * to form link text string. Add link text to link element.
 * 
 * - Having added all newly created elements in order to an outer
 * container, (structured to match backup content in DOM), add outer
 * container to passed-in 'section' element.
 * 
 * If 'section' element ends up with no content, (i.e. no valid data
 * passed in), pass to sheetErrorBackup() function with relevant sheet
 * name in order to display backup content.
 * 
 * @param {HTMLElement} section - Containing div element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateWebLinks(section, data) {
    if (data.error) {
        sheetErrorBackup(section, 'Site Links Form Data', data.error);
    } else {
        for (let obj of data) {
            let description = obj.linkdescription;
            const url = obj.linkurl;
            const siteName = obj.websitename;

            /* The following conditional statement is to safeguard
               against missing cells in Google Sheets CMS data - i.e.
               only continue if required fields were filled out in
               linked Google Form */
            if (description && url && siteName) {
                // Only continue if link URL is valid 'https' URL
                const newUrl = isValidUrl(url, 'https:');
                if (newUrl) {
                    // Outer container
                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.classList.add('useful-link-wrapper', 'text-center', 'mb-4');
                    // Link description element
                    const descriptionParag = document.createElement('p');
                    description = formatStringForHtml(description);
                    descriptionParag.innerHTML = description;
                    // Link element and link text
                    const containerParag = document.createElement('p');
                    const newLink = createExternalLinkElement(url, siteName);
                    const hostnameArray = newUrl.hostname.split('.');
                    let text = `${hostnameArray[1]}.${hostnameArray[2]}`;
                    if (hostnameArray.length > 3) {
                        text = `${hostnameArray[1]}.${hostnameArray[2]}.${hostnameArray[3]}`;
                    }
                    newLink.innerHTML = text;
                    if (text.length > 28) {
                        newLink.classList.add('longstring');
                    }
                    if (text.length >= 32) {
                        newLink.classList.add('x-longstring');
                    }
                    containerParag.appendChild(newLink);

                    wrapperDiv.appendChild(descriptionParag);
                    wrapperDiv.appendChild(containerParag);
                    section.appendChild(wrapperDiv);
                }
            }
        }
        if (!section.innerHTML) {
            sheetErrorBackup(section, 'Site Links Form Data');
        }
    }
}

// Useful Links page: cookie consent (embedded videos)

/**
 * Get passed-in section element's parent 'main' element, 'backup
 * content' section, loading screen and dynamically populated 'Videos'
 * and 'Websites' sections.
 * 
 * Delete all content from dynamically populated sections. Hide
 * backup content if not already hidden. Display loading screen. Pass
 * 'main' element to handleMorePageContent() function in order to
 * repopulate page based on new cookie consent settings.
 * 
 * @param {HTMLElement} section - 'Useful Links' section element.
 */
function handleUsefulLinksEmbContPermission (section) {
    const main = section.closest('main');
    const backupContent = section.querySelectorAll('.backup-content');
    const loadScreen = section.querySelector('.loadscreen');
    const videoSection = section.querySelector('#video-links-content');
    const webSection = section.querySelector('#website-links-content');

    videoSection.innerHTML = '';
    webSection.innerHTML = '';
    for (let backup of backupContent) {
        backup.classList.add('bc-hidden');
    }
    loadScreen.classList.remove('loader-hidden', 'loader-gone');
    handleMorePageContent(main);
}

// Further Reading page

/**
 * Check for custom error message from Google Apps Script endpoint
 * (will be present if sheet missing/mis-named). If present, call
 * sheetErrorBackup() function, with passed-in 'section' element,
 * relevant sheet name and error message as parameters, in order to
 * display backup content.
 * 
 * If no error message, for each object in passed-in Google Sheet data
 * array:
 * 
 * - Get all string values. Check each 'required' value is not an
 * empty string/null/etc. If any have no value, ignore this object
 * and move on to next object in data array.
 * 
 * - Pass primary link URL to validator function to check for 'https'
 * protocol. If function returns null, again skip this object.
 * 
 * - Create required container elements, adding Bootstrap and other
 * classes for formatting/styling.
 * 
 * - Format/sanitise all non-URL string values using
 * formatStringForHtml() function, withholding any required for
 * 'aria-label'/'title' attributes until after use for that purpose.
 * 
 * - Pass validated primary url and aria-label string consisting of
 * original link text to createExternalLink() function in order to
 * create link element. Add formatted/sanitised link text to link
 * element.
 *  
 * - If secondary link URL and by implication, secondary URL text,
 * (neither 'required') are not empty strings/null, validate secondary
 * link URL, only continuing if validator function doesn't return null.
 * Clone primary link container element and its children in order to
 * create secondary link container. Pass validated secondary url and
 * aria-label string consisting of original secondary link text to
 * createExternalLink() function in order to create secondary link
 * element. Add formatted/sanitised secondary link text. Remove
 * original link element from cloned node and replace with secondary
 * link element.
 * 
 * - Having added all newly created elements in order to an outer
 * container, (structured to match backup content in DOM), add outer
 * container to passed-in 'section' element.
 * 
 * If 'section' element ends up with no content, (i.e. no valid data
 * passed in), pass to sheetErrorBackup() function with relevant sheet
 * name in order to display backup content.
 *   
 * @param {HTMLElement} section - Containing div element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateFurtherReading(section, data) {
    if (data.error) {
        sheetErrorBackup(section, 'FR Form Data', data.error);
    } else {
        for (let obj of data) {
            let headline = obj.articleheadline;
            let subhead = obj.articlesubheading;
            let summary = obj.articlesummary;
            const primaryUrl = obj.articlelink;
            let primaryLinkText = obj.articlelinktext;
            let author = obj.author;
            let publication = obj.publication;
            let pubDate = obj.publicationdate;
            const secondaryUrl = obj.secondarylink;
            let secondaryLinkText = obj.secondarylinktext;

            /* The following conditional statement is to safeguard
               against missing cells in Google Sheets CMS data - i.e.
               only continue if required fields were filled out in
               linked Google Form */
            if (headline && summary && primaryUrl && primaryLinkText) {
                // Only continue if primary link URL is valid 'https' URL
                if (isValidUrl(primaryUrl, 'https:')) {
                    // Outer container
                    const wrapperRow = document.createElement('div');
                    wrapperRow.classList.add('row');
                    const wrapperCol = document.createElement('div');
                    wrapperCol.classList.add('col-12', 'fr-art', 'mb-4');

                    // Article headline element
                    const headWrapper = document.createElement('div');
                    headWrapper.classList.add('fr-art-headline');
                    const headlineEl = document.createElement('h3');
                    headlineEl.classList.add('h4');
                    headline = formatStringForHtml(headline);
                    headlineEl.innerHTML = headline;
                    headWrapper.appendChild(headlineEl);
                    wrapperCol.appendChild(headWrapper);

                    // Article subheading element
                    if (subhead) {
                        subhead = formatStringForHtml(subhead);
                        const subHeadWrapper = document.createElement('div');
                        subHeadWrapper.classList.add('fr-art-subhead');
                        subHeadWrapper.innerHTML = `<p>${subhead}</p>`;
                        wrapperCol.appendChild(subHeadWrapper);
                    }

                    // Author & publication details element
                    if (author || publication || pubDate) {
                        const authorPubWrapper = document.createElement('div');
                        authorPubWrapper.classList.add('fr-art-auth-pub');
                        const authPubPrg = document.createElement('p');
                        if (author) {
                            author = formatStringForHtml(author);
                            const authorSpan = document.createElement('span');
                            authorSpan.classList.add('fr-art-author');
                            authorSpan.innerHTML = author;
                            authPubPrg.textContent = 'by ';
                            authPubPrg.appendChild(authorSpan);
                        }
                        if (publication) {
                            publication = formatStringForHtml(publication);
                            const pubSpan = document.createElement('span');
                            pubSpan.classList.add('fr-art-publication');
                            pubSpan.innerHTML = ` &#45; ${publication}`;
                            authPubPrg.appendChild(pubSpan);
                        }
                        if (pubDate) {
                            pubDate = formatStringForHtml(pubDate);
                            const pubDateSpan = document.createElement('span');
                            pubDateSpan.innerHTML = ` &#45; ${pubDate}`;
                            authPubPrg.appendChild(pubDateSpan);
                        }
                        authorPubWrapper.appendChild(authPubPrg);
                        wrapperCol.appendChild(authorPubWrapper);
                    }

                    // Article summary element
                    const summaryWrapper = document.createElement('div');
                    summaryWrapper.classList.add('fr-art-summary');
                    summary = formatStringForHtml(summary);
                    summaryWrapper.innerHTML = `<p>${summary}</p>`;
                    wrapperCol.appendChild(summaryWrapper);
                    
                    // Primary link element
                    const articleLinkWrapper = document.createElement('div');
                    articleLinkWrapper.classList.add('fr-art-link');
                    const articleLinkPrg = document.createElement('p');
                    const primaryLink = createExternalLinkElement(primaryUrl, primaryLinkText);
                    primaryLinkText = formatStringForHtml(primaryLinkText);
                    primaryLink.innerHTML = primaryLinkText;
                    articleLinkPrg.appendChild(primaryLink);
                    articleLinkWrapper.appendChild(articleLinkPrg);
                    wrapperCol.appendChild(articleLinkWrapper);

                    // Secondary link element
                    if (secondaryUrl) {
                        // Secondary link requires link text
                        if (secondaryLinkText) {
                            /* Only create secondary link if secondary
                               URL is valid 'https' URL */
                            if (isValidUrl(secondaryUrl, 'https:')) {
                                const altLinkWrapper = articleLinkWrapper.cloneNode(true);
                                const secondaryLink = createExternalLinkElement(secondaryUrl, secondaryLinkText);
                                secondaryLinkText = formatStringForHtml(secondaryLinkText);
                                secondaryLink.innerHTML = secondaryLinkText;
                                altLinkWrapper.firstElementChild.firstElementChild.remove();
                                altLinkWrapper.firstElementChild.appendChild(secondaryLink);
                                wrapperCol.appendChild(altLinkWrapper);
                            }
                        }
                    }

                    wrapperRow.appendChild(wrapperCol);
                    section.appendChild(wrapperRow);
                }
            }
        }
        if (!section.innerHTML) {
            sheetErrorBackup(section, 'FR Form Data');
        }
    }
}

// Google Sheets error handler

/**
 * Display console error message relevant to type of Google Sheets
 * error that called this function, incorporating passed-in sheet
 * name and passed-in custom error message if present.
 * 
 * Using passed-in 'section' element as reference, get backup content
 * container with nextElementSibling method, removing 'hidden' class
 * name in order to display it in DOM. Call function to hide loading
 * screen.
 * 
 * @param {HTMLElement} section - Containing div element for dynamically populated content. 
 * @param {string} sheetName - Name of sheet from Google spreadsheet that is causing error.
 * @param {string} noSheet - Custom error message from Google Apps Script endpoint (optional).
 */
 function sheetErrorBackup(section, sheetName, noSheet) {
    let errorMsg;
    if (noSheet) {
        errorMsg = `Error! ${noSheet} (${sheetName}). Displaying backup content.`;
    } else {
        errorMsg = `Error! No valid data in sheet. (${sheetName}). Displaying backup content.`;
    }
    console.error(errorMsg);

    const backupContent = section.nextElementSibling;
    // If backup content contains embedded video, pass to handler
    if (backupContent.classList.contains('video-links-backup'))
        handleBackupEmbVidCookiePermission(backupContent);

    backupContent.classList.remove('bc-hidden');
    hideLoadingScreen();
}

// Handle backup embedded videos based on cookie consent

/**
 * Get all 'useful link' sections from passed-in container element.
 * Get each section's heading element and embedded video wrapper
 * element.
 * 
 * Check for embedded content cookies permission setting. If embedded
 * video wrapper exists and if cookie consent given, render embedded
 * video HTML based on heading element's text content. If consent not
 * given, delete embedded video HTML (and thus any associated cookies,
 * local storage, etc).
 * 
 * @param {HTMLElement} backupContent - Element containing backup content for 'Videos' section of 'Useful Links' page which may contain embedded videos.
 */
function handleBackupEmbVidCookiePermission(backupContent) {
    const videoLinksSections = backupContent.querySelectorAll('.useful-link-wrapper');
    
    for (let section of videoLinksSections) {
        const title = section.querySelector('h4');
        const videoEmbedWrap = section.querySelector('.useful-links-video-wrapper');
        let embContCookiePermission;

        if (clearCookieHWD.consentSettingsStored())
            embContCookiePermission = clearCookieHWD.getUserConsentSettings().consent['embedded-content'];

        if (videoEmbedWrap) {
            if (embContCookiePermission) {
                if (title.innerText.includes('INPP'))
                    videoEmbedWrap.innerHTML = `<div class="useful-links-video embed-responsive embed-responsive-16by9">\
                                                    <iframe class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/p9ZJheYZazs?si=zeImtp_cLeSsM2Q0" title="YouTube video player - Can you help my Child? by Sally Goddard" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" loading="lazy" allowfullscreen></iframe>\
                                                </div>`;
                else if (title.innerText.includes('Molly Wright'))
                    videoEmbedWrap.innerHTML = `<div class="useful-links-video embed-responsive embed-responsive-16by9">\
                                                    <iframe class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/aISXCw0Pi94?si=B5kTOL6bbxTVE0Is" title="YouTube video player - Molly Wright: How every Child Can Thrive by Five - TED" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" loading="lazy" allowfullscreen></iframe>\
                                                </div>`;
            } else videoEmbedWrap.innerHTML = '';
        }
    }
}

// Hide loading screen

/**
 * Get loading screen element from DOM and add styling class to
 * reduce height to 0 in order to facilitate smooth transition on
 * hide.
 * 
 * Set 'aria-hidden' attribute to 'true' and after 1 second,
 * (transition is set to 0.5s), add class to set display to 'none'
 * in order to remove it from page layout.
 */
function hideLoadingScreen() {
    const loadScreen = document.querySelector('.loadscreen');
    loadScreen.classList.add('loader-hidden');
    loadScreen.setAttribute('aria-hidden', 'true');
    setTimeout (() => loadScreen.classList.add('loader-gone'), 1000);
}

// Format text string for use as HTML content

/**
 * Takes a passed-in string of raw text (e.g. user submitted via
 * form or fetched from API) and applies chained replace() methods
 * with globally tagged RegEx literals in order to:
 * replace special/unicode characters with HTML entities;
 * replace any plain-text version of site owner's name with proper
 * accented version using 'eacute' HTML entity;
 * replace line breaks with closing/opening 'p' tags;
 * remove any empty 'p' tags that might cause unwanted vertical
 * indentation.
 * 
 * This provides any calling function with a properly formatted
 * string, which can be inserted (between 'p' tags if necessary) in
 * a string template literal, for use as innerHTML when dynamically
 * populating the DOM, ensuring consistent cross-browser
 * display/readability.
 *  
 * Also, by replacing special characters, (particularly angle
 * brackets), it provides an initial layer of code sanitisation,
 * helping to prevent XSS vulnerabilities (e.g. malicious script tag
 * insertion) particular to the use of innerHTML.
 *  
 * @param {string} paramString - String to be formatted.
 * @returns {string} newString - Formatted string ready for use as innerHTML.
 */
function formatStringForHtml(paramString) {
    const newString = paramString.replace(/&/g, '&#38;')
                                 .replace(/!/g, '&#33;')
                                 .replace(/"/g, '&#34;')
                                 .replace(/\$/g, '&#36;')
                                 .replace(/%/g, '&#37;')
                                 .replace(/\(/g, '&#40;')
                                 .replace(/\)/g, '&#41;')
                                 .replace(/\*/g, '&#42;')
                                 .replace(/\+/g, '&#43;')
                                 .replace(/-/g, '&#45;')
                                 .replace(/\//g, '&#47;')
                                 .replace(/:/g, '&#58;')
                                 .replace(/</g, '&#60;')
                                 .replace(/=/g, '&#61;')
                                 .replace(/>/g, '&#62;')
                                 .replace(/\?/g, '&#63;')
                                 .replace(/@/g, '&#64;')
                                 .replace(/\[/g, '&#91;')
                                 .replace(/\\/g, '&#92;')
                                 .replace(/\]/g, '&#93;')
                                 .replace(/\^/g, '&#94;')
                                 .replace(/_/g, '&#95;')
                                 .replace(/`/g, '&#96;')
                                 .replace(/\{/g, '&#123;')
                                 .replace(/\|/g, '&#124;')
                                 .replace(/\}/g, '&#125;')
                                 .replace(/~/g, '&#126;')
                                 .replace(/£/g, '&#163;')
                                 .replace(/©/g, '&#169;')
                                 .replace(/€/g, '&#8364;')
                                 .replace(/Sinead/g, 'Sin&#233;ad')
                                 .replace(/\n/g, '</p><p>')
                                 .replace(/<p><\/p>/g, '');
    return newString;
}

// URL validator function

/**
 * Construct new URL object from passed-in URL string. If valid,
 * check if protocol value matches passed-in protocol type.
 * 
 * If sources array passed in, split and recombine URL object's
 * hostname value into same form as array values, checking for exact
 * match
 * 
 * Return URL object if conditions met. Display error message to
 * console and return null if not.
 *  
 * @param {string} urlString - URL string to be validated.
 * @param {string} protocolString - Protocol type to be tested for.
 * @param {Array.<string>} sourceArray - Array of trusted source names (optional).
 * @returns {URL | null} newUrl - URL object construced from passed-in URL string or null.
 */
function isValidUrl(urlString, protocolString, sourceArray) {
    try {
        /* Passing an invalid URL string to the URL constructor
           will return a TypeError */
        const newUrl = new URL(urlString);

        /* True if protocol matches passed-in protocol type, 
           e.g. 'https:' or 'mailto:' */
        if (!(newUrl.protocol === protocolString)) {
            throw new Error(`URL does not match trusted type: ${protocolString}`);
        }

        if (sourceArray) {
            const hostnameDomainSubstrs = newUrl.hostname.split('.');
            /* True if hostname includes any trusted source name
               from passed-in array */
            if (!sourceArray.some(source => source === `${hostnameDomainSubstrs[1]}.${hostnameDomainSubstrs[2]}`)) {
                throw new Error(`URL hostname does not match any trusted sources: "${sourceArray.join('", "')}".`);
            }
        }

        return newUrl;
        
    } catch(error) {
        console.error(error.message);
        return null;
    }
}

// Create external link element

/**
 * Construct object containing: 'href' attribute with passed-in URL
 * string as value; 'target' and 'rel' attributes with values set
 * for external links (open in new tab).
 * 
 * Create new anchor element and set attributes from object.
 * 
 * If aria-label string passed in, append text, '(Opens in a new tab)'
 * and set attribute.
 * 
 * Return new anchor element.
 * 
 * @param {string} urlString - Validated URL string used to populate 'href' HTML attribute.
 * @param {string} ariaLabelString - String used to populate 'aria-label' HTML attribute (optional).
 * @returns {HTMLElement} - Newly created external hyperlink (anchor) element.
 */
function createExternalLinkElement(urlString, ariaLabelString) {
    const attributes = {
        'href': urlString,
        'target': '_blank',
        'rel': 'noopener'
    };

    const linkElement = document.createElement('a');
    for (let key in attributes) {
        linkElement.setAttribute(key, attributes[key]);
    }
    if (ariaLabelString) {
        linkElement.setAttribute('aria-label', `${ariaLabelString} (Opens in a new tab)`)
    }
    return linkElement;
}

// --- 'More' menu pages (dynamically populated) functions end

// ------------ Cookie consent banner object & methods

/* Mostly written in es5 in case compatability with Google Tag
   Manager is required. There are a few exceptions, such as
   classList methods, the 'closest' method & some unavoidable
   use of jQuery in order to deal with Bootstrap 4 modals.
   These can be corrected/replaced with polyfills if conflicts
   arise if/when it's integrated with GTM.
   This code was created while following a series of YouTube
   videos by Leon Korteweg, customising as necessary. Find part
   1 here: https://www.youtube.com/watch?v=pQdHOhRtkUg 
   Any discrepancies in naming conventions (e.g. class names)
   are mainly a result of conflicts between his & my own
   personally preferred standards. But also, to a large extent,
   inconsistency in his own naming standards, due to the fact
   that he's developed this over a number of weeks. I will fix
   this in my own code when I can. */

var clearCookieHWD = {
    // Cookie settings
    cookieName: 'clearcookiehwd',
    consentVersion: 1,
    cookieExpirationDays: 365,
    categories: [
        {
            name: 'Essential',
            required: true,
            description: 'Required for site functionality &#40;always active&#41;.'
        },
        {
            name: 'Security',
            required: false,
            description: 'Protect us from spam, fraud and abuse &#40;Google reCAPTCHA&#41;.'
        },
        {
            name: 'Performance',
            required: false,
            description: 'Optional. Help us with analytics in order to understand how visitors interact with the site &#40;used anonymously&#41;.'
        },
        {
            name: 'Embedded Content',
            required: false,
            description: 'Optional. Enables third-party services such as YouTube and Google Forms to deliver embedded content. May collect user interaction data.'
        }
    ],
    labels: {
        required: 'Required',
        accepted: 'Accepted',
        refused: 'Refused'
    },
    /* Setting (in seconds) to delay banner display if negatively
       affecting page load speed */
    bannerDisplayOnLoadDelay: 1.5,
    // Main cookie banner element
    banner: document.querySelector('#clearcookiehwd'),
    // Privacy page settings (user preferences) element
    privacyPageSettingsPanel: document.querySelector('#privacy-settings'),
    /* Banner initialisation state (to prevent adding multiple click
       handlers) */
    initHasRun: false,
    // Banner settings control panel display state
    bannerSettingsHidden: true,
    // Container object for user preferences read from cookie
    consentSettings: {},

    // Methods

    init: function() {
        /* Add identifiers to categories objects (slugified
           version of category name for use in class names,
           object keys, etc.) */
        this.addCategoryID();

        // Read user preferences from cookie if stored
        this.consentSettings = this.getUserConsentSettings();

        // Build settings controls
        if (this.banner)
            this.generateSettingsControlPanelHTML();
        
        /* Renew consent if needed. Included in case of changes made
           requiring version number to be bumped. In which case
           request user to update settings by ensuring banner is
           displayed again since previous settings erased. */
        if (this.renewConsent())
            this.eraseCookie(this.cookieName);
        
        // Show cookie banner
        if (this.banner && !this.consentSettingsStored() && !this.isOnPrivacyPage()) {
            var delayMs = this.bannerDisplayOnLoadDelay * 1000;

            setTimeout(this.showBanner.bind(this), delayMs);
        }
        
        /* Show current settings above Privacy & Cookie Policy
           (privacy page) */
        if (this.privacyPageSettingsPanel && this.isOnPrivacyPage())
            this.generatePrivacySettingsHTML();

        // Event Listeners
        if (!this.initHasRun) {
            var buttons = document.querySelectorAll('.clearcookiehwd__inner__footer button, #privacy-settings .section-footer button, .show-cookiebanner-btn');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', this.buttonClickHandler.bind(this));
            }
        }

        // Data layer call for potential GTM integration
        this.dataLayerCall('loaded');

        // Set initialisation state
        this.initHasRun = true;
    },

    renewConsent: function() {
        if (this.consentSettings && (this.consentVersion > this.consentSettings.consentVersion))
            return true;

        return false;
    },

    buttonClickHandler: function(e) {
        if(e.target.className.indexOf('accept') != -1)
            this.saveConsentSettings('accept-all');

        else if(e.target.className.indexOf('refuse') != -1)
            this.saveConsentSettings('essential-only');

        else if(e.target.className.indexOf('save') != -1)
            this.saveConsentSettings('settings');

        else if(e.target.className.indexOf('show-settings') != -1)
            this.toggleBannerSettings();

        else if(e.target.className.indexOf('hide-settings') != -1)
            this.toggleBannerSettings();

        else if(e.target.className.indexOf('show-banner') != -1) {
            var showButtons = document.querySelectorAll('.show-cookiebanner-btn');
            // Used to return focus to this button when banner closed
            for (let button of showButtons) 
                button.dataset.lastClicked = false;
            e.target.dataset.lastClicked = true;
            this.showBanner();
        }
    },

    consentSettingsStored: function() {
        if (this.readCookie(this.cookieName))
            return true;

        return false;
    },

    getUserConsentSettings: function() {
        /* Read user preferences from cookie (if stored) &
           convert from JSON string */
        var settings = JSON.parse(this.readCookie(this.cookieName));
        
        if (settings)
            return settings;
    },

    isOnPrivacyPage: function() {
        var privacyPageLink = this.banner.querySelector('.clearcookiehwd__inner__body__main a');

        if (privacyPageLink && (window.location.href.indexOf(privacyPageLink.href) != -1))
            return true;

        return false;
    },

    show: function(el) {
        el.classList.remove('clearcookiehwd--hide');
    },

    hide: function(el) {
        el.classList.add('clearcookiehwd--hide');
    },

    showBanner: function() {
        var privacyPageLink = this.banner.querySelector('.clearcookiehwd__inner__body__main a');
        var acceptBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--accept');
        var settingsBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--show-settings');
        var hideBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--hide-settings');
        var saveBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--save');
        var openBsModal = document.querySelector('.modal.show');

        // In case banner opened from inside Bootstrap modal
        if (openBsModal) {
            /* have to use jquery for Bootstrap 4.3 modal
               compatability */
            $(openBsModal).modal('hide');
            $(openBsModal).on('hidden.bs.modal', () => this.banner.focus());
        }

        this.show(this.banner);
        // Prevent scrolling of background page
        document.querySelector('body').classList.add('clearcookiehwd--active');
        // Set focus on main banner element
        this.banner.focus();
        /* Toggle link & buttons' disabled states based on visible
           panel to ensure correct focusable elements available to
           trapKeyNavFocus() function */
        if(this.bannerSettingsHidden) {
            privacyPageLink.removeAttribute('disabled');
            hideBtn.setAttribute('disabled', '');
            saveBtn.setAttribute('disabled', '');
            acceptBtn.removeAttribute('disabled');
            settingsBtn.removeAttribute('disabled');
        } else {
            privacyPageLink.setAttribute('disabled', '');
            acceptBtn.setAttribute('disabled', '');
            settingsBtn.setAttribute('disabled', '');
            hideBtn.removeAttribute('disabled');
            saveBtn.removeAttribute('disabled');
        }
        // Trap keyboard navigation focus inside banner when open
        trapKeyNavFocus(this.banner);
    },

    hideBanner: function() {
        var showBannerButton = document.querySelector('.show-cookiebanner-btn[data-last-clicked="true"]');

        this.hide(this.banner);
        // Allow scrolling of background page
        document.querySelector('body').classList.remove('clearcookiehwd--active');
        // Set focus on button that opened banner, if any
        if (showBannerButton) {
            showBannerButton.focus();
            var showBtnBsModal = showBannerButton.closest('.modal');
            // In case banner opened from inside Bootstrap modal
            if (showBtnBsModal) {
                /* have to use jquery for Bootstrap 4.3 modal
                   compatability */
                $(showBtnBsModal).modal('show');
            }
        }
    },

    toggleBannerSettings: function() {
        var mainContent = this.banner.querySelector('.clearcookiehwd__inner__body__main');
        var settingsContent = this.banner.querySelector('.clearcookiehwd__inner__body__settings');
        var privacyPageLink = this.banner.querySelector('.clearcookiehwd__inner__body__main a');
        var acceptBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--accept');
        var settingsBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--show-settings');
        var hideBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--hide-settings');
        var saveBtn = this.banner.querySelector('.clearcookiehwd__inner__footer__button--save');

        // Set focus on main banner element
        this.banner.focus();

        /* Could use ternary operators for all below but need
           to check es5 support & consider readability */
        if(this.bannerSettingsHidden) {
            /* Hide banner's main body content & show banner's
               settings body content */
            this.hide(mainContent);
            privacyPageLink.setAttribute('disabled', '');
            this.show(settingsContent);
            // Switch out buttons
            this.hide(acceptBtn);
            acceptBtn.setAttribute('disabled', '');
            this.hide(settingsBtn);
            settingsBtn.setAttribute('disabled', '');
            this.show(hideBtn);
            hideBtn.removeAttribute('disabled');
            this.show(saveBtn);
            saveBtn.removeAttribute('disabled');
        } else {
            /* Show banner's main body content & hide banner's
               settings body content */
            this.hide(settingsContent);
            this.show(mainContent);
            privacyPageLink.removeAttribute('disabled');
            // Switch out buttons
            this.hide(hideBtn);
            hideBtn.setAttribute('disabled', '');
            this.hide(saveBtn);
            saveBtn.setAttribute('disabled', '');
            this.show(acceptBtn);
            acceptBtn.removeAttribute('disabled');
            this.show(settingsBtn);
            settingsBtn.removeAttribute('disabled');
        }
        
        this.bannerSettingsHidden = !this.bannerSettingsHidden;
    },

    saveConsentSettings: function(command) {
        var consent = {};

            for (var i = 0; i < this.categories.length; i++) {
                var category = this.categories[i];

                if (command === 'settings') {
                    var setting = document.querySelector('.clearcookiehwd__inner__body__settings__setting--' + category.identifier);
                    var consentGiven = setting.querySelector('input[type=checkbox]').checked;

                    consent[category.identifier] = consentGiven;
                }
                else if (command === 'accept-all')
                    consent[category.identifier] = true;
                else if (command === 'essential-only')  
                    consent[category.identifier] = category.required || false;
            }

            this.storeConsentSettings(consent);
            // Refresh banner and privacy page settings
            this.init();
            // Data layer call for potential GTM integration
            this.dataLayerCall('save_preferences');
            // Reset page elements based on new settings
            handleCookieConsentSettingsReset();
    },

    storeConsentSettings: function(consent) {
        // Construct object
        var cookieContent = {
            consent: consent,
            consentVersion: this.consentVersion,
            consentID: this.getConsentID()
        };
        // Convert to JSON string
        cookieContent = JSON.stringify(cookieContent);
        // Store as cookie
        this.createCookie(this.cookieName, cookieContent, this.cookieExpirationDays);
        // Close banner
        this.hideBanner();
        // this.hide(this.banner);
    },

    addCategoryID: function() {
        /* Add class-name/object-key-appropriate identifier to
           each category */
        for (var i = 0; i < this.categories.length; i++) {
            var category = this.categories[i];

            category.identifier = this.slugify(category.name);
        }
    },

    generateSettingsControlPanelHTML: function() {
        var settingsWrapper = this.banner.querySelector('.clearcookiehwd__inner__body__settings');
        var settingsHTML = '';
        
        /* Generate banner settings control panel from
           'categories' array */
        for (var i=0; i < this.categories.length; i++) {
            var category = this.categories[i];

            settingsHTML += '<label class="clearcookiehwd__inner__body__settings__setting clearcookiehwd__inner__body__settings__setting--';
            settingsHTML += category.identifier;

            if (category.required )
                settingsHTML += ' clearcookiehwd__inner__body__settings__setting--required';

            settingsHTML +=' mb-0">\
                            <div class="clearcookiehwd__inner__body__settings__setting__input">';
            
            if (category.required)
                settingsHTML += '<input type="checkbox" class="accessible-hide" aria-labelledby="clearcookiehwd__setting__name--' + category.identifier + '" aria-describedby="clearcookiehwd__setting__description--' + category.identifier + '" checked disabled>';
            else if (this.consentSettingsStored() && this.consentSettings.consent[category.identifier])
                settingsHTML += '<input type="checkbox" class="accessible-hide" aria-labelledby="clearcookiehwd__setting__name--' + category.identifier + '" aria-describedby="clearcookiehwd__setting__description--' + category.identifier + '" checked>';
            else
                settingsHTML += '<input type="checkbox" class="accessible-hide" aria-labelledby="clearcookiehwd__setting__name--' + category.identifier + '" aria-describedby="clearcookiehwd__setting__description--' + category.identifier + '">';
            
            settingsHTML += '<div class="clearcookiehwd__inner__body__settings__setting__input__toggle"></div>\
                            </div>\
                            <div class="clearcookiehwd__inner__body__settings__setting__name">\
                                <p id="clearcookiehwd__setting__name--' + category.identifier + '" class="mb-0"><strong>' + category.name + '</strong></p>\
                            </div>\
                            <div class="clearcookiehwd__inner__body__settings__setting__description">\
                                <p id="clearcookiehwd__setting__description--' + category.identifier + '" class="mb-0">' + category.description + '</p>\
                            </div>\
                        </label>';
        }
        // Render control panel
        settingsWrapper.innerHTML = settingsHTML;
    },

    generatePrivacySettingsHTML: function() {
        var settingsMain = this.privacyPageSettingsPanel.querySelector('.section-content');
        var settingsFooterBtn = this.privacyPageSettingsPanel.querySelector('.section-footer button');

        if (this.consentSettingsStored()) {
            /* Generate user's consent settings table from
               'consentSettings' data and 'categories' array */
            var mainHTML = '<table class="clearcookiehwd-settings__body__table">\
                                <tbody>';

            for (var i = 0; i < this.categories.length; i++) {
                var category = this.categories[i];
                var isRequired = category.required;
                var isAccepted = this.consentSettings.consent[category.identifier];
                var status = '';

                if (isRequired)
                    status = 'required';
                else if (isAccepted)
                    status = 'accepted';
                else
                    status = 'refused';

                mainHTML += '<tr class="clearcookiehwd-settings__body__table__row">';
                mainHTML += '<td class="clearcookiehwd-settings__body__table__row__td" colspan="100%">\
                                <p class="clearcookiehwd-settings__body__table__row__td--name mb-0">\
                                    <strong>' + category.name + '</strong>\
                                </p>\
                            </td>\
                        </tr>';
                mainHTML += '<tr class="clearcookiehwd-settings__body__table__row">\
                                <td class="clearcookiehwd-settings__body__table__row__td">\
                                    <p class="clearcookiehwd-settings__body__table__row__td--description mb-0">' + category.description + '</p>\
                            </td>';
                mainHTML += '<td class="clearcookiehwd-settings__body__table__row__td__consent-status clearcookiehwd-settings__body__table__row__td__consent-status--';
                mainHTML += status + '">\
                                    <p class="mb-0">' + this.labels[status] + '</p>\
                                </td>';
                mainHTML += '</tr>';
            }

            mainHTML += '</tbody>\
                    </table>';
            
            mainHTML += '<p class="clearcookiehwd-settings__body__consent-id mb-0">Your consent ID is&#58; <strong>' + this.consentSettings.consentID + '</strong></p>';
            // Render user's consent settings
            settingsMain.innerHTML = mainHTML;
            // Change button text
            settingsFooterBtn.innerHTML = 'Change Settings';
        } else {
            // Render 'no preferences' message
            settingsMain.innerHTML = '<p class="clearcookiehwd-settings__body__unset mb-0">\
                <strong>No preferences set.</strong> Please set your cookie preferences to continue using our website.\
            </p>';
            // Change button text
            settingsFooterBtn.innerHTML = 'Manage Settings';
        }
        // Unhide element
        this.show(this.privacyPageSettingsPanel);
    },

    getConsentID: function() {
        var timestamp = Date.now();
        var random = Math.floor(Math.random() * 100000000000);

        return timestamp + '-' + random;
    },

    /* Cookie scripts from https://www.quirksmode.org/js/cookies.html
       Using cookie rather than local storage is so that cookie
       settings can be read by a server if necessary. Code adapted to
       fit 'Object > Method' structure. */

    createCookie: function(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    },

    readCookie: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },

    eraseCookie: function(name) {
        this.createCookie(name,"",-1);
    },

    slugify: function (input) {
        /* Got this handy little function from Jason Watmore here:
           https://jasonwatmore.com/vanilla-js-slugify-a-string-in-javascript */
        if (!input)
            return '';

        // make lower case and trim
        var slug = input.toLowerCase().trim();
        // remove accents from charaters
        slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        // replace invalid chars with spaces
        slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();
        // replace multiple spaces or hyphens with a single hyphen
        slug = slug.replace(/[\s-]+/g, '-');

        return slug;
    },

    dataLayerCall: function(eventName) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'clearcookiehwd_' + eventName,
            'clearcookiehwd_preferences': this.consentSettings
        });
    }

};

// ---------- Cookie consent banner object & methods end

// ------------------- Miscellaneous functions

// Trapping focus inside elements for keyboard navigation accessibility (e.g. modals)

/**
 * Add 'keydown' event listener to passed-in element & call handler
 * function.
 * 
 * @param {HTMLElement} element - Element (modal, etc) in which focus is to be trapped
 */
function trapKeyNavFocus(element) {
    /* Remove any instances of this event listener that may have been
       previously added to same element */
    element.removeEventListener('keydown', trapKeyNavFocusHandler);
    // Add fresh event listener
    element.addEventListener('keydown', trapKeyNavFocusHandler);
}

/**
 * Set conditional variable to check if key pressed is tab key
 * (signifying keyboard navigation). If not, exit function.
 * 
 * Set variable representing main parent/container element.
 * 
 * On each tab key press, get all focusable elements within parent
 * element and find the first and last. If currently active element
 * is first in the list on 'shift + tab' (backward navigation), set
 * focus to the last. Vice-versa on 'tab' (forward navigation).
 * 
 * @param {KeyboardEvent} e - 'keydown' event object
 * @returns {void} exit function if key tab key not pressed
 */
function trapKeyNavFocusHandler(e) {
    let isTabPressed = (e.key === 'Tab');

    if (!isTabPressed) { 
        return;
    }
    
    let focusTrap;

    if (e.target.classList.contains('.focus-trap')) {
        focusTrap = e.target;
    } else {
        focusTrap = e.target.closest('.focus-trap');
    }

    const focusableEls = focusTrap.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="email"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');

    const firstFocusableEl = focusableEls[0];  
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
    // Shift + Tab
        if ((document.activeElement === firstFocusableEl) || (document.activeElement === focusTrap)) {
            lastFocusableEl.focus();
            e.preventDefault();
        }
    } else {
    // Tab
        if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
        }
    }
}

// Applying 'active' class to navigation links when associated page section in view

/**
 * Find link element in passed-in navigation link node list that has
 * the passed-in 'active' class, if any, and set as default 'active'
 * link.
 * 
 * Add 'scroll' event listener to window. On scroll event:
 * 
 * For each section element in passed-in section elements node list,
 * get its height and its offsetTop property (distance in pixels from
 * top of element to top of closest offset parent element, in this
 * case 'body');
 * 
 * When scrolled window's Y coordinate + height of fixed page header
 * is greater than or equal to section element's offsetTop - 1/3 of
 * section element's height, (i.e. 1/3 of section visible below header),
 * set section element's id attribute as 'current' section id;
 * 
 * Remove 'active' class from each navigation link, check its href
 * attribute for the 'current' section id (i.e  whether or not it
 * links to 'current' section) and set as 'active' link if matching.
 * If no 'current' section id (undefined), set default 'active' link
 * as 'active link;
 * 
 * Add 'active' class to 'active' link. 
 * 
 * @param {NodeList} navLinkEls - Navigation link elements that could potentially be subject to style change on scroll event.
 * @param {NodeList} LinkedSectionEls - Section elements associated with navigation links.
 * @param {string} activeClass - Class name that applies CSS styles to link elements deemed 'active'.
 */
function handleActiveLinkStyleOnScroll(navLinkEls, linkedSectionEls, activeClass) {
    let defaultActiveLink;

    for (let link of navLinkEls) {
        if (link.classList.contains(activeClass)) {
            defaultActiveLink = link;
        }
    }

    window.addEventListener('scroll', () => {
        let currentSectionId;
        let activeLink;

        for (let linkedSection of linkedSectionEls) {
            const sectionTop = linkedSection.offsetTop;
            const sectionHeight = linkedSection.clientHeight;
            // On smaller screens (width <= 768px), page header is 140px high
            if (window.innerWidth <= 768) {   
                if ((scrollY + 140) >= (sectionTop - (sectionHeight / 3))) {
                    currentSectionId = linkedSection.id
                }
            // On larger screens, page header is 207px high
            } else {
                if ((scrollY + 207) >= (sectionTop - (sectionHeight / 3))) {
                    currentSectionId = linkedSection.id
                }
            }
            
        }

        for (let link of navLinkEls) {
            if (link.classList.contains(activeClass)) {
                link.classList.remove(activeClass);
            }
            
            if (link.href.includes(`#${currentSectionId}`)) {
                activeLink = link;
            } else if (!currentSectionId){
                activeLink = defaultActiveLink;
            }
        }

        activeLink.classList.add(activeClass);
    });

}

/* Reset page elements (create/delete) that require cookie consent when
   consent settings saved */

/**
 * Get all elements from the page containing elements that require
 * user's consent for use of cookies. If found, check each for
 * class name or id indicating type of cookie used and pass to
 * relevant handler function.
 */
function handleCookieConsentSettingsReset() {
    const consentReqdEls = document.querySelectorAll('.consent-reqd');

    if (consentReqdEls.length > 0) {
        for (let el of consentReqdEls) {
            if (el.classList.contains('contact-form')) {
                handleContactFormSecurityPermission(el);
            } else if (el.id === 'questionnaire') {
                handleQuestionnaireEmbContPermission(el);
            } else if (el.id === 'useful-links') {
                handleUsefulLinksEmbContPermission(el);
            }
        }
    }
}

// Throttling

/**
 * When called on an event listener's handler function, returns a
 * new event listener after a passed-in time interval, thus
 * preventing further events from firing until interval has elapsed.
 * 
 * @param {function} handler - Event handler function to be throttled.
 * @param {number} interval - Time allowed in ms between events firing. 
 * @returns {function} throttledFunction - Handler function with throttling interval applied.
 */
 function throttleEvent(handler, interval) {
    /* Boolean to control when time interval has passed.
       Set to true so that handler can be called first time. */
    let enableEvent = true;

    /* Nested function to preserve throttleEvent function's 'this'
       (execution) context and apply it to passed-in handler
       (callback) function.
       Uses rest parameter syntax (...) to pack handler's arguments
       into an array which can be read by 'apply' method. */
    return function throttledFunction(...args) {
        /* If time interval not up, exit function without calling
           handler */
        if (!enableEvent) return;
        // Prevent handler being called until interval has passed
        enableEvent = false;
        /* Apply throttling to handler and return throttled version
           with any arguments */
        handler.apply(this, args);
        // Set control flag to true after passed-in interval
        setTimeout(() => enableEvent = true, interval);
    }
}

// 'Back to Top' links

/**
 * Handle 'Back to Top' links without adding '#' to the URL or history.
 * 
 * Add 'click' event listener to passed-in anchor element. On click,
 * prevent default behaviour and smoothly scroll viewport window to
 * top and left of page.
 * 
 * @param {HTMLElement} link - Anchor element linking to top of page
 */
function handleBackToTopLink(link) {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
}

// ----------------- Miscellaneous functions end