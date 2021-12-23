class CalcController {

    constructor(){
        this._audioOnOff = false;
        this._audio = new Audio('click.mp3');
        this._locale = 'pt-BR';
        this._operator = [];
        this._lastOperator = '';
        this._lastNumber = '';
        this._displayEL = document.querySelector('#display');
        this._dateEL = document.querySelector('#data');
        this._timeEL = document.querySelector('#hora');

        this._currentDate;
        this.initButtonsEvents();
        this.initialize();
        this.initKeyboard();
    }

    initialize(){
        this.displayDateTime();
        setInterval(() => {
            this.displayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn =>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });
        
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }   
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operator = [];
        this._lastNumber = '';
        this._lastOperator = '';
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

    getResult(){
        return eval(this._operator.join(""));
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operator.length < 3){
            let firstItem = this._operator[0];
            this._operator = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operator.length > 3){
            last = this._operator.pop();
            this._lastNumber = this.getResult();
        } else if(this._operator.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last == '%') {
            result /= 100;
            this._operator = [result];
        }else{
            this._operator = [result];
            if(last) this._operator.push(last);
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operator.length-1; i >=0; i--){
            if (this.isOperator(this._operator[i]) == isOperator) {
                lastItem = this._operator[i];
                break;
            }
        }

        if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if((!lastNumber) || (this._operator.length <= 0)) lastNumber = 0;
        this.display = lastNumber;
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this.setLastOperation(value);
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else{
            if (this.isOperator(value)){
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }
    }

    initKeyboard(){
        document.addEventListener('keyup', e=>{
            this.playAudio();
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                break;
    
                case 'Backspace':
                    this.clearEnter();
                break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                break;
    
                case 'Enter':
                case '=':
                   this.calc();
                break;
    
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;
                
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }

        });
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let valor = e.clipboardData.getData('Text');

            this.display = parseFloat(valor);
            this.addOperation(parseInt(valor));
        })
    }

    copyToClipboard(){
        let input = document.createElement('input');

        input.value = this.display;
        document.body.appendChild(input);
        input.select();

        document.execCommand("Copy");
        input.remove();

    }
  

    addDot(){
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    setError(){
        this.display = "Error";
    }

    execBtn(value){

        this.playAudio();

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
                this.addDot();
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