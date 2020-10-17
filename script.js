window.addEventListener('load', ()=>{
    let texteditor = document.getElementsByClassName('texteditor_area')[0];
    let linecounter = document.getElementsByClassName('linecounter')[0];
    
    let rows = 1, cols = 1, current_row = 0, current_col = 0;

    function createFirstLine() {
        let el = document.createElement('div');
        el.innerHTML = "<br>";
        texteditor.append(el);
    }

    function set_cursor(line, column) {
        let range = document.createRange();
        let sel = window.getSelection();

        range.setStart(texteditor.children[line], column+1);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }
    function get_line_element(el_cursor) {
        if(el_cursor.parentNode.isSameNode(texteditor))
            return el_cursor;
        return get_line_element(el_cursor.parentNode);
    }
    function get_cursor(){
        let cursor = window.getSelection();
        cursor.collapseToEnd();
        element = get_line_element(cursor.focusNode);
        var line_num = 0;
        while(element !== texteditor.children[line_num]){
            line_num += 1;
        }
        current_row = line_num;
        current_col = cursor.focusOffset;
    }
    texteditor.focus();
    createFirstLine();
    let element = document.createElement('div');
    linecounter.append(element);

    texteditor.addEventListener('focus', ()=>{
       let cursor = get_cursor();
    })
/*------------------------------------------------------*/
    texteditor.addEventListener('keydown', (e)=>{
        if(e.key === 'F5') return;

        else if(e.key === 'Backspace') {
            if(texteditor.children.length === 0){
                createFirstLine();
                //set_cursor(0, 0);
            } 
            else if (texteditor.children.length === 1 && texteditor.children[0].tagName.toLowerCase() === 'br'){
                texteditor.removeChild(texteditor.children[0]);
                createFirstLine();
                set_cursor(0, 0);
            } else {
                console.log(rows);
                if(cols === 0) {
                    if(rows) {
                        console.log(current_row);
                        linecounter.removeChild(linecounter.children[current_row]);
                        rows = rows - 1;
                        current_row -= 1;
                        console.log(texteditor.children[current_row].innerText.length)
                        cols = texteditor.children[current_row].innerText.length;
                    }
                } else {
                    cols -= 1;
                    current_col -= 1;
                }
            }
        } else if(e.key == 'Delete') {
            console.log(`${current_col} ${cols} ${current_row} ${rows}`);
            if(current_col == cols ) {
                if(current_row < rows) {
                    linecounter.removeChild(linecounter.children[current_row + 1]);
                    current_row -= 1;
                    cols += texteditor.children[current_row].innerText.length;
                } 
            } else {
                cols -= 1;
            }
        }
         else 
            if((e.keyCode >= 48 && e.keyCode <= 57) || 
               (e.keyCode >= 65 && e.keyCode <= 90) ||
               (e.keyCode >= 96 && e.keyCode <= 107) ||
               (e.keyCode >= 109 && e.keyCode <= 111) ||
               (e.keyCode >= 186 && e.keyCode <= 192) ||
               (e.keyCode >= 219 && e.keyCode <= 222) || e.keyCode == 32){
                
               cols += 1;
               current_col += 1
            } else 
                if(e.key === 'Enter'){
                    rows = rows + 1;
                    current_row += 1;
                    current_col = 0;
                    cols = 0;
                    element = document.createElement('div');
                    linecounter.append(element);
                } 
                else if(e.key === 'ArrowDown') {
                    if(current_row+1 < rows) {
                        current_row += 1;
                        cols=texteditor.children[current_row].innerText.length-1;
                        if(current_col > cols) current_col = cols;
                    }
                    console.log(`${current_col} ${cols} ${current_row} ${rows}`);
                }
                else if(e.key === 'ArrowUp') {
                    if(current_row-1 > 0) {
                        current_row -= 1;
                        cols=texteditor.children[current_row].innerText.length-1;
                        if(current_col > cols) current_col = cols;
                    }
                    console.log(`${current_col} ${cols} ${current_row} ${rows}`);
                }
                else if(e.key === 'ArrowRight') {
                    if(current_col+1 < cols) {
                        current_col += 1;
                    }
                }
                else if(e.key === 'ArrowLeft') {
                    if(current_col-1 > 0) {
                        current_col -= 1;
                    }
                }
                
    });
    
})