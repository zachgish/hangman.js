
(function () {
   
    $("#alphabet-keypad").on("click", ".letter-button", pickLetter);

    function pickLetter() {
        var letterPicked = $(this);

        letterPicked
            .removeClass("letter-button")
            .addClass("letter-disabled");

        letterPicked = letterPicked.html();
        handlePickedLetter(letterPicked);
    }

    function handlePickedLetter(letterPicked) {
        var resultMatches = [];
        var ind = currentWord.indexOf(letterPicked);

       
        while (ind !== -1) {
            resultMatches.push(ind);
            ind = currentWord.indexOf(letterPicked, ind + 1);
        }

    
        if (resultMatches.length > 0) {
            var letterBlocks = document.getElementsByClassName("is-letter");
            resultMatches.map(function (num) {

                var domElem = document.createElement("span");
                domElem.innerHTML = currentWordFull[num].toUpperCase();
                letterBlocks[num].appendChild(domElem);
                displayCongratulatoryMessageOnWin();

            });
           
        } else {
            var domElem = document.createElement("div");
            domElem.className = "grave-letter";
            domElem.innerHTML = letterPicked;
            document.getElementById("letter-graveyard").appendChild(domElem);
            hangmanGraphic.addBodyPart();
            displayGameOverMessageOnLose();
        }
    }

    function displayCongratulatoryMessageOnWin() {
        var correctlyGuessedLettersCount = $(".is-letter > span").length;
        if (correctlyGuessedLettersCount === currentWord.length) {
            $("#you_won").modal('show');
        }
    }

    function displayGameOverMessageOnLose() {
        var incorrectlyGuessedLettersCount = $("#letter-graveyard > div").length;
       
        if (incorrectlyGuessedLettersCount === 5) {
            $("#you_lost").modal('show');
            var gameOverMessage = "Uh oh. You took too many tries to guess the word. The correct word is - '" + currentWord + "'. Better luck next time.";
            $(".lead").text(gameOverMessage);
        }
    }

    
    var hangmanGraphic = function () {
        var bodyParts = 0,
            maxParts = 5;
        return {
            addBodyPart: function () {
                if (bodyParts < maxParts) {
                    ++bodyParts;
                    $("#hangman-frame" + bodyParts).css("opacity", 1);
                }
            },

            reset: function () {
                $(".hangman-frames").css("opacity", 0);
                $("#hangman-frame0").css("opacity", 1);
                bodyParts = 0;
                resetAlphabetKeypad();
                removeGraveyardLetters();
                removeCorrectlyGuessedLetters();
                removeFillInTheBlanksAroundOldWord();
                setWordToBeGuessed();
            }
        };
    }();

    
    $(".reset").on("click", hangmanGraphic.reset);

    function resetAlphabetKeypad() {
        $("#alphabet-keypad > .letter-disabled").each(function (index, element) {
            $(element).removeClass().addClass('letter-button');
        });
    }

    function removeGraveyardLetters() {
        $('#letter-graveyard > div').each(function (index, element) {
            $(element).remove();
        });
    }

    function removeCorrectlyGuessedLetters() {
        $('#word-to-guess').each(function (index, element) {
            $(element).children().html('');
        });
    }

    function removeFillInTheBlanksAroundOldWord() {
        $("#word-to-guess").html('');
    }

    
    var hangmanWords = [
        "yoda", "naboo", "jarjar", "darthvader", "darthmaul", "skywalker", "jangofett", "bobafett", "hansolo",
        "jedi", "sith", "force", "chewbacca", "wookiee", "leia", "jaba", "obiwankenobi", "rebel", "empire", "stormtrooper", "clonetrooper",
        "lightsaber", "deathstar", "millenniumfalcon", "lightside", "darkside", "padme"
    ];

    var easyArray = hangmanWords.filter(function (word) {
        return word.length <= 5;
    });

    var hardArray = hangmanWords.filter(function (word) {
        return word.length > 4;
    });

    function wordSelect(array) {
        var num = Math.floor(Math.random() * (array.length - 1));
        var word = array[num];
        return word;
    }

    function setWordToBeGuessed() {

        currentWordFull = wordSelect(hangmanWords);
        currentWord = currentWordFull.toUpperCase();
        
        currentWord.split("").map(function (character) {
            var guessWordBlock = document.getElementById("word-to-guess");

            var domElem = document.createElement("div");
            if (character.match(/[a-z]/i)) {
                domElem.className = "character-block is-letter";

            } else {
                domElem.className = "character-block";
            }

            guessWordBlock.appendChild(domElem);
        });
    }

    var currentWordFull;
    var currentWord;

    setWordToBeGuessed();
})();
