// GLOBAL VARIABLE
var questions = []
var numberOfQuestion = 0;
var userID;
var attribute, chosenValue;


// post function
jQuery["postJSON"] = function (url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        success: callback
    });
};

//Display questions in cards and show the result if numberOfQuestion is bigger than the length of questions.
function pushQuestion(id) {
    if (numberOfQuestion < questions.length) {
        // we'll need a place to store the HTML output
        const output = [];
        $('.question').remove();
        $('.answers').remove();
        var q = questions[numberOfQuestion];
        // we'll want to store the list of answer choices
        const answers = [];
        for (letter in q["responses"]) {
            // ...add an HTML radio button
            answers.push(
                `<div>
                <input class="form-check-input" type="radio" name="${questions[numberOfQuestion]["question"]}" onclick='selectAttribute("${questions[numberOfQuestion]["attribute"]}",${letter})' id="${numberOfQuestion}" value=" ${q['responses'][letter]}">
                <label class="form-check-label" for="${numberOfQuestion}">
                ${q['responses'][letter]}
                </label>
                </div>`
            );
        }

        // add this question and its answers to the output
        output.push(
            `<div class="question"> ${q.question} </div>
        <div class="answers"> ${answers.join("")} </div>`

        );
        $(id).append(output.join(""));
        numberOfQuestion++;
        if (id == '#quiz2') {
            $('#first').hide();
            $('#second').show();
        } else {
            $('#second').hide();
            $('#first').show();
        }
    } else {
        $(id).text("We are done");
        $('#second').hide();
        $('#first').hide();
        getResult();
    }
}

//compare result
async function getResult() {
    var best = 0;
    var bestData = [];
    var data;
    $(".loader").show();
    await $.getJSON('http://cmsc106.net/Lawrence/people?group=ASH', (d) => {
        data = d
    });
    for (d in data) {
        if (d < data.length - 1) {
            await $.getJSON(`http://cmsc106.net/Lawrence/people/${userID}/overlap/${data[d].id}`, (result) => {
                if (result["overlap"] > best) {
                    best = result["overlap"];
                    bestData = result;
                }
                // console.log(result)
            });
        }
    }
    for (i in data) {
        if (data[i]["id"] == bestData["two"]) {
            bestData = data[i];
            break;
        }
    }
    // console.log(bestData);
    $(".loader").hide();
    if (bestData["additional"].includes("http")) {
        $("#result_image").html(`<img class='article-image' src=${bestData["additional"]} border='0' style='width:50%;height:50%'>`);
    } else {
        $("#result_image").html(`<img class='article-image' src=${"http://www2.lawrence.edu/hosted/photos/"+bestData["additional"]} border='0' style='width:50%;height:50%'>`);
    }
    $("#resultName").text(bestData["name"]);
    $("#resultDescription").text(bestData["description"]);
    $('#resultCard').show();
}

//Receive questions from server
function recieveData(data) {
    data.forEach(d => {
        questions.push({
            "attribute": d.attribute,
            "id": d.id,
            "question": d.question,
            "responses": d.responses.split("||")
        })
    });;
}

//Send new user information to server
async function submitUser(firstName, lastName) {
    var data = {
        name: firstName + " " + lastName,
        description: "Surprise, you match with another student!",
        additional: "https://i.gifer.com/P2KZ.gif",
        role: "Student",
        group: "ASH"
    }
    // POST it to the server
    await $.postJSON('http://cmsc106.net/Lawrence/people?group=ASH', data, (id) => {
        userID = id;
        // console.log("Submitted " + userID)
    });

}

//Keep record of what is chosing - I cannot find any submission that work well
// keep the current chosen value as global variable
function selectAttribute(a, c) {
    attribute = a;
    chosenValue = c;
}

//Send new users attribute to server one by one
function submitAttribute() {
    data = {
        person: userID,
        name: attribute,
        value: chosenValue.toString()
    }
    // POST it to the server
    $.postJSON('http://cmsc106.net/Lawrence/attributes', data, (id) => {
        // console.log(id)
    });
}

//Set up
function setUp() {
    //hide the first and second card. Show the main card
    $('#second').hide();
    $('#first').hide();
    $('.loader').hide();
    $('#resultCard').hide();

    //Handle onclick event in main. Main -> first
    $('#open_main').click(() => {
        pushQuestion("#quiz1");
        lastName = $("#lastName").val();
        firstName = $("#firstName").val();
        $('#first').show();
        $('#main').hide();
        submitUser(firstName, lastName);
    })
    //Handle onclick event in first page. 
    $('#open1').click(() => {
        pushQuestion("#quiz2");
        submitAttribute(1);
    })
    //Handle onclick event in second page. 
    $('#open2').click(() => {
        pushQuestion("#quiz1");
        submitAttribute(2);
    })
    //Handle onclick event in result page. Result -> Main (retry)
    $('#retry').click(() => {
        $('#second').hide();
        $('#first').hide();
        $('#main').show();
        $('#resultCard').hide();
    })

    $.getJSON('http://cmsc106.net/Lawrence/questions/1?group=ASH', recieveData);
}

$(document).ready(setUp);
