// inner workings of multiplication to the death 

function random_item(items){
    return items[Math.floor(Math.random() * items.length)];   
}

const nums = []
for(let i = 0; i <= 12; i++){
    nums.push(i);
}
console.log(nums);
const a = random_item(nums);
console.log(a);
const b = random_item(nums);


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

function check(){
    console.log(a * b)
    if ((a * b) == document.getElementById("ans").value){
        console.log("yay")
    }
    else{
        console.log("boooo")
    }
};

multiply()
check()