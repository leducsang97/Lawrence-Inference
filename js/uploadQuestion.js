var questions = require('./question.json');
var request = require('sync-request');

questions.forEach(p => {
	let url = "http://cmsc106.net/Lawrence/questions?group=ASH";
    console.log(`Begin submit questions: ${p.question}`);
    // console.log({
    //     attribute: p.attribute,
    //     group: "TEST",
    //     question: p.question,
    //     responses: p.option.join("||"),
    //     survey: 1
    // })
    var res = request('POST', url, {
        json: {
            attribute: p.attribute,
            group: "ASH",
            question: p.question,
            responses: p.option.join("||"),
            survey: "1"
        }
    });
    if (res.statusCode == 200) {
        console.log(`SUCCESS - Submit question ${p.question}.`);
    } else {
        console.log(res.getBody('utf8'));
    }
});



// DANGEROUS ZONE!!!!!!!!! USE TO DELETE

// var start = 252;
// var end = 364;

// for(var i = start;i<=end;i++){
//     console.log(i);
//     request('DELETE', 'http://cmsc106.net/Lawrence/people/'+i);
// }