console.log("Lütfen oyunu oyna!");
console.log("Konsol kısmına 'play()' yazın ve Enter'a basın.");

function play() {
  console.log("OYUN BAŞLADI!");
  var score = 0;
  var question;
  var answer;
  var input;
  var questions = [
    {
      question: "En yüksek dağ hangisidir?",
      answer: "Everest",
    },
    {
      question: "En büyük okyanus hangisidir?",
      answer: "Pasifik Okyanusu",
    },
    {
      question: "En küçük kontinent hangisidir?",
      answer: "Avustralya",
    },
    {
      question: "En uzun nehir hangisidir?",
      answer: "Nil Nehri",
    },
    {
      question: "En çok nüfuslu ülke hangisidir?",
      answer: "Çin",
    },
  ];
  for (var i = 0; i < questions.length; i++) {
    question = questions[i].question;
    answer = questions[i].answer;
    input = prompt(question).toLowerCase();
    if (input === answer.toLowerCase()) {
      console.log("Doğru cevap! Skorun: " + ++score);
    } else {
      console.log("Yanlış cevap. Skorun: " + score);
    }
  }
  console.log("Oyun bitti. Skorun: " + score);
}
