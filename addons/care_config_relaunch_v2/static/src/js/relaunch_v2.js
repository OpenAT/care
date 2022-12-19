document.addEventListener("DOMContentLoaded", function(e) {
    setupFloatingInputs();
    setupPriceDonate();
    setupRemoveZeroDecimals();
    hidePaymentIntervalIfOnlyOneEntry();
});

function setupPriceDonate() {
    const priceDonate = document.getElementById("price_donate");

    if (priceDonate) {
        priceDonate.addEventListener('click', function(e) {
            priceDonateClearAllActive();
            document.getElementsByClassName('price_donate').item(0).classList.add("active");
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

function hidePaymentIntervalIfOnlyOneEntry() {
    const element = document.getElementsByName("payment_interval_id").item(0);

    if (element && element.tagName == "SELECT" && element.children.length <= 1) {
        element.selectedIndex = 0;
        element.parentElement.style = "display: none;";
    }
}