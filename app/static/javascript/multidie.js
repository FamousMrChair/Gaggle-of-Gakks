// inner workings of multiplication to the death 

function random_item(items){
    return items[Math.floor(Math.random() * items.length)];   
}

const nums = [];
for(let i = 0; i <= 12; i++){
    nums.push(i);
}
var a;
var b;
var results = 0;
AHead = document.createElement("h4");
BHead = document.createElement("h4");


function multiply(event) {
    //displaying numbers
    a = random_item(nums);
    b = random_item(nums);
    numbers = document.getElementById("numbers");
    AHead.innerHTML = a;
    BHead.innerHTML = b;
    numbers.appendChild(AHead);
    numbers.appendChild(BHead);
}

function isKeyPressed(event) {
    var x = document.getElementById("demo");
    if (event.shiftKey) {
      x.innerHTML = "The SHIFT key was pressed!";
    } else {
      x.innerHTML = "The SHIFT key was NOT pressed!";
    }
  }

function check(event){
    var x = document.getElementById("results");
    if (event.shiftKey) {   
        if ((a * b) == document.getElementById("ans").value){
            console.log("yay");
            results += 1;
            AHead.innerHTML = "";
            BHead.innerHTML = "";
            multiply()
        }
        else{
            console.log("boooo");
            AHead.innerHTML = "";
            BHead.innerHTML = "";
            multiply()
        }
    }
};

multiply();

