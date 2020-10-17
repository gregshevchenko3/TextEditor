var TextEditor = (()=>{
    class TextEditor {
        #current_line = undefined;
        #prev_current_line = undefined;
        #checked_element = null;
        #title_element = null;
        #texteditor_element = null;

        constructor(document_name){
            var current_line_highlight = (e) => {
                setTimeout(() => {
                    this.#current_line = this.#get_cursor_position(this.#texteditor_element).row;
                    if(this.#prev_current_line != this.#current_line){
                        if(this.#texteditor_element.children[this.#prev_current_line])
                        this.#texteditor_element.children[this.#prev_current_line].classList.remove('focus');
                        this.#texteditor_element.children[this.#current_line].classList.add('focus');
                        this.#prev_current_line = this.#current_line;
                    }
                }, 5);
            }
            var set_onclickline_highlight = (e) => {
                this.#prev_current_line = this.#current_line;
                this.#current_line = this.#get_cursor_position(this.#texteditor_element).row;
                if(this.#prev_current_line != null) {
                    // this.#texteditor_element.children[this.#prev_current_line].classList.remove('focus');
                    if(this.#prev_current_line != this.#current_line){
                        if(this.#texteditor_element.children[this.#prev_current_line])
                            this.#texteditor_element.children[this.#prev_current_line].classList.remove('focus');
                        this.#texteditor_element.children[this.#current_line].classList.add('focus');
                        this.#prev_current_line = this.#current_line;
                    }   
                } 
            }

            this.#checked_element = document.createElement('input');
            this.#checked_element.setAttribute('id', document_name);
            this.#checked_element.setAttribute('type', 'radio');
            this.#checked_element.setAttribute('name', 'tab-view');
            this.#checked_element.checked = true;

            this.#title_element = document.createElement('label');
            this.#title_element.classList.add('tab');
            this.#title_element.setAttribute('for', document_name);
            this.#title_element.innerHTML = document_name;

            this.#texteditor_element = document.createElement('div');
            this.#texteditor_element.classList.add('texteditor');
            this.#texteditor_element.setAttribute('contenteditable', 'true');
            let form = document.getElementById('tab-view');
            form.appendChild(this.#checked_element);
            form.appendChild(this.#title_element);
            form.appendChild(this.#texteditor_element);

            if(this.#texteditor_element.children.length === 0) {
                this.#create_first_line(this.#texteditor_element);
                this.#current_line = this.#get_cursor_position(this.#texteditor_element).row;
                this.#texteditor_element.children[this.#current_line].classList.toggle('focus');
            }
            
            this.#texteditor_element.addEventListener('input', (e)=>{
                if(e.inputType == 'deleteContentBackward'){
                    /* Подавляє видалення div`a першої строки, якщо перша строка не пуста*/
                    if((this.#texteditor_element.children.length === 1)) {
                        if(this.#texteditor_element.children[0].tagName.toLowerCase() === 'br') {
                            this.#texteditor_element.removeChild(this.#texteditor_element.children[0]);
                        }
                    } 
                    /* Подавляє видалення div`a першої строки, якщо перша строка пуста*/
                    if(this.#texteditor_element.children.length === 0 ) {
                        this.#create_first_line(this.#texteditor_element);
                        this.#current_line = this.#get_cursor_position(this.#texteditor_element).row;
                        this.#texteditor_element.children[this.#current_line].classList.toggle('focus');
                    }
                }
                if(e.inputType == 'insertParagraph'){
                    this.#texteditor_element.lastChild.classList.add('line');
                }
            });
            this.#texteditor_element.addEventListener('keydown', (e)=>{
                if(!e.altKey && !e.ctrlKey) {
                    this.#prev_current_line = this.#current_line;
                    if(e.key == 'Tab'){
                        e.preventDefault();
                        document.execCommand('insertText', false, '\t');
                    }
                }
            });
            this.#texteditor_element.addEventListener('keydown', current_line_highlight);
            this.#texteditor_element.addEventListener('click', set_onclickline_highlight);
        }
        #create_first_line(){
            let element = document.createElement('div');
            element.innerHTML += "<br>";
            element.classList.add('line');
            this.#texteditor_element.appendChild(element);
            this.#set_cursor_position(0, 0);
            this.#texteditor_element.children[0].focus();
        }
        append_line(data){
            document.execCommand('insertText', false, data);
            this.#texteditor_element.lastChild.classList.remove('focus');
            document.execCommand('insertParagraph', false);
            this.#texteditor_element.lastChild.classList.add('focus');
            this.#prev_current_line = this.#current_line;
            this.#current_line = this.#texteditor_element.children.length -1;
        }
        get_line(data){
            console.log(this.#texteditor_element.children[0].innerText);
        }
        #set_cursor_position(row, col){
            let range = document.createRange();
            let sel = window.getSelection();
            
            range.setStart(this.#texteditor_element.children[row], col);
            range.collapse(true);
    
            sel.removeAllRanges();
            sel.addRange(range);
        }
        #get_current_line_element = (el_cursor) => {
            if(el_cursor.classList && el_cursor.classList.contains('line'))
                return el_cursor;
            return this.#get_current_line_element(el_cursor.parentNode);
        }
        #get_cursor_position = () => {
            let sel= window.getSelection();
            sel.collapseToEnd();
            let el = this.#get_current_line_element(sel.focusNode);
            let r = 0;
            while(el !== this.#texteditor_element.children[r]){
                r++;
            }
            return {row: r, column: sel.focusOffset};
        }
    }
    return TextEditor;
})();