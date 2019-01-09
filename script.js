var buttons = document.querySelector('.squares');
var playBtn = document.querySelector('.play');
var resetBtn = document.querySelector('.reset')
var counter = document.querySelector('.counter');
var input = document.querySelector('input');
var switcher = document.querySelector('.switch');
var mode = document.querySelector('.mode h2');

var computerTurnOver, index, sequence, arrayPosition, button, buttonClass, turnRepeated, randomNum, randomColor;
var data = {
    colors: ['green', 'red', 'yellow', 'blue'],
    sequences: {
        regular: {
            computer: [],
            human: []
        },
        hard: []
    },
    sounds: {
        sound1: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        sound2: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        sound3: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        sound4: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
        sound5: new Audio('sounds/Wrong-answer-sound-effect.mp3'),
        sound6: new Audio('sounds/win.mp3')
    },
    count: 0
}
data.sounds.sound5.volume = 0.5;
data.sounds.sound6.volume = 0.5;

var inputGUI = function() {
    input.addEventListener('click', function() {
    if(input.checked) {
        mode.classList.remove('easyMode');
        mode.classList.add('hardMode');
    } else {
        mode.classList.remove('hardMode');
        mode.classList.add('easyMode');
    }
});
}

var humanGUI = function() {
    buttons.addEventListener('click', humanHandler);
    resetBtn.addEventListener('click', reset);  
    resetBtn.style.pointerEvents = 'auto'; 
    buttons.style.pointerEvents = 'auto';
}

var computerGUI = function() {
    playBtn.addEventListener('click', computerHandler);
    playBtn.style.pointerEvents = 'auto';
    switcher.style.pointerEvents = 'auto';
    resetBtn.style.pointerEvents = 'none'
}

var removehumanGUI = function() {
    resetBtn.removeEventListener('click', reset);  
    buttons.removeEventListener('click', humanHandler);        
    buttons.style.pointerEvents = 'none';
    resetBtn.style.pointerEvents = 'none'
}

var removecomputerGUI = function() {
    playBtn.removeEventListener('click', computerHandler);        
    playBtn.style.pointerEvents = 'none';
    switcher.style.pointerEvents = 'none';
}

var humanHandler = function() {
    if(input.checked) {
        turn('human', 'hard');
    } else {
        turn('human', 'regular');
    }
}

var computerHandler = function() {
    if(input.checked) {
        turn('computer', 'hard');
    } else {
        turn('computer', 'regular');
    }
}

var changeColor = function(sound, user, difficulty) {

    function winCheck(user, difficulty) {
        if(data.count === 20) {
            removecomputerGUI();
            removehumanGUI();
            setTimeout(function() {
                counter.innerHTML = 'WIN';
                counter.classList.add('flashy');
                data.sounds.sound6.play();
            }, 300);
            setTimeout(init, 3000);
        } else {
            if(difficulty === 'regular') {
                data.sequences.regular.human.length = 0;
                turnRepeated = false;
            }
            turn(user, difficulty);
        }     
    }

    if(user === 'human') {
        var check = checkHuman(difficulty);
        if(check){
            sound.play()
            switchColorClass('short', user, difficulty);
            humanGUI();
            if(difficulty === 'hard' && data.sequences.hard.length === 0) {
                winCheck('computer', difficulty);             
            } 
            if(difficulty === 'regular' && data.sequences.regular.human.length === data.sequences.regular.computer.length){
                winCheck('computer', difficulty);
            }
        } else {
            data.sounds.sound5.play();
            switchColorClass('long', user, difficulty);
        }
    } else {
        index = 0;
        sound.play();
        switchColorClass('short', user, difficulty);
    }
}   
var checkHuman = function(difficulty) {
    if(difficulty === 'hard') {
        if(buttonClass === data.sequences.hard[0]) {
            data.sequences.hard.shift();
            return true;
        } 
    } else {
        if(buttonClass === data.sequences.regular.computer[index]) {
            index++;
            data.sequences.regular.human.push(buttonClass);
            return true;
        }
    }
}

var computerMovesDisplay = function(user, difficulty) {
        var i = 0;
        var blah = setInterval(function() {
            buttonClass = sequence[i];
            button = document.querySelector('.' + buttonClass);
            determineButton(user, difficulty);
            i++;    
            if(i >= sequence.length) {
                counter.innerHTML = data.count;
                setTimeout(humanGUI, 800);
                clearInterval(blah);
            }
        }, 800);
}

var determineButton = function(user, difficulty) {
    switch (buttonClass) {
        case 'green':
            return changeColor(data.sounds.sound1, user, difficulty);
    
        case 'red':
            return changeColor(data.sounds.sound2, user, difficulty)
        
        case 'yellow':
            return changeColor(data.sounds.sound3, user, difficulty)
          
        case 'blue':
            return changeColor(data.sounds.sound4, user, difficulty)
        default:
            break;
    } 
}

var move = function(user, difficulty) {
    if(user === 'human') {
        button = event.target
        buttonClass = button.className;
        determineButton(user, difficulty);
    } else { 
        if(difficulty === 'hard') {
            sequence = data.sequences.hard;
        } else {
            sequence = data.sequences.regular.computer;
        }
        computerMovesDisplay(user, difficulty);
    }   
}

var sequencer = function(difficulty) {

    function randomColorMaker() {
        randomNum = Math.floor(Math.random() * 4); 
        randomColor = data.colors[randomNum];
    }
    
    if(difficulty === "hard") {
        for(var i = 0; i < data.count; i++) {
            var randomNum = Math.floor(Math.random() * 4); 
            var randomColor = data.colors[randomNum];
            data.sequences.hard.push(randomColor);
        }
        move('computer', 'hard');
    } else {
        if(!turnRepeated) {
            randomColorMaker();
            data.sequences.regular.computer.push(randomColor);
        }     
        move('computer', 'regular');
    }  
}

var switchColorClass = function(length, user, difficulty) {
    button.classList.remove(buttonClass);
    button.classList.add(buttonClass + 'Change');
    if(length === 'short'){
        if(user === 'computer') {
            setTimeout(function() {
                button.classList.remove(buttonClass + 'Change');
                button.classList.add(buttonClass);
            }, 600);
        } else {
            setTimeout(function() {
                button.classList.remove(buttonClass + 'Change');
                button.classList.add(buttonClass);
            }, 200);
        }
    } else {
        removehumanGUI();
        counter.innerHTML = '!!';
        counter.classList.add('flashy');
        setTimeout(function() {
            button.classList.remove(buttonClass + 'Change');
            button.classList.add(buttonClass);
            if(difficulty === 'regular'){
                repeatComputerTurn();
            } else {
                init();
            }
        }, 1200);
    }
}

var turn = function(user, difficulty) {
    if(user === 'computer') {
        removecomputerGUI();
        removehumanGUI();
        setTimeout(function() {
            if(!turnRepeated) {
                data.count++;
            }
            if(difficulty === 'hard') {
                sequencer('hard');
            } else {
                sequencer('regular')
            }
        }, 500);
    } else {
        move('human', difficulty);
    }
}

function init() {
    data.sequences.regular.computer.length = 0;
    data.sequences.regular.human.length = 0;
    data.sequences.hard.length = 0;
    data.count = 0;
    counter.innerHTML = 0;
    counter.classList.remove('flashy');
    computerGUI();
    removehumanGUI();
}


function repeatComputerTurn() {
    console.log(data.sequences.regular.computer)
    data.sequences.regular.human.length = 0;
    turnRepeated = true;
    counter.classList.remove('flashy');
    counter.innerHTML = data.count;
    computerGUI();
    turn('computer', 'regular');
}

function reset() {
    turnRepeated = false;
    init();
    turn('computer', 'regular')
}

inputGUI();
init();


