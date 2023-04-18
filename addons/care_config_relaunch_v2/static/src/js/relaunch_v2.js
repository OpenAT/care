document.addEventListener("DOMContentLoaded", function(e) {
    setupFloatingInputs();
    setupPriceDonate();
    setupDynamicPriceTextSize();
    setupRemoveZeroDecimals();
    setupMultiStepIntervals();
    hidePaymentIntervalIfOnlyOneEntry();
});

function setupPriceDonate() {
    $(document).ready(() => {
        removePriceDonateComma();
    });

    $('#price_donate').change(() => {
        removePriceDonateComma();
    });

    const priceDonate = document.getElementById("price_donate");

    if (priceDonate) {
        priceDonate.addEventListener('click', function(e) {
            priceDonateClearAllActive();
            document.getElementsByClassName('price_donate').item(0).classList.add("active");
        });

        priceDonate.addEventListener('change', function(e) {
        });
    }

    const price_suggestions = document.getElementsByClassName("price_donate_suggested");

    if (price_suggestions) {
        for (let i = 0; i < price_suggestions.length; i++) {
            price_suggestions.item(i).addEventListener("click", function(e) {
                priceDonateClearAllActive();
                e.currentTarget.parentElement.classList.add("active");
            });
        }
    }
}

function removePriceDonateComma() {
    const priceDonate = document.getElementById("price_donate");

    if (priceDonate) {
        if (priceDonate.value.endsWith('.00') || priceDonate.value.endsWith(',00')) {
            priceDonate.value = priceDonate.value
                .substring(0, priceDonate.value.length - 3)
                .replace(',', '')
                .replace('.', '');
        }
        else if (priceDonate.value.endsWith('.0') || priceDonate.value.endsWith(',0')) {
            priceDonate.value = priceDonate.value
                .substring(0, priceDonate.value.length - 2)
                .replace(',', '')
                .replace('.', '');
        }
    }
}

function setupDynamicPriceTextSize() {
    // Only setup for multi step
    var body = document.getElementsByTagName("body").item(0);

    var isMultiStep = body.getAttribute("data-on-shop-page") == "True"
        && body.getAttribute("data-latest-product-theme") == "care_multistep"
        && body.getAttribute("data-confirmation-controller-called") != "True";

    if (!isMultiStep)
        return;

    addPriceDonateInputHandlers();
    adjustPriceSuggestions();
}

function addPriceDonateInputHandlers() {
    const priceDonate = document.getElementById("price_donate");

    if (priceDonate) {
        $('#price_donate').attr('maxlength','7');
        $('#price_donate').change(() => {
            updatePriceDonateTextSize();
        });
        $('#price_donate').keyup(() => {
            updatePriceDonateTextSize(priceDonate);
        });
    }
}

function adjustPriceSuggestions() {
    const priceSuggestions = document.getElementsByClassName("price_donate_suggested");

    for (var i = 0; i <= priceSuggestions.length; i++) {
        const button = priceSuggestions.item(i);
        if (button) {
            button.style.fontSize = getDynamicPriceSize(button.value.length);
        }
    }
}

function updatePriceDonateTextSize(priceDonate) {
    if (priceDonate) {
        var maxLength = priceDonate.getAttribute('maxlength');
        if (maxLength && priceDonate.value.length > maxLength) {
            priceDonate.value = priceDonate.value.substr(0, maxLength);
        }

        var size = getDynamicPriceSize(priceDonate.value.length);
        priceDonate.style = "font-size: " + size + ";"
    }
}

function getDynamicPriceSize(digits) {
    var size = "";

    switch(digits) {
        case 0:
        case 1:
        case 2:
        case 3:
            size = "50px";
            break;
        case 4:
            size = "40px";
            break;
        case 5:
            size = "35px";
            break;
        case 6:
            size = "30px";
            break;
        case 7:
        default:
            size = "25px";
            break;
    }

    return size;
}

function priceDonateClearAllActive() {
    document.getElementsByClassName('price_donate').item(0).classList.remove("active");

    const suggestions = document.getElementsByClassName("price_donate_suggested");

    for (let j = 0; j < suggestions.length; j++) {
        suggestions.item(j).parentElement.classList.remove("active");
    }
}

function setupFloatingInputs() {
    var textinputs = Array.prototype.slice.call(document.getElementsByTagName("input"), 0);
    var selects = Array.prototype.slice.call(document.getElementsByTagName("select"), 0);
    var inputs = textinputs.concat(selects);

    for (let i = 0; i < inputs.length; i++) {
        const currentInput = inputs[i];

        if (currentInput.parentElement.classList.contains("form-group")) {
            const parent = currentInput.parentElement;
            var labelForInput = parent.getElementsByTagName("label").item(0);

            if (labelForInput !== null) {
                currentInput.addEventListener("focus", function(e) {
                    const me = e.currentTarget;
                    const label = me.parentElement.getElementsByTagName("label").item(0);
                    label.classList.remove("un-focused");
                    label.classList.add("is-focused");
                });
                currentInput.addEventListener("blur", function(e) {
                    const me = e.currentTarget;
                    const label = me.parentElement.getElementsByTagName("label").item(0);
                    label.classList.remove("is-focused");
                    label.classList.add("un-focused");
                });

                if (parent.classList.contains("f-type-many2one") || parent.classList.contains("f-type-selection")) {
                    currentInput.addEventListener("change", function(e) {
                        const me = e.currentTarget;
                        const label = me.parentElement.getElementsByTagName("label").item(0);
                        if (!me.options[me.selectedIndex].text) {
                            label.classList.add("empty");
                        } else {
                            label.classList.remove("empty");
                        }
                    });
                    currentInput.dispatchEvent(new Event("change"))
                } else {
                    var keyFunc = function(e) {
                        const me = e.currentTarget;
                        const label = me.parentElement.getElementsByTagName("label").item(0);
                        if (!me.value) {
                            label.classList.add("empty");
                        } else {
                            label.classList.remove("empty");
                        }
                    };
                    currentInput.addEventListener("keyup", keyFunc);
                    currentInput.addEventListener("keydown", keyFunc);
                    currentInput.dispatchEvent(new Event("keyup"))
                }
                currentInput.dispatchEvent(new Event("blur"))
            }
        }
    }
}

function setupRemoveZeroDecimals() {
    const price_values = document.getElementsByClassName("oe_currency_value");

    for (let i = 0; i < price_values.length; i++) {
        if (price_values.item(i).innerText.endsWith('.00') || price_values.item(i).innerText.endsWith(',00')) {
            price_values.item(i).innerText = price_values.item(i).innerText
                .substring(0, price_values.item(i).innerText.length - 3)
                .replace(',', '')
                .replace('.', '');
        }
    }
}

function setupMultiStepIntervals() {
    const intervalElements = document.getElementsByName("payment_interval_id");

    for (let i = 0; i < intervalElements.length; i++) {
        const currentElement = intervalElements.item(i);

        currentElement.addEventListener("change", function(e) {
            const me = e.currentTarget;
            const label = me.parentElement;
            updateActiveOnAllIntervals();
        });
    }

    updateActiveOnAllIntervals();
}

function updateActiveOnAllIntervals() {
    const intervalElements = document.getElementsByName("payment_interval_id");

    for (let i = 0; i < intervalElements.length; i++) {
        const me = intervalElements.item(i);
        const label = me.parentElement;

        label.classList.remove("active");

        if (me.checked) {
            label.classList.add("active");
        }
    }
}

function hidePaymentIntervalIfOnlyOneEntry() {
    const element = document.getElementsByName("payment_interval_id").item(0);

    if (element && element.tagName == "SELECT" && element.children.length <= 1) {
        element.selectedIndex = 0;
        element.parentElement.style = "display: none;";
    }
}