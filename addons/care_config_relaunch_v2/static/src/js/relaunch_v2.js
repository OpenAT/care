document.addEventListener("DOMContentLoaded", function(e) {
    document.getElementById("price_donate").addEventListener('click', function(e) {
        clearAllActive();
        document.getElementsByClassName('price_donate').item(0).classList.add("active");
    });

    const price_suggestions = document.getElementsByClassName("price_donate_suggested");

    for (let i = 0; i < price_suggestions.length; i++) {
        price_suggestions.item(i).addEventListener("click", function(e) {
            clearAllActive();
            e.currentTarget.parentElement.classList.add("active");
        });
    }
});

function clearAllActive() {
    document.getElementsByClassName('price_donate').item(0).classList.remove("active");

    const suggestions = document.getElementsByClassName("price_donate_suggested");

    for (let j = 0; j < suggestions.length; j++) {
        suggestions.item(j).parentElement.classList.remove("active");
    }
}
