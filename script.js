function getCardType(ccNum) {
  const sanitizedNum = ccNum.replace(/\D/g, ''); // Remove non-numeric characters

  const cardPatterns = {
      Visa: /^4/,
      MasterCard: /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/,
      Amex: /^3[47]/,
      Discover: /^6(?:011|5|4[4-9])/,
      DinersClub: /^3(?:0[0-5]|[68])/,
      JCB: /^(?:35[2-8][0-9])/,
  };

  for (const [card, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(sanitizedNum)) {
          return card;
      }
  }
  return 'Unknown';
}

function validateCreditCardNumber(ccNum) {
  let sanitizedNum = ccNum.replace(/\D/g, '');
  let numArr = sanitizedNum.split('').reverse();
  let total = 0;

  for (let i = 0; i < numArr.length; i++) {
      let digit = parseInt(numArr[i], 10);
      if (i % 2 === 1) {
          digit *= 2;
          if (digit > 9) {
              digit -= 9;
          }
      }
      total += digit;
  }
  return total % 10 === 0;
}

const form = document.querySelector('form');
const ccNumInput = document.querySelector('#cc-number');
const resultDiv = document.querySelector('#result');
const cardTypeDiv = document.querySelector('#card-type');
const cardLogo = document.querySelector('#card-logo');

// Update card type dynamically
ccNumInput.addEventListener('input', function () {
  const cardType = getCardType(ccNumInput.value);
  cardTypeDiv.textContent = cardType !== 'Unknown' ? `Card Type: ${cardType}` : '';
  
  // Show card logo based on type
  const cardLogos = {
      Visa: 'D:\credit card validator\photos\visa.jpg',
      MasterCard: 'D:\credit card validator\photos\mastercard.png',
      Amex: 'D:\credit card validator\photos\amex.png',
      Discover: 'D:\credit card validator\photos\discover.jpg',
      DinersClub: 'D:\credit card validator\photos\dinersclub.jpg',
      JCB: 'D:\credit card validator\photos\jcb.png',
  };

  if (cardType in cardLogos) {
      cardLogo.src = cardLogos[cardType];
      cardLogo.style.display = 'block';
  } else {
      cardLogo.style.display = 'none';
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const ccNum = ccNumInput.value;
  const isValid = validateCreditCardNumber(ccNum);
  const cardType = getCardType(ccNum);

  if (isValid) {
      resultDiv.textContent = `✅ Valid ${cardType} card number`;
  } else {
      resultDiv.textContent = `❌ Invalid ${cardType} card number`;
  }
});
