$(document).ready(function () {

    var resultsContainer = $(".results-container");
    $("#submit").on("click", handleCategoryChange);

    function getResults(category) {
        var categoryString = category;
        Promise.all([
            $.ajax({
                method: "GET",
                url: "/api/freelancer/role/" + categoryString
            }),
            $.ajax({
                url: 'https://randomuser.me/api/?results=30',
                dataType: 'json',
            })
        ]).then(function (results) {
            var data = results[0];
            var users = results[1];

            console.log("role", data);
            if (!data || !data.length) {
                displayEmpty();
            } else {
                initializeRows(data, users);
            }

            console.log(users);
        });
    }

    function initializeRows(data, users) {
        resultsContainer.empty();
        var resultsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            resultsToAdd.push(createNewRow(data[i], users.results[i]));
        }
        resultsContainer.append(resultsToAdd);
    }

    function createNewRow(response, user) {
        var newQueryCard = $("<div>");
        newQueryCard.addClass("card");
        newQueryCard.css({
            "margin-top": "15px"
        });

        var newQueryCardHeading = $("<div>");
        newQueryCardHeading.addClass("card-header");

        var newQueryTitle = $("<h2>");
        var newQueryDate = $("<h6>");

        var newQueryCategory = $("<h5>");
        newQueryCategory.text(response.location);
        newQueryCategory.css({
            float: "right",
            "font-weight": "700",
            "margin-top": "-15px"
        });

        var newQueryCardBody = $("<div>");
        newQueryCardBody.addClass("card-body");

        var newQueryBody = $("<div>");
        newQueryTitle.text(response.name + " ");

        var formattedDate = new Date(response.createdAt);
        formattedDate = moment(formattedDate).format("MMMM Do YYYY");
        newQueryDate.text(formattedDate);
        newQueryTitle.append(newQueryDate);

        // newQueryBody.append(`<img src="${user.picture.thumbnail}" />`);

        var newQueryProfilePic = $("<img>");
        newQueryProfilePic.attr('src', user.picture.large);
        newQueryProfilePic.css({
            float: "right",
            "border-radius": "50px"
        })
        newQueryBody.append(newQueryProfilePic);

        newQueryBody.append("<h5 id='bio'>Biography");
        newQueryBody.append(response.bio);
        newQueryBody.append("<br><br>")

        newQueryBody.append("<h5 id='skills'>Skills");
        newQueryBody.append(response.skills);
        newQueryBody.append("<br><br>")

        newQueryBody.append("<h5 id='portfolio'>References");
        newQueryBody.append(`<a href="${response.portfolio}" class="btn btn-primary">Click To See Work</a>`);
        newQueryBody.append("<br>")

        newQueryCardHeading.append(newQueryTitle);
        newQueryCardHeading.append(newQueryCategory);
        newQueryCardBody.append(newQueryBody);
        newQueryCard.append(newQueryCardHeading);
        newQueryCard.append(newQueryCardBody);
        newQueryCard.data("response", response);
        return newQueryCard;
    }

    function displayEmpty() {
        resultsContainer.empty();
        var messageH2 = $("<h2>");
        messageH2.css({
            "text-align": "center",
            "margin-top": "50px"
        });
        messageH2.html("Please select from one of the categories above to chose a desired role from your freelancer");
        resultsContainer.append(messageH2);
    }

    function handleCategoryChange(event) {
        event.preventDefault();
        var newQueryCategory = $("#roleID").val();
        getResults(newQueryCategory);
    }
})