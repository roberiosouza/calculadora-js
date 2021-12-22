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

        this.setLastNumberToDisplay();
        
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operator = [];
        this.setLastNumberToDisplay();
    }

    clearEnter(){
        this._operator.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operator[this._operator.length-1];
    }

    setLastOperation(value){
        this._operator[this._operator.length-1] = value;
    }

    isOperator(value){
        return (['+', '-', '/', '*', '%'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operator.push(value);        

        if (this._operator.length > 3) {
            
            this.calc();

        }
    }

    calc(){

        let last = '';

        if (this._operator.length > 3){
            let last = this._operator.pop();
        }
        let result = eval(this._operator.join(""));

        if (last == '%') {
            result /= 100;
            this._operator = [result];
        }else{
            this._operator = [result];
            if(last) this._operator.push(last);
        }

        this.setLastNumberToDisplay();
    }

    setLastNumberToDisplay(){
        let lastNumber;

        for(let i = this._operator.length-1; i >=0; i--){
            if (!this.isOperator(this._operator[i])) {
                lastNumber = this._operator[i];
                break;
            }
        }
        if(!lastNumber) lastNumber = 0;
        this.display = lastNumber;
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this.setLastOperation(value);
            }else if (isNaN(value)){
                console.log("Outra coisa");
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else{
            if (this.isOperator(value)){
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                this.setLastNumberToDisplay();
            }
        }
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
                this.addOperation('+');
            break;

            case 'subtracao':
                this.addOperation('-');
            break;

            case 'divisao':
                this.addOperation('/');
            break;

            case 'multiplicacao':
                this.addOperation('*');
            break;

            case 'porcento':
                this.addOperation('%');
            break;

            case 'igual':
               this.calc();
            break;

            case 'ponto':
                this.addOperation('.');
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