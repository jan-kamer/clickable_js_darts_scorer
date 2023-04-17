var totalScore = 0;
var dartsThrown = 0;
var player1;
var player2;
var thrower;
var throwerId;
var startScore;
var throwersScore = 0;

function startNewGame() {
  var startScore = $("input:radio[name='startScore']:checked").val();

  throwersScore = startScore;
  $('.mainScoreboard').show();
  $('#lblStartScore').text(startScore);
  $('#player1Score').val(startScore);
  $('#player2Score').val(startScore);
  $('#player1ScoreNEW').text(startScore);
  $('#player2ScoreNEW').text(startScore);
  $('#player1leftover').text('');
  $('#player2leftover').text('');
  $('#throwInfo').show();


  var player1Name = $('#player1Name').val() != 0 ? $('#player1Name').val() : "Player 1";
  var player2Name = $('#player2Name').val() != 0 ? $('#player2Name').val() : "Player 2";

  player1 = player1Name;
  player2 = player2Name;
  thrower = player1;
  throwerId = 1;

  $("#thrower").text(thrower + " to throw");

  $('#lblPlayer1Name').text(player1Name);
  $('#lblPlayer2Name').text(player2Name);

  $('.playerInfo').hide();
  $('.scoreInput').show();
  $('.scores').show();
  window.scrollTo({ bottom: 0, behavior: 'smooth' });

  console.log('start game with: ' + startScore);
  console.log('start: ' + thrower);
}

function isBust(score, player_score) {
  if ((parseInt(score) > parseInt(player_score)) || ((parseInt(player_score) - parseInt(score)) == 1)) {
    alert("BUST!");
    return true;
  } else {
    return false;
  }
}

function weHaveAWinner(score, playerId) {
  if (score == 0) {
    // callScore(-1);
    var player = '#lblPlayer' + playerId + 'Name';
    var playerName = $(player).text();
    alert(playerName + " wins the leg!");
    return true;
  }
  return false;
}

function newGame() {
  $('.newGame').show();
}

function score(multiple, number) {
  var score1;
  switch (multiple) {
    case 't':
      score1 = number * 3;
      break;
    case 'd':
      score1 = number * 2;
      break;
    case 's':
      score1 = number;
      break;
  }
  return parseInt(score1);
};

$(function () {

  var thrower;

  $('.playerInfo').show();
  $('.scoreInput').hide();
  $('.scores').hide();
  $('.newGame').hide();
  $('.mainScoreboard').hide();
  $('#player1Score').val(startScore);
  $('#player2Score').val(startScore);
  $('#tooltip').hide();

  $('.listItemInput').focus();
  var $listItems;

  $('.btnPlayer2').hide();
  $('#listItemInput2').hide();

  $("#dartboard #areas g").children().hover(
    function () {
      $(this).css("opacity", "0.6");
      $('#selectedBed').text($(this).attr("id"));
      $("#tooltip").show();

    },
    function () {
      $(this).css("opacity", "0.9");
      $("#tooltip").hide();
    }
  )

  $("#dartboard #areas g").children().click(function () {
    var segment = $(this).attr("id");
    var dartScore = 0;
    dartsThrown++;
    var throwOver = false;
    var multiple;
    switch (segment) {
      case "miss":
        dartScore = 0;
        break;
      case "Bull":
        dartScore = 50;
        break;
      case "Outer":
        dartScore = 25;
        break;
      default:
        multiple = segment.charAt(0);
        var number = segment.substring(1);
        dartScore = score(multiple, number);
        break;
    }

    throwersScore -= dartScore;
    console.log("Hit: " + segment + ' = ' + dartScore);

    if ((dartScore > throwersScore) || (dartScore == throwersScore - 1) ||
      (dartScore == throwersScore && (multiple != 'd' || segment != 'Bull'))) {
      throwOver = true;
    }

    if (dartScore == throwersScore && (multiple == 'd' || segment == 'Bull')) {
      throwOver = true;
      throwersScore -= dartScore;
    }

    if (throwOver == false) {
      throwersScore -= dartScore;
    }

    totalScore += dartScore;
    var dart = "#dart" + dartsThrown;

    $('#throwScore').text(totalScore);
    $(dart).text(segment + ' (' + dartScore + ')');

    if (dartsThrown == 3 || throwOver == true) {

      var confirmationBtn = document.getElementById("confirmationBtn");
      confirmationBtn.classList.add("d-flex");
      confirmationBtn.classList.remove("d-none");

    }
  });

  var confirmationBtn = document.getElementById("confirmationBtn");

  confirmationBtn.addEventListener("click", function () {
    endRound();
  })

  function endRound() {

    confirmationBtn.classList.remove("d-flex");
    confirmationBtn.classList.add("d-none");

    processScore(totalScore);
    dartsThrown = 0;
    totalScore = 0;
    switchThrower();
    clearThrow();
  }

  function processScore(score) {
    console.log(throwerId);
    // $listItems = $('#player'+ throwerId + 'Scores');
    var playerScore = "#player" + throwerId + "ScoreNEW";
    var currentScore = parseInt($(playerScore).text());
    var newScore = parseInt(currentScore) - parseInt(score);

    if (!isBust(score, currentScore)) {
      var newScore = currentScore - score;
      $(playerScore).get(0).innerHTML = newScore;

      if (weHaveAWinner(newScore, throwerId)) {
        itemToAdd = "Game Shot!";
        newGame();
      }

      calculateLeftOverPoints(newScore, throwerId);

    }
  }

  function switchThrower() {

    console.log('throwing: ' + throwerId);
    if (throwerId == 1) {
      thrower = player2;
      throwerId = 2;
      $("#thrower").text(thrower + " to throw");
      console.log('next thrower: ' + thrower);
    } else if (throwerId == 2) {
      thrower = player1;
      throwerId = 1;
      $("#thrower").text(thrower + " to throw");
      console.log('next thrower: ' + thrower);
    }
  }

  function clearThrow() {
    for (i = 1; i <= 3; i++) {
      var dart = "#dart" + i;
      $(dart).text("");
    }
    $('#throwScore').text("");
  }

  function calculateLeftOverPoints(score, throwerId) {

    var playerLeftOverField = "#player" + throwerId + "leftover";
    var finishCombination = "";

    if (score === 170) {
      finishCombination = "T20 T20 Bullseye";
    } else if (score === 169) {
      finishCombination = "T20 T19 Bullseye";
    } else if (score === 168) {
      finishCombination = "T20 T20 D24";
    } else if (score === 167) {
      finishCombination = "T20 T19 D25";
    } else if (score === 166) {
      finishCombination = "T20 T18 D26";
    } else if (score === 165) {
      finishCombination = "T20 T19 D24";
    } else if (score === 164) {
      finishCombination = "T20 T18 D25";
    } else if (score === 163) {
      finishCombination = "T20 T17 D26";
    } else if (score === 162) {
      finishCombination = "T20 T20 D21";
    } else if (score === 161) {
      finishCombination = "T20 T17 D25";
    } else if (score === 160) {
      finishCombination = "T20 T20 D20";
    } else if (score === 159) {
      finishCombination = "T20 T19 D21";
    } else if (score === 158) {
      finishCombination = "T20 T20 D19";
    } else if (score === 157) {
      finishCombination = "T20 T19 D20";
    } else if (score === 156) {
      finishCombination = "T20 T20 D18";
    } else if (score === 155) {
      finishCombination = "T20 T19 D19";
    } else if (score === 154) {
      finishCombination = "T20 T18 D20";
    } else if (score === 153) {
      finishCombination = "T20 T19 D18";
    } else if (score === 152) {
      finishCombination = "T20 T20 D16";
    } else if (score === 151) {
      finishCombination = "T20 T17 D20";
    } else if (score === 150) {
      finishCombination = "T20 T18 D18";
    } else if (score === 149) {
      finishCombination = "T20 T19 D16";
    } else if (score === 148) {
      finishCombination = "T20 T20 D14";
    } else if (score === 147) {
      finishCombination = "T20 T17 D18";
    } else if (score === 146) {
      finishCombination = "T20 T18 D16";
    } else if (score === 145) {
      finishCombination = "T20 T15 D20";
    } else if (score === 144) {
      finishCombination = "T20 T20 D12";
    } else if (score === 143) {
      finishCombination = "T20 T17 D16";
    } else if (score === 142) {
      finishCombination = "T20 T14 D20";
    } else if (score === 141) {
      finishCombination = "T20 T19 D12";
    } else if (score === 140) {
      finishCombination = "T20 T20 D10";
    } else if (score === 139) {
      finishCombination = "T19 T14 D20";
    } else if (score === 138) {
      finishCombination = "T20 T18 D12";
    } else if (score === 137) {
      finishCombination = "T20 T19 D10";
    } else if (score === 136) {
      finishCombination = "T20 T20 D8";
    } else if (score == 135) {
      finishCombination = "T20 T15 D20";
    } else if (score == 134) {
      finishCombination = "T20 T14 D20";
    } else if (score == 133) {
      finishCombination = "T20 T19 D8";
    } else if (score == 132) {
      finishCombination = "T20 T16 D12";
    } else if (score == 131) {
      finishCombination = "T20 T13 D16";
    } else if (score == 130) {
      finishCombination = "T20 T20 D5";
    } else if (score == 129) {
      finishCombination = "T19 T16 D12";
    } else if (score == 128) {
      finishCombination = "T18 T14 D16";
    } else if (score == 127) {
      finishCombination = "T20 T17 D8";
    } else if (score == 126) {
      finishCombination = "T19 T19 D6";
    } else if (score == 125) {
      finishCombination = "BULL T20 D20";
    } else if (score == 124) {
      finishCombination = "T20 T16 D4";
    } else if (score == 123) {
      finishCombination = "T19 T10 D18";
    } else if (score == 122) {
      finishCombination = "T18 T18 D7";
    } else if (score == 121) {
      finishCombination = "T20 T15 D8";
    } else if (score == 120) {
      finishCombination = "T20 20 D20";
    } else if (score == 119) {
      finishCombination = "T19 10 D16";
    } else if (score == 118) {
      finishCombination = "T20 18 D20";
    } else if (score == 117) {
      finishCombination = "T20 17 D20";
    } else if (score == 116) {
      finishCombination = "T20 16 D20";
    } else if (score == 115) {
      finishCombination = "T20 15 D20";
    } else if (score == 114) {
      finishCombination = "T20 14 D20";
    } else if (score == 113) {
      finishCombination = "T20 13 D20";
    } else if (score == 112) {
      finishCombination = "T20 12 D20";
    } else if (score == 111) {
      finishCombination = "T20 19 D16";
    } else if (score == 110) {
      finishCombination = "T20 18 D16";
    } else if (score == 109) {
      finishCombination = "T19 12 D20";
    } else if (score == 108) {
      finishCombination = "T20 16 D16";
    } else if (score == 107) {
      finishCombination = "T19 18 D16";
    } else if (score == 106) {
      finishCombination = "T20 10 D18";
    } else if (score == 106) {
      finishCombination = "T20 T18 D16";
    } else if (score == 105) {
      finishCombination = "T20 T15 D15";
    } else if (score == 104) {
      finishCombination = "T18 18 D16";
    } else if (score == 103) {
      finishCombination = "T19 10 D18";
    } else if (score == 102) {
      finishCombination = "T20 10 D16";
    } else if (score == 101) {
      finishCombination = "T17 10 D20";
    } else if (score == 100) {
      finishCombination = "T20 D20";
    } else if (score == 99) {
      finishCombination = "T19 10 D16";
    } else if (score == 98) {
      finishCombination = "T20 D19";
    } else if (score == 97) {
      finishCombination = "T19 D20";
    } else if (score == 96) {
      finishCombination = "T20 D18";
    } else if (score == 95) {
      finishCombination = "T19 D19";
    } else if (score == 94) {
      finishCombination = "T18 D20";
    } else if (score == 93) {
      finishCombination = "T19 D18";
    } else if (score == 92) {
      finishCombination = "T20 D16";
    } else if (score == 91) {
      finishCombination = "T17 D20";
    } else if (score == 90) {
      finishCombination = "T18 D18";
    } else if (score == 89) {
      finishCombination = "T19 D16";
    } else if (score == 88) {
      finishCombination = "T16 D20";
    } else if (score == 87) {
      finishCombination = "T17 D18";
    } else if (score == 86) {
      finishCombination = "T18 D16";
    } else if (score == 85) {
      finishCombination = "T15 D20";
    } else if (score == 84) {
      finishCombination = "T20 D12";
    } else if (score == 83) {
      finishCombination = "T17 D16";
    } else if (score == 82) {
      finishCombination = "Bull D16";
    } else if (score == 81) {
      finishCombination = "T19 D12";
    } else if (score == 80) {
      finishCombination = "T20 D10";
    } else if (score == 79) {
      finishCombination = "T13 D20";
    } else if (score == 78) {
      finishCombination = "T18 D12";
    } else if (score == 77) {
      finishCombination = "T15 D16";
    } else if (score == 76) {
      finishCombination = "T20 D8";
    } else if (score == 75) {
      finishCombination = "T17 D12";
    } else if (score == 74) {
      finishCombination = "T14 D16";
    } else if (score == 73) {
      finishCombination = "T19 D8";
    } else if (score == 72) {
      finishCombination = "T16 D12";
    } else if (score == 71) {
      finishCombination = "T13 D16";
    } else if (score == 70) {
      finishCombination = "T18 D8";
    } else if (score == 69) {
      finishCombination = "19 D20";
    } else if (score == 68) {
      finishCombination = "T20 D4";
    } else if (score === 67) {
      finishCombination = "T17 D8";
    } else if (score === 66) {
      finishCombination = "T10 D18";
    } else if (score === 65) {
      finishCombination = "T19 D4";
    } else if (score === 64) {
      finishCombination = "T16 D8";
    } else if (score === 63) {
      finishCombination = "T13 D12";
    } else if (score === 62) {
      finishCombination = "T10 D16";
    } else if (score === 61) {
      finishCombination = "T15 D8";
    } else if (score === 60) {
      finishCombination = "20 D20";
    } else if (score === 59) {
      finishCombination = "19 D20";
    } else if (score === 58) {
      finishCombination = "18 D20";
    } else if (score === 57) {
      finishCombination = "17 D20";
    } else if (score === 56) {
      finishCombination = "16 D20";
    } else if (score === 55) {
      finishCombination = "15 D20";
    } else if (score === 54) {
      finishCombination = "14 D20";
    } else if (score === 53) {
      finishCombination = "13 D20";
    } else if (score === 52) {
      finishCombination = "12 D20";
    } else if (score === 51) {
      finishCombination = "19 D16";
    } else if (score === 50) {
      finishCombination = "18 D16";
    } else if (score === 49) {
      finishCombination = "17 D16";
    } else if (score === 48) {
      finishCombination = "16 D16";
    } else if (score === 47) {
      finishCombination = "15 D16";
    } else if (score === 46) {
      finishCombination = "6 D20";
    } else if (score === 45) {
      finishCombination = "13 D16";
    } else if (score === 44) {
      finishCombination = "12 D16";
    } else if (score === 43) {
      finishCombination = "11 D16";
    } else if (score === 42) {
      finishCombination = "10 D16";
    } else if (score === 41) {
      finishCombination = "9 D16";
    } else if (score === 40) {
      finishCombination = "D20";
    } else if (score === 39) {
      finishCombination = "7 D16";
    } else if (score === 38) {
      finishCombination = "D19";
    } else if (score === 37) {
      finishCombination = "5 D16";
    } else if (score === 36) {
      finishCombination = "D18";
    } else if (score === 35) {
      finishCombination = "3 D16";
    } else if (score === 34) {
      finishCombination = "D17";
    } else if (score === 33) {
      finishCombination = "1 D16";
    } else if (score === 32) {
      finishCombination = "D16";
    } else if (score === 31) {
      finishCombination = "15 D8";
    } else if (score === 30) {
      finishCombination = "D15";
    } else if (score === 29) {
      finishCombination = "1 D14";
    } else if (score == 28) {
      finishCombination = "T20 D4";
    } else if (score == 27) {
      finishCombination = "T19 D5";
    } else if (score == 26) {
      finishCombination = "T18 D4";
    } else if (score == 25) {
      finishCombination = "T17 D4";
    } else if (score == 24) {
      finishCombination = "T16 D6";
    } else if (score == 23) {
      finishCombination = "T19 D2";
    } else if (score == 22) {
      finishCombination = "T18 D4";
    } else if (score == 21) {
      finishCombination = "T17 D2";
    } else if (score == 20) {
      finishCombination = "T20";
    } else if (score == 19) {
      finishCombination = "T19";
    } else if (score == 18) {
      finishCombination = "T18";
    } else if (score == 17) {
      finishCombination = "T17";
    } else if (score == 16) {
      finishCombination = "T16";
    } else if (score == 15) {
      finishCombination = "T15";
    } else if (score == 14) {
      finishCombination = "T14";
    } else if (score == 13) {
      finishCombination = "T13";
    } else if (score == 12) {
      finishCombination = "T12";
    } else if (score == 11) {
      finishCombination = "T11";
    } else if (score == 10) {
      finishCombination = "D5";
    } else if (score == 9) {
      finishCombination = "D4";
    } else if (score == 8) {
      finishCombination = "D4";
    } else if (score == 7) {
      finishCombination = "D3";
    } else if (score == 6) {
      finishCombination = "D3";
    } else if (score == 5) {
      finishCombination = "D2";
    } else if (score == 4) {
      finishCombination = "D2";
    } else if (score == 3) {
      finishCombination = "D1";
    } else if (score == 2) {
      finishCombination = "D1";
    } else if (score == 1) {
      finishCombination = "D1";
    }

    if (score <= 170) {
      $(playerLeftOverField).text('(' + finishCombination + ')');
    }
  }

  $('.btnStartGame').click(function (e) {
    $('.playerInfo').hide();
    $('.scoreInput').show();
    $('.scores').show();
    startNewGame();
  });

  $('#btnNewGame').click(function (e) {
    startNewGame();
    clearThrow();
    dartsThrown = 0;
    totalScore = 0;

  })

});

window.addEventListener('scroll', function () {
  adjustHeaderPosition();
});

function adjustHeaderPosition() {
  var header = document.querySelector('h1');
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  if (scrollTop > 60) {
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.transition = 'transform 0.3s ease-in-out';
    header.style.fontSize = '32px';
    header.style.paddingTop = '5px';
    header.style.paddingRight = '0px';
    header.style.paddingBottom = '5pxx';
    header.style.paddingLeft = '30px';
  } else {
    header.style.position = 'static';
    header.style.transition = 'none';
    header.style.fontSize = '72px';
    header.style.paddingTop = '60px';
    header.style.paddingRight = '0px';
    header.style.paddingBottom = '0px';
    header.style.paddingLeft = '0px';
  }
}
