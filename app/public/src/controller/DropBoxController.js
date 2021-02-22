class DropBoxController{
    constructor()
    {
        this.btnSendFilesElements = document.querySelector('#btn-send-file');

        this.inputFileElement = document.querySelector('#files');

        this.snackModalElement = document.querySelector('#react-snackbar-root');

        this.progressBarElement = document.querySelector('.mc-progress-bar-fg');

        this.nameFileEl = document.querySelector('.filename');
        this.timeLeftEl = document.querySelector('.timeleft');
        this.initEvents();
    }

    initEvents()
    {
        this.btnSendFilesElements.addEventListener('click', (e) =>{
            this.inputFileElement.click();
        });

        this.inputFileElement.addEventListener('change', (e) =>{
            this.uploadTask(e.target.files);
            this.modalShow(true);
            this.inputFileElement.value = '';

        });

        
    }

    modalShow(show=true)
        {

            this.snackModalElement.style.display = (show) ? 'block' : 'none';
        }
    uploadTask(files)
    {
        let promises = [];
        [...files].forEach((file) =>{
            promises.push(new Promise((resolve, reject) =>{
                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');
                ajax.onload = (event) =>{
                    this.modalShow(false);
                    try{
                        resolve(JSON.parse(ajax.responseText));
                    }
                    catch (err){
                        reject(err);
                    }
                };

                ajax.onerror = (event) =>{
                    this.modalShow(false);
                    reject(event);
                }

                ajax.upload.onprogress = (event)=>{

                    this.uploadProgress(event, file);
                   
                }

                let formData = new FormData();

                formData.append('input-file', file);

                this.startUploadTime = Date.now();
                ajax.send(formData);
            }));
        });
        return Promise.all(promises);

    }

    uploadProgress(event, file)
    {
        let timeSpent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;

        let porcent = parseInt((loaded*100)/total);
        
        let timeLeft = ((100-porcent)*timeSpent)/(porcent);
        this.progressBarElement.style.width = porcent+'%'; 
        
        
        this.nameFileEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeLeft);
    }

    formatTimeToHuman(duration)
    {
        
        let seconds = parseInt((duration/1000)%60);
        let minutes = parseInt((duration/(1000 * 60))%60);
        let hours = parseInt((duration/(1000 * 60 * 60))%24);

        if(hours> 0) return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        if(minutes> 0) return `${minutes} minutos e ${seconds} segundos`;
        if(seconds> 0) return `${seconds} segundos`;

        return '';
    }
}