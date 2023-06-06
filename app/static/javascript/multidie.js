// inner workings of multiplication to the death 

function random_item(items){
    return items[Math.floor(Math.random() * items.length)];   
}

function multiply() {
    const nums = []
    for(let i = 0; i <= 12; i++){
        nums.push(i);
    }
    console.log(nums);
    const a = random_item(nums);
    console.log(a);
    const b = random_item(nums);

    var numbers = document.getElementById("numbers");
    var AHead = document.createElement("h4");
    AHead.innerHTML = a;
    numbers.append(AHead);

    

}

multiply();