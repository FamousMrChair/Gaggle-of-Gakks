// inner workings of multiplication to the death 

function random_item(items){
    return items[Math.floor(Math.random() * items.length)];   
}

const nums = [];
for(let i = 0; i <= 12; i++){
    nums.push(i);
}
const a = random_item(nums);
const b = random_item(nums);
var results = 0;

function multiply() {
    //displaying numbers 
    numbers = document.getElementById("numbers");
    AHead = document.createElement("h4");
    AHead.innerHTML = a;
    BHead = document.createElement("h4");
    BHead.innerHTML = b;
    numbers.appendChild(AHead);
    numbers.appendChild(BHead);
}

// function isKeyPressed(event) {
//     var x = document.getElementById("demo");
//     if (event.shiftKey) {
//       x.innerHTML = "The SHIFT key was pressed!";
//     } else {
//       x.innerHTML = "The SHIFT key was NOT pressed!";
//     }
//   }

function check(event){
    // var x = document.getElementById("demo");
    // if (event.shiftKey) {
    //   x.innerHTML = "The SHIFT key was pressed!";
    // }
    // console.log(a * b);
    if ((a * b) == document.getElementById("ans").value){
        console.log("yay");
        results += 1;
    }
    else{
        console.log("boooo");
    }
};

multiply();

