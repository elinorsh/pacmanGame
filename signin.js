$().ready(function() {

    jQuery.validator.addMethod("uniqueUserName", function (user) {
        var ans = true;
        for (var key in allUsers) {
            if (user == allUsers[key].uname) { ans=false; }
        }
        return ans; }
    , "Username is already exist");

    jQuery.validator.addMethod("password", function (value, element) {
        return /^(?=.*[a-zA-Z])(?=.*\d).*$/.test(value); }
    , "Password is not in the requested format");
//Password must be at minimum length of 8 characters and must contain only letters and at least one digit

    jQuery.validator.addMethod("flName", function (value, element) {
        return /^[a-zA-Z]*$/.test(value); }
    , "Name can contain only letters");

    jQuery.validator.addMethod("email", function (value) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value); }
    , "Email is not in the requested format");

    jQuery.validator.addMethod("required", function (value) {
        return (value != "") }
    , "This field is required");

    $("form[name='signinForm']").validate({
        rules: {
            usernmSignin: {
                required: true,
                uniqueUserName: true
            },
            pwSignin: {
                required: true,
                minlength: 8,
                password: true
            },
            firstname: {
                required: true,
                flName: true
            },
            lastname: {
                required: true,
                flName: true
            },
            email: {
                required: true,
                email: true
            }
        },


    submitHandler: function(form) {
        form.submit();
        var user = {uname: usernmSignin.value , pword: pwSignin.value};
        allUsers.push(user);
        username = user.uname
        $(".firstbutton").css("visibility","hidden");
        //$(".regularbutton").css("visibility","visible");
        $(".afterloginbutton").css("visibility","visible");
        $("#signIn").css("visibility","hidden");  
        $("#newgamebutton").css("visibility","visible");
        $("#usernameLable").html("Hello, "+username);      
        alert('Welcome '+username+', you are loged in!');
    }

});
});



$(function() {
var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    //populate our years select box
    for (i = new Date().getFullYear(); i > 1900; i--){
        $('#years').append($('<option />').val(i).html(i));
    }
    //populate our months select box
    for (i = 1; i < 13; i++){
        $('#months').append($('<option />').val(i).html(monthNames[i-1]));
    }
    //populate our Days select box
    updateNumberOfDays(); 

    //"listen" for change events
    $('#years, #months').change(function(){
        updateNumberOfDays(); 
    });
});

//function to update the days based on the current values of month and year
function updateNumberOfDays(){
    $('#days').html('');
    month = $('#months').val();
    year = $('#years').val();
    days = daysInMonth(month, year);

    for(i=1; i < days+1 ; i++){
            $('#days').append($('<option />').val(i).html(i));
    }
}
//helper function
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}


