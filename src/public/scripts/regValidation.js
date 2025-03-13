import debounce from './utils/debounce.js';
const validationMessages = {
    email: {
        valueMissing: 'You need to enter an email adress.',
        typeMismatch: 'Please enter a valid email adress.',
    },
    password: {
        valueMissing: 'You need to enter a password.',
        patternMismatch: 'Password must be at least 8 characters and contain a mix of letters and numbers.',
    },
    'password-confirm': {
        valueMissing: 'Please confirm your password.',
        mismatch: 'Passwords do not match.',
    },
};
function checkPasswordMatch() {
    const registrationForm = document.querySelector('#register');
    if (!registrationForm)
        return;
    const pwdField = registrationForm.querySelector('input[name="password"]');
    const confirmPwdField = registrationForm.querySelector('input[name="password-confirm"]');
    return pwdField.value === confirmPwdField.value;
}
function setPasswordMatchValidity(input) {
    if (!input.value) {
        input.setCustomValidity('');
        return;
    }
    const isMatch = checkPasswordMatch();
    if (!isMatch) {
        input.setCustomValidity('Passwords do not match');
    }
    else {
        input.setCustomValidity('');
    }
}
function showValidationError(input, message) {
    const messages = validationMessages[input.name];
    if (!messages)
        return;
    message.textContent = '';
    if (input.validity.valueMissing) {
        message.textContent = messages.valueMissing;
    }
    else if (input.validity.typeMismatch) {
        message.textContent = messages.typeMismatch;
    }
    else if (input.validity.patternMismatch || input.validity.tooShort) {
        message.textContent = messages.patternMismatch;
    }
    else if (input.validity.customError && input.name === 'password-confirm') {
        message.textContent = messages.mismatch;
    }
}
function validateInput(input, message) {
    if (input.name === 'password-confirm') {
        setPasswordMatchValidity(input);
    }
    if (input.validity.valid) {
        message.textContent = '';
        message.classList.add('hidden');
    }
    else {
        message.classList.remove('hidden');
        showValidationError(input, message);
    }
}
export default function setupSignInValidators() {
    const registrationForm = document.querySelector('#register');
    if (!registrationForm)
        return;
    const emailInput = registrationForm.querySelector('input[name="email"]');
    const pwdInput = registrationForm.querySelector('input[name="password"]');
    const confirmPwdInput = registrationForm.querySelector('input[name="password-confirm"]');
    const emailMsgElement = registrationForm.querySelector('#email-message');
    const pwdMsgElement = registrationForm.querySelector('#password-message');
    const confirmPwdMsgElement = registrationForm.querySelector('#password-confirm');
    const addValidation = (input, messageElement) => {
        const validate = () => validateInput(input, messageElement);
        input.addEventListener('input', debounce(validate, 300));
        input.addEventListener('blur', validate);
    };
    addValidation(emailInput, emailMsgElement);
    addValidation(pwdInput, pwdMsgElement);
    addValidation(confirmPwdInput, confirmPwdMsgElement);
    pwdInput.addEventListener('input', debounce(() => {
        if (confirmPwdInput.value) {
            validateInput(confirmPwdInput, confirmPwdMsgElement);
        }
    }, 300));
}
