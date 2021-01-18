
$(document).ready(function () {

    $( "#emergency_contact_email" ).rules( "add", {
        required: function (element) {
            return $("#emergency_contact_optin").is(":checked");
        }
    });


    // #jahresbericht_paper, #jahresbericht_email
    $( "#jahresbericht_paper" ).on("click", function() {
        $( "#jahresbericht_email" ).prop("checked", false);
    })
    $( "#jahresbericht_email" ).on("click", function() {
        $( "#jahresbericht_paper" ).prop("checked", false);
    })

});


