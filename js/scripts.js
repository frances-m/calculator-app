const app = {};

app.$body = $( "body" );
app.$themesSlider = $( "#themes-slider" );

app.$display = $( "#result" );
app.$keypadBtn = $( ".keypad__btn" );

app.$displayContainer = $( "#result-container" );

app.displayValue = "";
app.prevValue = 0;
app.nextOperation = "";
app.lastInput = "";
app.needsReset = false;


app.init = () => {
    app.setTheme();
}

/*** THEMES ***/
// swaps class of the body element
app.swapThemes = (theme) => {
    app.$body.removeClass();
    app.$body.addClass(theme);
}

// calls app.swapThemes() based on user interaction with the themes slider
app.setTheme = () => {
    switch (app.$themesSlider.val()) {
        case "1":
            app.swapThemes("theme-one");
            break;
        case "2":
            app.swapThemes("theme-two");
            break;
        case "3":
            app.swapThemes("theme-three");
            break;
        default:
            app.$themesSlider.val("1");
            app.swapThemes("theme-one");
    }
}


/*** CALCULATOR ***/
app.updateDisplayValue = (val, reset = false) => {
    if (reset) {
        app.displayValue = val;
    } else {
        app.displayValue += val;
    }
    
    app.$display.val(app.displayValue).html(app.displayValue);
}


app.prepDisplayReset = (nextOperation, prevValue) => {
    app.nextOperation = nextOperation;
    app.prevValue = prevValue;
    app.needsReset = true;
}

app.calculate = () => {
    const numOne = Number(app.prevValue);
    const numTwo = Number(app.displayValue);
    let result = 0;

    switch (app.nextOperation) {
        case "+":
            result = numOne + numTwo;
            break;
        case "-":
            result = numOne - numTwo;
            break;
        case "*":
            result = numOne * numTwo;
            break;
        case "/":
            result = numOne / numTwo;
            break;
    }

    app.updateDisplayValue(`${result}`, true);
}

app.handleInput = (input) => {

    if (app.needsReset) {
        app.displayValue = "";
        app.needsReset = false;
    }
    
    switch (input) {
        case "+":  
        case "-":
        case "*":
        case "/":
            app.prepDisplayReset(input, app.displayValue);
            break;
    
        case "Delete":
        case "Backspace":
            app.displayValue = app.displayValue.slice(0, -1);
            if (app.displayValue === "") {
                app.displayValue = "0";
                app.needsReset = true;
            }
            app.updateDisplayValue(app.displayValue, true);
            break;

        case "Reset":
        case "Escape":
            app.updateDisplayValue("0", true);
            app.prepDisplayReset("", "");
            break;
    
        case "=":
            const freezeValue = app.displayValue;

            app.calculate();

            if (app.lastInput !== "=") {
                app.prevValue = freezeValue;
            } 
            
            if (app.displayValue === "0") {
                app.needsReset = true;
            }
            break;
    
        default:
            if (input === "0" && app.displayValue === "") {
                break;
            }

            app.updateDisplayValue(input);
    }

    app.lastInput = input;
}


app.handleKeyboardInput = ({ key }) => {
    const eligibleKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "*", "/", "Delete", "Backspace", "Escape", "="];

    if (eligibleKeys.includes(key)) {
        app.handleInput(key);
    }
}


$(() => {
    app.init();
    app.$themesSlider.change(() => app.setTheme());
    app.$keypadBtn.click((event) => app.handleInput(event.currentTarget.attributes.value.value));
    $(window).keydown((event) => app.handleKeyboardInput(event));
});