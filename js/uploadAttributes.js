var questions = require('./question.json');
const fetch = require('node-fetch');
var request = require('sync-request');

async function getFaculty() {
    var faculty;
    await fetch("http://cmsc106.net/Lawrence/people?group=ASH", {
            method: 'GET',
        }).then(rs => rs.json())
        .then(data => {
            faculty = data;
        });
    return faculty
}

async function getQuestions() {
    var questions;
    await fetch("http://cmsc106.net/Lawrence/questions/1?group=ASH", {
            method: 'GET',
        }).then(rs => rs.json())
        .then(data => {
            questions = data;
        });
    return questions
}

function uploadAttribute(questions,id){
    var url ="http://cmsc106.net/Lawrence/attributes";
    questions.forEach(q => {
        console.log({
            person: id,
            name: q["attribute"],
            value: Math.floor(Math.random() * q["responses"].split("||").length) .toString()
        })

        var res = request('POST', url, {
            json: {
                person: id,
                name: q["attribute"],
                //Random attributes
                value: Math.floor(Math.random() * q["responses"].split("||").length) .toString()
            }
        });
        if (res.statusCode == 200) {
            console.log(`SUCCESS - Submit attribute ${q["attribute"]}.`);
        } else {
            console.log(res.getBody('utf8'));
        }
    });
}
// ----------------------------Main--------------------------------------
var faculty ;
var questions;
(async () => {
    faculty = await getFaculty();
    questions = await getQuestions();
    faculty.forEach(f=>{
        uploadAttribute(questions, f["id"]);

    })
})();



// DANGEROUS ZONE!!!!!!!!! USE TO DELETE

// var start = 252;
// var end = 364;

// for(var i = start;i<=end;i++){
//     console.log(i);
//     request('DELETE', 'http://cmsc106.net/Lawrence/people/'+i);
// }