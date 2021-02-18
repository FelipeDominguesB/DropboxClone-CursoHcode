class DropBoxController{
    constructor()
    {
        this.btnSendFilesElements = document.querySelector('#btn-send-file');

        this.inputFileElement = document.querySelector('#files');

        this.snackModalElement = document.querySelector('#react-snackbar-root');

        this.initEvents();
    }

    initEvents()
    {
        this.btnSendFilesElements.addEventListener('click', (e) =>{
            this.inputFileElement.click();
        });

        this.inputFileElement.addEventListener('change', (e) =>{
            this.uploadTask(e.target.files);

            this.snackModalElement.style.display = 'block';
        });
    }

    uploadTask(files)
    {
        let promises = [];
        [...files].forEach((element) =>{
            promises.push(new Promise((resolve, reject) =>{
                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');
                ajax.onload = (event) =>{
                    try{
                        resolve(JSON.parse(ajax.responseText));
                    }
                    catch (err){
                        reject(err);
                    }
                };

                ajax.onerror = (event) =>{
                    reject(event);
                }

                let formData = new FormData();

                formData.append('input-file', element);
                ajax.send(formData);
            }));
        });
        return Promise.all(promises);

    }
}