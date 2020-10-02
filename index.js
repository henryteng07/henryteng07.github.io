const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/home.html");
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.post("/", function(req, res) {
    const firstname = req.body.fname;
    const email = req.body.eml;
    const number = req.body.num;
    const userSelection = req.body.usermultiselect;
    const additionalText = req.body.txt;

    console.log(firstname, email, number, userSelection, additionalText);

    // TODO
    const data = {
        members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: { 
                FNAME: firstname,
                PHONE: number,
                USERCHC: userSelection,
                USERCMT: additionalText
            }

        }
    ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/e11263e79b"

    const option = {
        method: "POST",
        auth: "henry:615241a93cad7512aef6ea9e908be89f-us17"
    }

    const request = https.request(url, option, function(response){
        response.on("data", function(data) {

            if (response.statusCode === 200) {
                console.log("Success");
                res.redirect("..");
            } else {
                // res.sendFile(__dirname+ "/failure.html");
                console.log("Failure");
            }
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.listen(3000, function() {
    console.log("Server is running on port 3000");
})


// api Key
// a0c96c8fa4491dba221c29969accaa5c-us17

//audience id
// e11263e79b