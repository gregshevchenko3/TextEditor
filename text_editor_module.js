window.addEventListener('load', ()=>{
    (()=>{
        var editors = [];
        let new_action = ()=>{
            editors[editors.length] = {editor: new TextEditor('Untitled-' + (editors.length + 1)), blob: null};
        }

        let theFile = document.getElementById('customOpenFileInput');
        theFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const filereader = new FileReader();
            filereader.onloadend = (e)=>{   
                editors[editors.length] = {editor: new TextEditor(file.name), blob: file};
                let editor = editors[editors.length - 1].editor;
                let lines = e.target.result.split("\n");
                for(let line of lines)
                    editor.append_line(line);
            };
            filereader.readAsText(file);
        }, false);
        let open_action = ()=>{
            var event = document.createEvent("MouseEvents");
            event.initEvent('click', true, false);
            theFile.dispatchEvent(event);
        }
        let save_action = (e)=>{
            let a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            
        }

        let new_actions = document.body.getElementsByClassName('customNewFileButton');
        for(let action of new_actions)
            action.addEventListener('click', new_action);
        let open_actions = document.body.getElementsByClassName('customOpenFileButton');
        for(let action of open_actions)
            action.addEventListener('click', open_action);
        let save_actions = document.body.getElementsByClassName('customSaveFileButton');
        for(let action of save_actions)
            action.addEventListener('click', save_action);
    })()
});
