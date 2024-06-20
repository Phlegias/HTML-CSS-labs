function clearData() {
    let answer = document.getElementsByTagName('div');
    if (answer.length != 0) {
        for (let i = 0; i < answer.length; i++) 
            answer[i].innerHTML = '';
    }

    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type == 'number') {
            inputs[i].value = '';
            inputs[i].classList.remove('error');
        }
    }
}

function changeForm(element) {
    const form = document.getElementById('type_of_fractures');
    let type = form.querySelector('[name="fractional_type"]').value;
    clearData();

    if (type == 'mixed') {
        console.log('mixed');
        document.getElementById(type).style.display = 'block';
        document.getElementById('fractional').style.display = 'none';
    }
    else if (type == 'fractional'){
        console.log('fractional');
        document.getElementById(type).style.display = 'block';
        document.getElementById('mixed').style.display = 'none';
    }
}

function NOD (dividend, divider) {
    let a = Math.abs(+dividend);
    let b = Math.abs(+divider);

    while (b != 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    let NOD = a + b;
    
    if (NOD == 0) return 1;
    return NOD;
}

function fractionalCalc (element) {
    const form = document.getElementById('fractional');
    let act = form.querySelector('[name="action"]').value;
    
    let dividend1 = form.querySelector('[name="dividend1"]').value;
    let divider1 = form.querySelector('[name="divider1"]').value;
    let dividend2 = form.querySelector('[name="dividend2"]').value;
    let divider2 = form.querySelector('[name="divider2"]').value;
    let newElement1 = document.getElementById('1');

    if (dividend1 == '')
        form.querySelector('[name="dividend1"]').classList.add("error");
    if (dividend2 == '')
        form.querySelector('[name="dividend2"]').classList.add("error");
    if (divider1 == '' || divider1 == 0)
        form.querySelector('[name="divider1"]').classList.add("error");
    if (divider2 == '' || divider2 == 0)
        form.querySelector('[name="divider2"]').classList.add("error");

    form.querySelector('[name="dividend1"]').onfocus = function() {
        this.classList.remove('error');
    }
    form.querySelector('[name="dividend2"]').onfocus = function() {
        this.classList.remove('error');
    }
    form.querySelector('[name="divider1"]').onfocus = function() {
        this.classList.remove('error');
    }
    form.querySelector('[name="divider2"]').onfocus = function() {
        this.classList.remove('error');
    }
    
    if (dividend1 == '' || dividend2 == '' || divider1 == '' || divider2 == '') {
        newElement1.innerHTML = 'не все поля заполнены!';
    }
    else if (divider1 == 0 || divider2 == 0) {
        newElement1.innerHTML = 'нельзя делить на ноль!';
    }

    else if (act == '+') {
        console.log('+');

        let a = dividend1 * divider2 + dividend2 * divider1;
        let b = divider1 * divider2;

        newElement1.innerHTML = `<sup>${dividend1}</sup>/<sub>${divider1}</sub> + 
                                 <sup>${dividend2}</sup>/<sub>${divider2}</sub> = 
                                 <sup>${a}</sup>/<sub>${b}</sub>`;
        if (NOD(a, b) != 1)
            newElement1.innerHTML += ` = <sup>${a / NOD(a, b)}</sup>/<sub>${b / NOD(a, b)}</sub>`
    }
    else if (act == '-') {
        console.log('-');

        let a = dividend1 * divider2 - dividend2 * divider1;
        let b = divider1 * divider2;

        newElement1.innerHTML = `<sup>${dividend1}</sup>/<sub>${divider1}</sub> - 
        <sup>${dividend2}</sup>/<sub>${divider2}</sub> = <sup>${a}</sup>/<sub>${b}</sub>`;
        if (NOD(a, b) != 1)
            newElement1.innerHTML += ` = <sup>${a / NOD(a, b)}</sup>/<sub>${b / NOD(a, b)}</sub>`
    }
    else if (act == '/') {
        console.log('/');

        let a = dividend1 * divider2;
        let b = divider1 * dividend2;

        newElement1.innerHTML = `<sup>${dividend1}</sup>/<sub>${divider1}</sub> : 
        <sup>${dividend2}</sup>/<sub>${divider2}</sub> = <sup>${a}</sup>/<sub>${b}</sub>`;
        if (NOD(a, b) != 1)
            newElement1.innerHTML += ` = <sup>${a / NOD(a, b)}</sup>/<sub>${b / NOD(a, b)}</sub>`
    }   
}

function mixedCalc(element) {
    const form = document.getElementById('mixed');
    let act = form.querySelector('[name="action"]').value;
    
    let integer1 = form.querySelector('[name="integer1"]').value
    let dividend1 = form.querySelector('[name="dividend1"]').value;
    let divider1 = form.querySelector('[name="divider1"]').value;
    let integer2 = form.querySelector('[name="integer2"]').value
    let dividend2 = form.querySelector('[name="dividend2"]').value;
    let divider2 = form.querySelector('[name="divider2"]').value;
    let newElement1 = document.getElementById('2');

    if (integer1 == '')
        integer1 = 0;
    if (integer2 == '')
        integer2 = 0;

    if (dividend1 == '' || dividend1 > divider1)
        form.querySelector('[name="dividend1"]').classList.add("error");
    if (dividend2 == '' || dividend2 > divider2)
        form.querySelector('[name="dividend2"]').classList.add("error");
    if (divider1 == '' || divider1 == 0)
        form.querySelector('[name="divider1"]').classList.add("error");
    if (divider2 == '' || divider2 == 0)
        form.querySelector('[name="divider2"]').classList.add("error");

    form.querySelector('[name="dividend1"]').onfocus = function() {
        this.classList.remove('error');
    }
    form.querySelector('[name="dividend2"]').onfocus = function() {
        this.classList.remove('error');
    }
    form.querySelector('[name="divider1"]').onfocus = function() {
        this.classList.remove('error');
    }
    form.querySelector('[name="divider2"]').onfocus = function() {
        this.classList.remove('error');
    }

    if (dividend1 == '' || dividend2 == '' || divider1 == '' || 
        divider2 == '') {
        newElement1.innerHTML = 'не все поля заполнены!';
    }
    else if (dividend1 > divider1 || dividend2 > divider2)
        newElement1.innerHTML = 'числитель не может быть больше знаменателя!'
    else if (divider1 == 0 || divider2 == 0) {
        newElement1.innerHTML = 'нельзя делить на ноль!';
    }


    else if (act == '+') {
        console.log('+');

        //переводим целые числа в числитель
        let a = ((+dividend1) + (integer1 * divider1)) * divider2 + 
                ((+dividend2) + (integer2 * divider2)) * divider1;
        let b = divider1 * divider2;

        let int = Math.round(a / b);
        a = a % b;

        if (NOD(a, b) != 1) {
            a /= NOD(a, b);
            b /= NOD(a, b);
        }

        newElement1.innerHTML = `${integer1}<sup>${dividend1}</sup>/<sub>${divider1}</sub> + 
                                 ${integer2}<sup>${dividend2}</sup>/<sub>${divider2}</sub> =`;

        
        if ((a == 0 || a == -0) && int == 0)
            newElement1.innerHTML += " 0"
        else if (int == 0)
            newElement1.innerHTML += `<sup>${a}</sup>/<sub>${b}</sub>`;
        else if (a == 0)
            newElement1.innerHTML += `${int}`;
        else
            newElement1.innerHTML += `${int}<sup>${a}</sup>/<sub>${b}</sub>`;
    }
    else if (act == '-') {
        console.log('-');

        //переводим целые числа в числитель
        let a = ((+dividend1) + (integer1 * divider1)) * divider2 - 
                ((+dividend2) + (integer2 * divider2)) * divider1;
        let b = divider1 * divider2;

        let int = Math.round(a / b);
        a = a % b;

        if (NOD(a, b) != 1) {
            a /= NOD(a, b);
            b /= NOD(a, b);
        }

        newElement1.innerHTML = `${integer1}<sup>${dividend1}</sup>/<sub>${divider1}</sub> - 
                                 ${integer2}<sup>${dividend2}</sup>/<sub>${divider2}</sub> =`;

        
        if ((a == 0 || a == -0) && int == 0)
            newElement1.innerHTML += " 0"
        else if (int == 0)
            newElement1.innerHTML += `<sup>${a}</sup>/<sub>${b}</sub>`;
        else if (a == 0)
            newElement1.innerHTML += `${int}`;
        else
            newElement1.innerHTML += `${int}<sup>${a}</sup>/<sub>${b}</sub>`;
    }
    else if (act == '/') {
        console.log('/');

        //переводим целые числа в числитель
        let a = ((+dividend1) + (integer1 * divider1)) * divider2;
        let b = ((+dividend2) + (integer2 * divider2)) * divider1;

        let int = Math.round(a / b);
        a = a % b;


        newElement1.innerHTML = `${integer1}<sup>${dividend1}</sup>/<sub>${divider1}</sub> / 
                                 ${integer2}<sup>${dividend2}</sup>/<sub>${divider2}</sub> =`;

        if (NOD(a, b) != 1) {
            a /= NOD(a, b);
            b /= NOD(a, b);
        }
        
        if ((a == 0 || a == -0) && int == 0)
            newElement1.innerHTML += " 0"
        else if (int == 0) {
            newElement1.innerHTML += `<sup>${a}</sup>/<sub>${b}</sub>`;
        }
        else if (a == 0)
            newElement1.innerHTML += `${int}`;
        else 
            newElement1.innerHTML += `${int}<sup>${a}</sup>/<sub>${b}</sub>`;
    }
}