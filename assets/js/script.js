// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // --------------------- EmailJS

    // ------------ Initialise EmailJs service

    (function(){
        emailjs.init({
          publicKey: "7csZIXHjvuV0I0E82",
        });
     })();

    //  ------------------ Contact forms

    /* Get contact form(s) from the page and if found, pass to handler
       function */

    const contactForms = document.querySelectorAll('.contact-form');

    if (contactForms.length > 0) {
        for (let form of contactForms) {
            handleContactFormEmailJS(form);
        }
    }

    // -------------------- Main menu

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

    // ------------------ 'More' page

    /* Get 'More' page's <main> element and if found, pass to handler
       function for content to be dynamically populated from Google Sheets */

    const moreMain = document.querySelector('#more-main');

    if (moreMain) {
        handleMorePageContent(moreMain);
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
 * div elements and submit button's container div element.
 * 
 * Add 'submit' event listener to passed-in form element.
 * 
 * On submit, set template parameters object to be passed to EmailJS
 * send() method with keys matching EmailJS template variable names
 * and values populated from corresponding field in form element.
 * 
 * Call send() method to submit form details to EmailJS, passing in
 * EmailJS service ID, EmailJS template ID and template parameters
 * object, then await response. On 'success' response, display
 * 'success' message and hide submit button. On 'error' response,
 * display 'failure' message and hide submit button. Change each
 * element's 'aria-hidden' attribute accordingly.
 * 
 * @param {HTMLElement} contactForm - Contact form from 'Contact Us' page or footer email modal: form element.
 */
function handleContactFormEmailJS(contactForm) {
    const successMsg = contactForm.querySelector('.cf-success-message');
    const failureMsg = contactForm.querySelector('.cf-failure-message');
    const submitBtnSection = contactForm.querySelector('.contact-btn-wrapper');

    contactForm.addEventListener('submit', (e) => {
        // Prevent page from refreshing on form submit
        e.preventDefault();
        // Set parameters to be sent to EmailJS template
        // **Key values MUST match variable names in EmailJS template
        let templateParams = {
            'first_name': contactForm.firstname.value,
            'last_name': contactForm.surname.value,
            'email_addr': contactForm.email.value,
            'phone_no': contactForm.phone.value,
            'message': contactForm.message.value,
        }
        // Call EmailJS send() method to submit form
        emailjs.send('gmail_mhcp', 'contact-form', templateParams).then(
            (response) => {
              console.log('SUCCESS!', response.status, response.text);
              submitBtnSection.classList.add('cf-hidden');
              submitBtnSection.setAttribute('aria-hidden', true);
              successMsg.classList.remove('cf-hidden');
              successMsg.setAttribute('aria-hidden', false);
            },
            (error) => {
              console.log('FAILED...', error);
              submitBtnSection.classList.add('cf-hidden');
              submitBtnSection.setAttribute('aria-hidden', true);
              failureMsg.classList.remove('cf-hidden');
              failureMsg.setAttribute('aria-hidden', false);
            },
        );
    });
}

// ------------- Contact Forms & EmailJS functions end

// ---------- 'More' page (dynamically populated) functions

/**
 * Get each div element to be dynamically populated from passed-in
 * 'main' element.
 * 
 * Fetch custom Google Forms / Google Sheets CMS data from custom
 * Google Apps Script endpoint, handling any errors in a try-catch
 * block. Get each data object array (Google Sheets data) from
 * fetch response JSON object.
 * 
 * Pass each div to be populated, along with corresponding data
 * object array, to their respective handler functions. If any
 * errors thrown, display backup content from DOM instead.
 * 
 * @param {HTMLElement} moreMain - 'More' page's 'main' element.
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
        // Check for custom error message from endpoint
        const sheetKeys = Object.keys(spreadsheetData);
        for (let key of sheetKeys) {
            if (spreadsheetData[key].error) {
                throw new Error(`Error: ${spreadsheetData[key].error} (${key})`);
            }
        }
        /* Break fetched Google Sheets spreadsheet data object down
           into object arrays consisting of individual sheet data */
        const testimonialsData = spreadsheetData.testimonialsformdata;
        const videoLinksData = spreadsheetData.videolinksformdata;
        const webLinksData = spreadsheetData.sitelinksformdata;
        const readingData = spreadsheetData.frformdata;
        // Call handler functions to populate page
        populateTestimonials(testimonialSection, testimonialsData);
        populateVideoLinks(videoLinksSection, videoLinksData);
        populateWebLinks(webLinksSection, webLinksData);
        populateFurtherReading(furtherReadingSection, readingData);
    } catch (error) {
        console.error(error.message);
        // Display backup content in case of error
        const backupContent = document.querySelectorAll('.backup-content');
        for (let backup of backupContent) {
            backup.classList.remove('bc-hidden');
            backup.setAttribute('aria-hidden', false);
        }
    }
}

// Client testimonials section

/**
 * For each object in passed-in Google Sheet data array, get
 * 'clientname' and 'clienttestimonial' string values. Check
 * each is not an empty string (or 'null', etc). If 'clientname'
 * has no value, assign 'Anonymous' as name value. If
 * 'clientteatimonial' has no value, ignore this object and
 * move on to next object in data array.
 * 
 * Format and sanitise name and testimonial string values using
 * formatStringForHtml() function.
 * 
 * Create elements for each data array object (structured to
 * match backup content in DOM) and append to passed-in 'section'
 * element.
 * 
 * @param {HTMLElement} section - Containing 'div' element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateTestimonials(section, data) {
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

            const testimonialDiv = document.createElement('div');
            testimonialDiv.classList.add('col-12', 'col-md-4', 'mb-3');

            const quoteDiv = document.createElement('div');
            quoteDiv.classList.add('testimonial-quote');
            quoteDiv.innerHTML = `<p>&#34;${quote}&#34;</p>`

            const nameDiv = document.createElement('div');
            nameDiv.classList.add('testimonial-name');
            nameDiv.innerHTML = `<p>&#45; ${name}</p>`;

            testimonialDiv.append(quoteDiv, nameDiv);
            section.append(testimonialDiv);
        }
    }
}

// Useful Links: Videos section

/**
 * Construct array of trusted video source names.
 * 
 * For each object in passed-in Google Sheet data array, get all
 * string values. Check each 'required' value is not an empty
 * string (or 'null', etc). If any have no value, ignore this object
 * and move on to next object in data array.
 * 
 * Pass video URL to validator functions to check for 'https'
 * protocol and that host name contains trusted source name from
 * 'sources' array. If neither return true, again skip this object.
 * 
 * Create main container div and heading elements, adding classes
 * for styling. Format and sanitise video title and description
 * string values using formatStringForHtml() function. Pass video
 * URL and aria-label string constructed of video title and URL text
 * to createExternalLinkElement() function in order to create primary
 * video link element. Add formatted/sanitised video title as link
 * text and add primary video link element to heading. Add heading
 * to main container div.
 * 
 * Create container div element for video description. Add
 * formatted/sanitised video description to container div as string
 * template literal with 'p' element wrapper. Add description to main
 * container div.
 * 
 * Pass video embed code with video title and 'sources' array to
 * createVideoEmbed() function in attempt to create embedded video
 * iframe element. If video embed code (not 'required') is an empty
 * string/null or contains an invalid 'src' URL, function will
 * return null. If iframe element returned, add Bootstrap responsive
 * embed class.
 * 
 * Create embedded video container div and iframe container div
 * elements, adding classes for Bootstrap responsive embed and
 * styling. Add iframe element to iframe container div and iframe
 * container to video container div. Add video container to main
 * container div.
 * 
 * Create container paragraph element for second primary video link.
 * Format/sanitise video URL text, clone original primary link
 * element and add URL text. Add new primary video link element to
 * container paragraph. Add container paragraph element to main
 * container.
 * 
 * If secondary video URL and by implication, secondary URL text,
 * (neither 'required') are not empty strings/null, pass secondary
 * video URL and required parameters to validator functions. Only
 * continue if both return true. Repeat previous steps to create
 * secondary/alternative video link element and add to main container.
 * 
 * Add main container to passed-in 'section' element.
 * 
 * @param {HTMLElement} section - Containing 'div' element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateVideoLinks(section, data) {
    const sources = ['YouTube', 'youtu.be', 'Amazon', 'primevideo', 'Vimeo', 'Dailymotion', 'Facebook'];

    for (let obj of data) {
        const title = obj.videotitle;
        let description = obj.videodescription;
        const videoUrl = obj.videourl;
        let urlText = obj.videourltext;
        let embedCode = obj.videoembedcode;
        const altUrl = obj.secondaryurl;
        let altText = obj.secondaryurltext;

        /* The following nested conditional statements are
           to safeguard against missing cells in Google
           Sheets CMS data - i.e. only continue if required
           fields were filled out in linked Google Form */
        if (title) {
            if (description) {
                if (videoUrl) {
                    if (urlText) {
                        /* Only continue if video URL is valid 'https' URL
                        and appears to come from a trusted domain */
                        if (isValidUrl(videoUrl, 'https:') && isTrustedUrl(videoUrl, sources)) {
                            const wrapperDiv = document.createElement('div');
                            wrapperDiv.classList.add('useful-link-wrapper', 'mb-4');

                            const videoHeading = document.createElement('h4');
                            videoHeading.classList.add('h5', 'mb-0');
                            /* Retain original 'obj.videotitle' string
                            for use in aria-label' and 'title'
                            attributes of dynamically created elements */
                            const newTitle = formatStringForHtml(title);
                            description = formatStringForHtml(description);
                            const videoLink = createExternalLinkElement(videoUrl, `Watch '${title}' - ${urlText}`);
                            videoLink.innerHTML = newTitle;
                            videoHeading.appendChild(videoLink);
                            wrapperDiv.appendChild(videoHeading);
                            
                            const descriptionDiv = document.createElement('div');
                            const descriptionParag = `<p>${description}</p>`;
                            descriptionDiv.innerHTML = descriptionParag;
                            wrapperDiv.appendChild(descriptionDiv);
                            
                            embedCode = createVideoEmbed(embedCode, title, sources);
                            if (embedCode) {
                                embedCode.classList.add('embed-responsive-item');
                                
                                const videoDiv = document.createElement('div');
                                videoDiv.classList.add('useful-links-video-wrapper', 'd-flex', 'justify-content-center', 'my-1');
                                const iframeDiv = document.createElement('div');
                                iframeDiv.classList.add('useful-links-video', 'embed-responsive', 'embed-responsive-16by9');
                                iframeDiv.appendChild(embedCode);
                                videoDiv.appendChild(iframeDiv);
                                wrapperDiv.appendChild(videoDiv);
                            }
                            
                            const videoLinkParag = document.createElement('p');
                            urlText = formatStringForHtml(urlText);
                            const newVideoLink = videoLink.cloneNode();
                            newVideoLink.innerHTML = urlText;
                            videoLinkParag.appendChild(newVideoLink);
                            wrapperDiv.appendChild(videoLinkParag);

                            if (altUrl) {
                                // Secondary video link requires link text
                                if (altText) {
                                    /* Only create secondary video link if secondary
                                    URL is valid 'https' URL and appears to come
                                    from a trusted domain */
                                    if (isValidUrl(altUrl, 'https:') && isTrustedUrl(altUrl, sources)) {
                                        const secondLinkParag = document.createElement('p');
                                        const secondaryLink = createExternalLinkElement(altUrl, `Watch '${title}' - ${altText}`);
                                        altText = formatStringForHtml(altText);
                                        secondaryLink.innerHTML = altText;
                                        secondLinkParag.appendChild(secondaryLink);
                                        wrapperDiv.appendChild(secondLinkParag);
                                    }
                                }
                            }
                            section.append(wrapperDiv);
                        }
                    }
                }
            }
        }
    }
}

/**
 * Construct object containing all attributes and their values
 * necessary for the iframe element to be created. 
 * 
 * Use RegEx match() method to get passed-in video embed code's 'src'
 * URL. Pass to validator functions to check for 'https' protocol and
 * that host name contains trusted source name from passed-on array.
 * Only continue if both return true. Set 'src' attribute to validated
 * URL.
 * 
 * Check URL's source/domain and set 'title' attribute accordingly
 * using passed-in video title.
 * 
 * Create iframe element and set attributes from object.
 * 
 * Return null if passed an empty string for embedCode.
 * Return null if embedCode's 'src' URL fails either validation
 * function.
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
        if (isValidUrl(embedUrl, 'https:') && isTrustedUrl(embedUrl, sourceArray)) {
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

//  Useful Links: Websites section

/**
 * For each object in passed-in Google Sheet data array, get all
 * string values. Check each 'required' value is not an empty
 * string (or 'null', etc). If any have no value, ignore this object
 * and move on to next object in data array.
 * 
 * Pass link URL to validator function to check for 'https'
 * protocol. If validator function returns false, again skip this
 * object.
 * 
 * Format and sanitise description and text string values using
 * formatStringForHtml() function.
 * 
 * Create main container div element, adding classes for styling.
 * Create container paragraph element for link text and link element
 * and add formatted/sanitised description string to it.
 * 
 * Pass link URL and aria-label string consisting of website name to
 * createExternalLinkElement() function in order to create link
 * element. As website name ('siteName') is only used as aria-label
 * attribute, no need for formatting/sanitising. Add formatted/
 * sanitised link text to link element and add link element to
 * container paragraph. Add container paragraph to main container
 * div and add main container to passed-in 'section' element.
 * 
 * @param {HTMLElement} section - Containing 'div' element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateWebLinks(section, data) {
    for (let obj of data) {
        let description = obj.linkdescription;
        let text = obj.linktext;
        const url = obj.linkurl;
        const siteName = obj.websitename;

        /* The following nested conditional statements are
           to safeguard against missing cells in Google
           Sheets CMS data - i.e. only continue if required
           fields were filled out in linked Google Form */
        if (description) {
            if (text) {
                if (url) {
                    if(siteName){
                        // Only continue if link URL is valid 'https' URL
                        if (isValidUrl(url, 'https:')) {
                            description = formatStringForHtml(description);
                            text = formatStringForHtml(text);

                            const wrapperDiv = document.createElement('div');
                            wrapperDiv.classList.add('useful-link-wrapper', 'mb-4');
                            const containerParag = document.createElement('p');
                            containerParag.innerHTML = `${description}&#58; `;
                            
                            const newLink = createExternalLinkElement(url, siteName);
                            newLink.innerHTML = text;

                            containerParag.appendChild(newLink);
                            wrapperDiv.appendChild(containerParag);
                            section.append(wrapperDiv);
                        }
                    }
                }
            }
        }
    }
}

// Further Reading section

/**
 * For each object in passed-in Google Sheet data array, get all
 * string values. Check each 'required' value is not an empty
 * string (or 'null', etc). If any have no value, ignore this object
 * and move on to next object in data array.
 * 
 * Pass primary link URL to validator function to check for 'https'
 * protocol. If validator function returns false, again skip this
 * object.
 * 
 * Format and sanitise all 'required' non-url string values using
 * formatStringForHtml() function.
 * 
 * Create Bootstrap 'row' and 'col' container div elements, adding
 * classes for formatting and styling. Create container 'div' and
 * 'h3' elements for article headline. Add formatted/sanitised
 * headline string to 'h3' element and add that to conatiner element.
 * Add headline container to 'col' container element.
 * 
 * If article subheading string exists, format/sanitise it using
 * formatStringForHtml() function, create its container element and
 * add all to 'col' container element.
 * 
 * If any of the author, publication or publication date strings
 * exist, create container 'div' and paragraph elements. For each
 * string that exists, format/sanitise it using formatStringForHtml()
 * function, create its conatainer 'span' element and add to
 * paragraph element (structured to match backup content in DOM).
 * Add paragraph element to container element and add that to 'col'
 * container element.
 * 
 * Create container 'div' element for summary string, add formatted/
 * sanitised string and add that to 'col' container element.
 * 
 * Create container 'div' and paragraph elements for primary link.
 * Pass validated primary url and aria-label string consisting of
 * original link text to createExternalLink() function in order to
 * create link element. Add formatted/sanitised link text to link
 * element. Add link element to container paragraph element and add
 * that to container 'div' element. Add link container to 'col'
 * container element.
 * 
 * If secondary link URL and by implication, secondary URL text,
 * (neither 'required') exist, pass link URL to validator function
 * to check for 'https' protocol. If validator function returns false,
 * do not continue. Clone primary link container element and its
 * children in order to create secondary link container. Pass
 * validated secondary url and aria-label string consisting of
 * original secondary link text to createExternalLink() function in
 * order to create link element. Format/sanitise secondary link text
 * using formatStringForHtml() function and add to secondary link
 * element. Remove original link element from cloned node and replace
 * with secondary link element. Add secondary link container to 'col'
 * container element.
 * 
 * Add 'col' container element to 'row' container element and add that
 * to passed-in 'section' element.
 * 
 * @param {HTMLElement} section - Containing 'div' element for dynamically populated content.
 * @param {Array.<Object>} data - Array of objects containing data from Google Sheets custom CMS.
 */
function populateFurtherReading(section, data) {
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

        /* The following nested conditional statements are
           to safeguard against missing cells in Google
           Sheets CMS data - i.e. only continue if required
           fields were filled out in linked Google Form */
        if (headline) {
            if (summary) {
                if (primaryUrl) {
                    if(primaryLinkText){
                        // Only continue if primary link URL is valid 'https' URL
                        if (isValidUrl(primaryUrl, 'https:')) {
                            headline = formatStringForHtml(headline);
                            summary = formatStringForHtml(summary);
                            /* Retain original obj.articlelinktext string for
                               use in 'aria-label' attribute of dynamically
                               created link elements */
                            let newLinkText = formatStringForHtml(primaryLinkText);

                            const wrapperRow = document.createElement('div');
                            wrapperRow.classList.add('row');
                            const wrapperCol = document.createElement('div');
                            wrapperCol.classList.add('col-12', 'fr-art', 'mb-4');
                            
                            const headWrapper = document.createElement('div');
                            headWrapper.classList.add('fr-art-headline');
                            const headlineEl = document.createElement('h3');
                            headlineEl.classList.add('h4');
                            headlineEl.innerHTML = headline;
                            headWrapper.appendChild(headlineEl);
                            wrapperCol.appendChild(headWrapper);

                            if (subhead) {
                                subhead = formatStringForHtml(subhead);
                                const subHeadWrapper = document.createElement('div');
                                subHeadWrapper.classList.add('fr-art-subhead');
                                subHeadWrapper.innerHTML = `<p>${subhead}</p>`;
                                wrapperCol.appendChild(subHeadWrapper);
                            }

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

                            const summaryWrapper = document.createElement('div');
                            summaryWrapper.classList.add('fr-art-summary');
                            summaryWrapper.innerHTML = `<p>${summary}</p>`;
                            wrapperCol.appendChild(summaryWrapper);
                            
                            const articleLinkWrapper = document.createElement('div');
                            articleLinkWrapper.classList.add('fr-art-link');
                            const articleLinkPrg = document.createElement('p');
                            const primaryLink = createExternalLinkElement(primaryUrl, primaryLinkText);
                            primaryLink.innerHTML = newLinkText;
                            articleLinkPrg.appendChild(primaryLink);
                            articleLinkWrapper.appendChild(articleLinkPrg);
                            wrapperCol.appendChild(articleLinkWrapper);

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
                            section.append(wrapperRow);
                        }
                    }
                }
            }
        }
    }
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

// Validator functions

/**
 * Construct new URL from passed-in URL string. If valid, check
 * if hostname contains trusted source from passed-in array of
 * sources.
 * 
 * Return true if conditions met, false if not.
 *  
 * @param {string} urlString - URL string to be validated.
 * @param {Array.<string>} sourceArray - Array of trusted source names.
 * @returns {boolean}
 */
function isTrustedUrl(urlString, sourceArray) {
    try {
        /* Passing an invalid URL string to the URL constructor
           will return a TypeError */
        const newUrl = new URL(urlString);
        /* True if hostname includes any trusted source name
           from passed-in array */
        return sourceArray.some(source => newUrl.hostname.includes(source.toLowerCase()));
    } catch(error) {
        console.error(error.message);
        return false;
    }
}

/**
 * Construct new URL from passed-in URL string. If valid, check
 * if protocol matches passed-in protocol type.
 * 
 * Return true if conditions met, false if not.
 *  
 * @param {string} urlString - URL string to be validated.
 * @param {string} protocolString - Protocol type to be tested for.
 * @returns {boolean}
 */
function isValidUrl(urlString, protocolString) {
    try {
        /* Passing an invalid URL string to the URL constructor
           will return a TypeError */
        const newUrl = new URL(urlString);
        /* True if protocol matches passed-in protocol type, 
           e.g. 'https:' or 'mailto:' */
        return newUrl.protocol === protocolString;
    } catch(error) {
        console.error(error.message);
        return false;
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
 * If passed-in aria-label string exists, append the text, '(Opens
 * in a new tab)' and set the attribute.
 * 
 * Return new anchor element.
 * 
 * @param {string} urlString - Validated URL string used to populate 'href' HTML attribute.
 * @param {string} ariaLabelString - (Optional) String used to populate 'aria-label' HTML attribute.
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

// ------ 'More' page (dynamically populated) functions end

// ------------------- Miscellaneous functions

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

// ----------------- Miscellaneous functions end