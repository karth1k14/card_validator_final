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
  
  // DOM Elements
  const form = document.querySelector('form');
  const ccNumInput = document.querySelector('#cc-number');
  const resultDiv = document.querySelector('#result');
  const cardTypeDiv = document.querySelector('#card-type');
  const cardLogo = document.querySelector('#card-logo');
  const resetBtn = document.querySelector('#resetBtn');
  const copyBtn = document.querySelector('#copyBtn');
  const errorMessageDiv = document.querySelector('#error-message');
  
  // Initialize Cleave.js for input formatting (inserting spaces between every 4 digits)
  var cleave = new Cleave('#cc-number', {
    delimiter: ' ',
    blocks: [4, 4, 4, 4],
    numericOnly: true,
  });
  
  // Update card type, error message, and logo dynamically as user types
  ccNumInput.addEventListener('input', function () {
    // Check for invalid characters (allow only digits and spaces)
    if (!/^[0-9\s]*$/.test(ccNumInput.value)) {
      errorMessageDiv.textContent = "Invalid characters detected. Please use only digits.";
    } else {
      errorMessageDiv.textContent = "";
    }
  
    const cardType = getCardType(ccNumInput.value);
    cardTypeDiv.textContent = cardType !== 'Unknown' ? `Card Type: ${cardType}` : '';
  
    // Define relative paths for card logos
    const cardLogos = {
      Visa: 'photos/visa.jpg',
      MasterCard: 'photos/mastercard.png',
      Amex: 'photos/amex.png',
      Discover: 'photos/discover.jpg',
      DinersClub: 'photos/dinersclub.jpg',
      JCB: 'photos/jcb.png',
    };
  
    if (cardType in cardLogos) {
      cardLogo.src = cardLogos[cardType];
      cardLogo.style.display = 'block';
    } else {
      cardLogo.style.display = 'none';
    }
  });
  
  // Form submission handling (validation)
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  
    // If there's an error (e.g., invalid characters), do not proceed with validation
    if (errorMessageDiv.textContent) {
      resultDiv.textContent = "Please correct the errors before validation.";
      return;
    }
  
    const ccNum = ccNumInput.value;
    const isValid = validateCreditCardNumber(ccNum);
    const cardType = getCardType(ccNum);
  
    if (isValid) {
      resultDiv.textContent = `✅ Valid ${cardType} card number`;
      // Add glowing effect to the input field
      ccNumInput.classList.add('glow');
      // Remove the glow after 2 seconds
      setTimeout(() => {
        ccNumInput.classList.remove('glow');
      }, 2000);
    } else {
      resultDiv.textContent = `❌ Invalid ${cardType} card number`;
      ccNumInput.classList.remove('glow');
    }
  });
  
  // Copy button functionality
  copyBtn.addEventListener('click', function () {
    const cardNumber = ccNumInput.value;
    if (cardNumber.trim() === '') {
      resultDiv.textContent = "Nothing to copy!";
      return;
    }
    navigator.clipboard.writeText(cardNumber)
      .then(() => {
        resultDiv.textContent = "Card number copied to clipboard!";
        setTimeout(() => {
          resultDiv.textContent = "";
        }, 2000);
      })
      .catch(() => {
        resultDiv.textContent = "Failed to copy card number.";
      });
  });
  
  // Reset button functionality
  resetBtn.addEventListener('click', function () {
    ccNumInput.value = '';
    cleave.setRawValue('');  // Reset Cleave.js internal state
    resultDiv.textContent = '';
    cardTypeDiv.textContent = '';
    errorMessageDiv.textContent = '';
    cardLogo.style.display = 'none';
    ccNumInput.classList.remove('glow');
  });

  
