class CalcController {

    constructor(){
        this._locale = 'pt-BR';
        this._operator = [];
        this._displayEL = document.querySelector('#display');
        this._dateEL = document.querySelector('#data');
        this._timeEL = document.querySelector('#hora');

        this._currentDate;
        this.initButtonsEvents();
        this.initialize();
    }

    initialize(){
        this.displayDateTime();
        setInterval(() => {
            this.displayDateTime();
        }, 1000);
        
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operator = [];
    }

    clearAll(){
        this._operator.pop();
    }

    addOperation(value){
       this._operator.push(value);
       console.log(this._operator)
    }

    setError(){
        this.display = "Error";
    }

    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
            break;

            case 'ce':
                this.clearEnter();
            break;

            case 'soma':
                this.soma();
            break;

            case 'subtracao':
                this.subtracao();
            break;

            case 'divisao':
                this.divisao();
            break;

            case 'multiplicacao':
                this.multiplicacao();
            break;

            case 'porcento':
                this.porcento();
            break;

            case 'igual':
                this.igual();
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
        }
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, 'click drag', e=>{                
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{
                btn.style.cursor = "pointer";
            });
        })
    }

    displayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEL.innerHTML;
    }

    set displayTime(value){
        this._timeEL.innerHTML = value;
    }

    get displayDate(){
        return this._dateEL.innerHTML;
    }

    set displayDate(value){
        this._dateEL.innerHTML = value;
    }

    get display(){
        return this._displayEL.innerHTML;
    }

    set display(value){
        this._displayEL.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
}