document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // FERRAMENTA 1: MEDIDOR DE FORÇA DE SENHA (LÓGICA MELHORADA)
    // =============================================
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        const togglePassword = document.getElementById('toggle-password');
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');
        
        // Critérios
        const lengthCriteria = document.getElementById('length-criteria');
        const uppercaseCriteria = document.getElementById('uppercase-criteria');
        const numberCriteria = document.getElementById('number-criteria');
        const symbolCriteria = document.getElementById('symbol-criteria');

        const updateCriteria = (password) => {
            // Checa cada critério com Regex
            const hasLength = password.length >= 12;
            const hasUppercase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSymbol = /[^A-Za-z0-9]/.test(password);

            // Atualiza a UI para cada critério
            updateCriteriaItem(lengthCriteria, hasLength);
            updateCriteriaItem(uppercaseCriteria, hasUppercase);
            updateCriteriaItem(numberCriteria, hasNumber);
            updateCriteriaItem(symbolCriteria, hasSymbol);
        };

        const updateCriteriaItem = (element, isValid) => {
            const icon = element.querySelector('i');
            if (isValid) {
                element.classList.remove('invalid');
                element.classList.add('valid');
                icon.className = 'ri-checkbox-circle-line';
            } else {
                element.classList.remove('valid');
                element.classList.add('invalid');
                icon.className = 'ri-close-circle-line';
            }
        };

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const result = zxcvbn(password);

            // Atualiza a barra de progresso
            const strengthPercentage = (result.score + 1) * 20;
            strengthBar.style.width = `${strengthPercentage}%`;
            strengthBar.className = 'strength-bar';
            let text = '';
            switch (result.score) {
                case 0:
                case 1: strengthBar.classList.add('weak'); text = 'Senha Fraca'; break;
                case 2:
                case 3: strengthBar.classList.add('medium'); text = 'Senha Média'; break;
                case 4: strengthBar.classList.add('strong'); text = 'Senha Forte'; break;
            }
            strengthText.textContent = text;
            
            // Atualiza os critérios visuais
            updateCriteria(password);
        });

        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePassword.className = isPassword ? 'ri-eye-off-line' : 'ri-eye-line';
        });
    }

    // =============================================
    // FERRAMENTA 2: GERADOR DE SENHAS SEGURAS (NOVA)
    // =============================================
    const generatedPasswordField = document.getElementById('generated-password');
    if (generatedPasswordField) {
        const lengthSlider = document.getElementById('password-length');
        const lengthValue = document.getElementById('length-value');
        const includeUppercase = document.getElementById('include-uppercase');
        const includeNumbers = document.getElementById('include-numbers');
        const includeSymbols = document.getElementById('include-symbols');
        const generateBtn = document.getElementById('generate-btn');
        const copyBtn = document.getElementById('copy-btn');

        const charsets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        const generatePassword = () => {
            let masterCharset = charsets.lowercase;
            if (includeUppercase.checked) masterCharset += charsets.uppercase;
            if (includeNumbers.checked) masterCharset += charsets.numbers;
            if (includeSymbols.checked) masterCharset += charsets.symbols;

            let newPassword = '';
            if (masterCharset.length > 0) {
                for (let i = 0; i < lengthSlider.value; i++) {
                    newPassword += masterCharset.charAt(Math.floor(Math.random() * masterCharset.length));
                }
            }
            generatedPasswordField.value = newPassword;
        };

        lengthSlider.addEventListener('input', (e) => {
            lengthValue.textContent = e.target.value;
        });

        generateBtn.addEventListener('click', generatePassword);
        
        copyBtn.addEventListener('click', () => {
            if (generatedPasswordField.value) {
                navigator.clipboard.writeText(generatedPasswordField.value).then(() => {
                    copyBtn.innerHTML = '<i class="ri-check-line"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="ri-file-copy-line"></i>';
                    }, 2000);
                });
            }
        });

        generatePassword();
    }
    
    // =============================================
    // FERRAMENTA 3: CRIPTOGRAFIA E DESCRIPTOGRAFIA (AES)
    // =============================================
    const encryptBtn = document.getElementById('encrypt-btn');
    if (encryptBtn) {
        const plainTextInput = document.getElementById('plain-text');
        const secretKeyInput = document.getElementById('secret-key');
        const decryptBtn = document.getElementById('decrypt-btn');
        const cipherTextInput = document.getElementById('cipher-text');

        encryptBtn.addEventListener('click', () => {
            const plaintext = plainTextInput.value;
            const secretKey = secretKeyInput.value;
            if (!plaintext || !secretKey) {
                alert('Por favor, preencha o texto e a chave secreta.');
                return;
            }
            const encrypted = CryptoJS.AES.encrypt(plaintext, secretKey).toString();
            cipherTextInput.value = encrypted;
        });

        decryptBtn.addEventListener('click', () => {
            const ciphertext = cipherTextInput.value;
            const secretKey = secretKeyInput.value;
             if (!ciphertext || !secretKey) {
                alert('Por favor, preencha o texto criptografado e a chave secreta.');
                return;
            }
            try {
                const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);
                if(originalText) {
                    plainTextInput.value = originalText;
                } else {
                    alert('Falha ao descriptografar. A chave secreta está incorreta ou o texto está corrompido.');
                }
            } catch (error) {
                alert('Falha ao descriptografar. Verifique a chave e o texto.');
                console.error("Erro de descriptografia:", error);
            }
        });
    }

    // =============================================
    // FERRAMENTA 4: DEMONSTRADOR DE HASHING
    // =============================================
    const hashInput = document.getElementById('hash-input');
    if(hashInput) {
        const hashAlgorithmSelect = document.getElementById('hash-algorithm');
        const hashOutput = document.getElementById('hash-output');

        const updateHash = () => {
            if (!hashInput) return;
            const inputText = hashInput.value;
            const algorithm = hashAlgorithmSelect.value;
            
            if (inputText.length === 0) {
                hashOutput.textContent = '';
                return;
            }

            let hash;
            switch (algorithm) {
                case 'SHA256':
                    hash = CryptoJS.SHA256(inputText).toString(CryptoJS.enc.Hex);
                    break;
                case 'SHA512':
                    hash = CryptoJS.SHA512(inputText).toString(CryptoJS.enc.Hex);
                    break;
                case 'MD5':
                    hash = CryptoJS.MD5(inputText).toString(CryptoJS.enc.Hex);
                    break;
            }
            hashOutput.textContent = hash;
        };

        hashInput.addEventListener('input', updateHash);
        hashAlgorithmSelect.addEventListener('change', updateHash);
    }
    
    // =============================================
    // FERRAMENTA 5: ANALISADOR DE URL (NOVA)
    // =============================================
    const analyzeUrlBtn = document.getElementById('analyze-url-btn');
    if(analyzeUrlBtn) {
        const urlInput = document.getElementById('url-input');
        const urlResults = document.getElementById('url-results');

        analyzeUrlBtn.addEventListener('click', () => {
            let urlString = urlInput.value.trim();
            urlResults.innerHTML = '';

            if (!urlString) {
                urlResults.innerHTML = '<p>Por favor, insira uma URL.</p>';
                return;
            }
            
            if (!/^https?:\/\//i.test(urlString)) {
                urlString = 'http://' + urlString;
            }

            try {
                const url = new URL(urlString);
                const resultsList = document.createElement('ul');

                // 1. Checa HTTPS
                const usesHttps = url.protocol === 'https:';
                resultsList.innerHTML += `
                    <li class="${usesHttps ? 'valid' : 'invalid'}">
                        <i class="ri-${usesHttps ? 'shield-check' : 'shield-cross'}-line"></i>
                        ${usesHttps ? 'Usa HTTPS (Conexão Segura)' : 'Não usa HTTPS (Conexão Insegura)'}
                    </li>
                `;

                // 2. Explica as partes da URL
                 resultsList.innerHTML += `
                    <li><strong>Protocolo:</strong> ${url.protocol.slice(0, -1)}</li>
                    <li><strong>Domínio:</strong> ${url.hostname}</li>
                    <li><strong>Caminho:</strong> ${url.pathname === '/' ? 'Nenhum' : url.pathname}</li>
                `;

                urlResults.appendChild(resultsList);

            } catch (error) {
                urlResults.innerHTML = '<p class="invalid">URL inválida. Verifique o formato.</p>';
            }
        });
    }

});