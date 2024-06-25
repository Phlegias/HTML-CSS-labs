import {weapons} from './data.js';

document.addEventListener("DOMContentLoaded", function() {
    setSortSelects(weapons, document.getElementById("sort-settings"));
    let sort1 = document.getElementById("sort1");
    let sort2 = document.getElementById("sort2");
    
    sort1.onchange = () => {
        changeNextSelect(sort2, sort1);
    }
    
    document.getElementById("sort").onclick = () => {
        sortTable("megatable", document.getElementById("sort-settings"));
    }

    document.getElementById("clear-sort").onclick = () => {
        sort1.value = 0;
        sort1.onchange();
        clearTable("megatable")
        createTable(weapons, "megatable");
    }
});

let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

let setSortSelect = (head, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
    for (let i in head) sortSelect.append(createOption(head[i], Number(i) + 1));
}

export let setSortSelects = (data, dataForm) => {
    let head = Object.keys(data[0]);
    let allSelect = dataForm.getElementsByTagName('select');
    for(let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j > 0) allSelect[j].disabled= true;
    }
}
export let changeNextSelect = (nextSelect, curSelect) => {
    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;
    if (curSelect.value != 0) {
        for (let i = 0; i < nextSelect.options.length; i++) {
            if (nextSelect.options[i].value == curSelect.value) nextSelect.remove(i);
        }
    } else {
        nextSelect.disabled = true;
    }
}

let createSortArr = (dataForm) => {
    let sortArr = [];
    let sortSelects = dataForm.getElementsByTagName('select');
    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort == 0) break;
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push({column: keySort - 1, order: desc});
    }
    return sortArr;
}

export let sortTable = (idTable, dataForm) => {
    let sortArr = createSortArr(dataForm);
    if (sortArr.length === 0) return;
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    rowData.sort((first, second) => {
        for (let i in sortArr) {
            let key = sortArr[i].column;
            if (first.cells[key].innerHTML > second.cells[key].innerHTML) {
                return sortArr[i].order ? -1 : 1;
            } else if (first.cells[key].innerHTML < second.cells[key].innerHTML) {
                return sortArr[i].order ? 1 : -1;
            }
        }
        return 0;
    });

    rowData.forEach(item => {
        table.append(item);
    });
}