class Calculator {
    constructor(option) {
        this.calc = option.calc;
        this.curOper = option.curOper;
        this.prevOper = option.prevOper;
        this.firstOperand = undefined;
        this.secondOperand = undefined;
        this.operation = '';
        this.numberSignNegative = false;
        this.nextOperation = false;
        this.finishFlag = false;
        this.flagDiffOperation = false;
        this.flagDegre=false;
    }

    /**
     * Извлекае квадратный корень из числа
     */
    getSqr() {
        let num = Number(this.curOper.innerText);
        if (num < 0) {
            this.curOper.innerText = "Ошибка извлечения корня из отрицательного числа";
            this.flagDiffOperation = true;
            return null;
        }
        this.flagDiffOperation = true;
        let result = Math.sqrt(num)
        this.curOper.innerText = String(result).length > 15 ? result.toFixed(15) : result;
    }

    /**
     * Возводит введенное число в степень
     */
    getDegree() {
        if (this.flagDegre===false) {
            this.flagDiffOperation = true;
            this.flagDegre=true;
            this.firstOperand = Number(this.curOper.innerText);
            this.prevOper.innerText = this.firstOperand+"^";
                //String(result).length > 15 ? result.toExponential(10) : result;
        }
        else if (this.flagDegre===true){
            this.flagDegre=false;
            this.finishFlag=true;
            this.prevOper.innerText+=this.curOper.innerText+'=';
            this.curOper.innerText=Math.pow(Number(this.firstOperand),Number(this.curOper.innerText))
        }
    }

    /**
     * Начало выполнения операции
     * @param action Вид(знак) операции
     */
    startOperation(action) {
        if (this.flagDiffOperation === true) {
            this.flagDiffOperation = false;
            this.numberSignNegative = false;
            if (isNaN(Number(this.curOper.innerText))) {
                this.curOper.innerText = '0';
                return null;
            }
        }

        if (this.numberSignNegative) {
            this.numberSignNegative = false;
        }
        if (this.secondOperand === undefined) {
            this.secondOperand = Number(this.curOper.innerText);
            this.firstOperand = this.curOper.innerText;
            this.operation = action;
            this.prevOper.innerText = String(this.secondOperand) + this.operation;
            this.nextOperation = true;
        } else if (this.firstOperand !== this.curOper.innerText || !this.nextOperation) {
            this.secondOperand = this.performOperation(this.secondOperand, Number(this.curOper.innerText), this.operation);
            this.operation = action;
            this.prevOper.innerText += this.curOper.innerText + action;
            this.curOper.innerText = this.secondOperand;
            this.firstOperand = this.curOper.innerText;
            this.nextOperation = true;
        }

        if (this.nextOperation) {
            this.operation = action;
            this.prevOper.innerText = this.prevOper.innerText.slice(0, this.prevOper.innerText.length - 1) + this.operation;
        }


    }

    /**
     * Завершение операции вычисления
     */
    finishOperation() {
        if (this.flagDegre===true){
            this.flagDegre=false;
            this.finishFlag=true;
            this.prevOper.innerText+=this.curOper.innerText+'=';
            this.curOper.innerText=Math.pow(Number(this.firstOperand),Number(this.curOper.innerText))
        }
        else if(this.finishFlag !== true){
            this.startOperation('=')
            this.finishFlag = true;
            this.curOper.innerText = this.preparDataOutput(this.secondOperand);
        }
        else{
            this.dataReset();
        }
    }

    /**
     * Выполняет арифметические операции с числами
     * @param num1 Первое число
     * @param num2 Второе число
     * @param oper Вид операции
     * @returns {number} Результат операции
     */
    performOperation(num1, num2, oper) {
        let multi = this.getNumAfterPoint(num1);
        if (multi < this.getNumAfterPoint(num2)) {
            multi = this.getNumAfterPoint(num2);
        }
        if (multi !== 0 && (oper==='+' || oper==='-')) {
            num1 *= Math.pow(10, multi);
            num2 *= Math.pow(10, multi);
        }
        if (multi !== 0 && (oper==='*' || oper==='/')) {
            num1 *= Math.pow(10, multi);
        }
        let result;
        switch (oper) {
            case '+':
                result = Number(num1) + Number(num2);
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                result = num1 / num2;
                break;
        }
        result = multi === 0 ? result : (result / Math.pow(10, multi));
        return this.preparDataOutput(result);
    }

    /**
     * Подготовка результата вычисления к выводу
     * @param result Исходное числовое значение
     * @returns {string|*} Значение адаптированное для вывода
     */
    preparDataOutput(res){
        let result=String(res)
        if (result.split('.')[0].length > 15 ) {
            return Number(result).toExponential(10);
        } else if (result.indexOf('.') !== -1 && result.length>15) {
            if(result.indexOf('e') !== -1){
                return Number(result).toExponential(10);
            }
            let nBefore=result.split('.')[0].length;
            return Number(result).toFixed(15-nBefore);
        }
        return result;
    }
    /**
     * Возвращает количество цифр после запятой для числа
     * @param num Передаваемое число
     * @returns {*} Количество цифр после запятой
     */
    getNumAfterPoint(num) {
        let str = String(num);
        if (str.indexOf('.') !== -1) {
            let strAfterPoint = str.split('.')[1];
            return strAfterPoint.length;
        }
        return 0;
    }

    /**
     * Изменяет знак числа на противоположный
     */
    changeSign() {
        if (this.curOper.innerText.length === 0) {
            return null;
        }
        if (this.curOper.innerText.length === 1 && this.curOper.innerText[0] === '0') {
            return null;
        }
        let arraySymbols = this.curOper.innerText.split('');
        if (this.numberSignNegative) {
            this.numberSignNegative = false;
            arraySymbols.splice(0, 1);
        } else {
            this.numberSignNegative = true;
            arraySymbols.unshift('-');
        }
        this.curOper.innerText = arraySymbols.join('');
    }

    /**
     * Отвечает за заполнение основного поля вывода (curOper)
     * @param {string} num Значение нажатой клавиши
     */
    addNumForOperation(num) {
        if (this.flagDiffOperation === true) {
            this.curOper.innerText = '0';
            this.numberSignNegative = false;
            this.flagDiffOperation = false;
        }
        if (this.finishFlag) {
            this.dataReset();
        }
        if (this.nextOperation) {
            this.nextOperation = false;
            this.curOper.innerText = '0';
        }
        if (this.curOper.innerText.length === 1 && num === '0' && this.curOper.innerText[0] === '0') {
            return null;
        }
        if (num === '.' && this.curOper.innerText.indexOf(num) !== -1) {
            return null;
        }
        if (this.curOper.innerText.length === 0 && num === '.') {
            this.curOper.innerText = '0';
        }
        if (this.curOper.innerText[0] === '0' && num !== '.' && this.curOper.innerText.length <= 1) {
            this.curOper.innerText = '';
        }
        if (this.curOper.innerText.length>12){
            return null;
        }
        this.curOper.innerText += num;
    }

    /**
     * Удаляет последнюю цифру введенного числа
     */
    clearLastNum() {
        let masSymbols = curOper.innerText.split('');
        masSymbols.pop();
        curOper.innerText = masSymbols.join('');
    }

    /**
     * Очищает поле от последнего введенного числа
     */
    clearCurOper() {
        curOper.innerText = '0';
        this.numberSignNegative = false;
        this.flagDiffOperation = false;

    }

    /**
     * Сбрасывает весь процесс вычисления
     */
    clearAllOper() {
        this.dataReset();
    }

    /**
     * Сброс основных параметров
     */
    dataReset() {
        curOper.innerText = '0';
        prevOper.innerText = '';
        this.firstOperand = undefined;
        this.secondOperand = undefined;
        this.operation = '';
        this.numberSignNegative = false;
        this.nextOperation = false;
        this.finishFlag = false;
        this.flagDiffOperation = false;
        this.flagDegre=false;
    }

}

const calc = document.getElementById('calc');
const curOper = document.getElementById('curOper');
const prevOper = document.getElementById('prevOper');

const myCalc = new Calculator({
    ['calc']: calc,
    ['curOper']: curOper,
    ['prevOper']: prevOper
});
calc.addEventListener('click', function (e) {
    let btn = e.target;
    while (btn.localName !== 'button') {
        btn = btn.parentNode;
    }

    if ('number' in btn.dataset) {
        myCalc.addNumForOperation(btn.innerText);
    }
    if ('delete' in btn.dataset) {
        myCalc.clearLastNum();
    }
    if ('lastnumclear' in btn.dataset) {
        myCalc.clearCurOper();
    }
    if ('allclear' in btn.dataset) {
        myCalc.clearAllOper();
    }
    if ('revert' in btn.dataset) {
        myCalc.changeSign();
    }
    if ('operation' in btn.dataset) {
        myCalc.startOperation(btn.innerText);
    }
    if ('equals' in btn.dataset) {
        myCalc.finishOperation();
    }
    if ('degree' in btn.dataset) {
        myCalc.getDegree();
    }
    if ('sqr' in btn.dataset) {
        myCalc.getSqr();
    }
})
