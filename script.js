
let btn = document.querySelector("button");
let select = document.querySelector("#select");
let txtarea = document.querySelector("textarea");
let outputParagh = document.querySelector("#outputParagh");

function change() {
    return select.value;
}

btn.addEventListener("click", function () {
    let m = change();
    console.log(m);
    let url = "https://course.codequotient.com/api/executeCode";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({
        "code": txtarea.value,
        "langId": m
    }))

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.responseText) {  // Ensure the response is not empty
                let ans = JSON.parse(xhr.responseText);
                console.log(ans);
                Get_data(ans.codeId);
            } else {
                console.error("Empty or invalid JSON response");
            }
        }
    }

});

function Get_data(codeId) {
    function checkResult() {
        let Get_url = `https://course.codequotient.com/api/codeResult/${codeId}`;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", Get_url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                let obj = JSON.parse(xhr.responseText);
                let data = JSON.parse(obj.data);
                console.log(data);
                if (data.status === "pending") {
                    console.log("Still pending, retrying...");
                    setTimeout(checkResult, 2000);  
                } else {
                    outputParagh.innerText = data.output || data.errors;  
                }
            }
        }
    }

    setTimeout(checkResult, 2000); 
}
