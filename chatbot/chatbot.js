document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES DO DOM ---
    const chatBody = document.querySelector(".chat-body");
    const messageInput = document.querySelector(".message-input");
    const sendMessageButton = document.querySelector("#send-message");
    const newChatButton = document.querySelector(".new-chat-btn");
    const historyContainer = document.querySelector("#history-container");
    const emojiButton = document.querySelector("#emoji-btn");
    const emojiPicker = document.querySelector(".emoji-picker");

    // --- CONFIGURAÇÕES DA API E PERSONA ---
    const API_KEY = "AIzaSyCnAF56xNx1d_iwshre-5TtyzuVkWybScw"; // <<<<<<<<<<< COLOQUE SUA CHAVE DE API AQUI
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const SYSTEM_INSTRUCTION = {
        role: "system",
        parts: [{
            text: "Você é 'Onio', um assistente virtual especializado em Segurança da Informação. Seu propósito é educar e orientar usuários de todos os níveis de conhecimento sobre práticas seguras no mundo digital. Responda de forma clara, didática e objetiva. Use analogias para explicar conceitos complexos. Sempre priorize a segurança e a ética, nunca fornecendo informações que possam ser usadas para atividades maliciosas. Apresente-se brevemente na primeira mensagem de cada nova conversa."
        }]
    };

    // --- ESTADO DA APLICAÇÃO ---
    let conversations = JSON.parse(localStorage.getItem("conversations")) || {};
    let currentConversationId = localStorage.getItem("currentConversationId") || null;

    // --- FUNÇÕES ---

    const saveState = () => {
        try {
            localStorage.setItem("conversations", JSON.stringify(conversations));
            localStorage.setItem("currentConversationId", currentConversationId);
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
        }
    };

    const renderHistory = () => {
        historyContainer.innerHTML = "";
        Object.keys(conversations).sort((a, b) => b.localeCompare(a)).forEach(id => {
            const convo = conversations[id];
            const listItem = document.createElement("li");
            listItem.dataset.id = id;
            if (id === currentConversationId) listItem.classList.add("active");

            const titleSpan = document.createElement("span");
            titleSpan.className = "history-title";
            titleSpan.textContent = convo.title;
            listItem.appendChild(titleSpan);

            const controlsDiv = document.createElement("div");
            controlsDiv.className = "history-controls";
            controlsDiv.innerHTML = `<button class="edit-btn" title="Renomear"><span class="material-symbols-rounded" style="font-size: 1rem;">edit</span></button><button class="delete-btn" title="Excluir"><span class="material-symbols-rounded" style="font-size: 1rem;">delete</span></button>`;
            listItem.appendChild(controlsDiv);
            historyContainer.appendChild(listItem);
        });
    };
    
    const renderChat = () => {
        chatBody.innerHTML = "";
        if (currentConversationId && conversations[currentConversationId]) {
            conversations[currentConversationId].messages
                .filter(msg => msg.role !== 'system')
                .forEach(msg => {
                    const messageDiv = createMessageElement(msg.role, msg.parts[0].text);
                    chatBody.appendChild(messageDiv);
                });
        }
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const createMessageElement = (role, text) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", role === "user" ? "user-message" : "bot-message");
    
        if (role === "model") {
            const isThinking = text === "thinking...";
            messageDiv.innerHTML = `
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
                <div class="message-text">${isThinking ? '<div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>' : text}</div>
            `;
        } else {
            messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
        }
        return messageDiv;
    };
    
    const getBotResponse = async () => {
        const currentConvo = conversations[currentConversationId];
        currentConvo.messages.push({ role: "model", parts: [{ text: "thinking..." }] });
        renderChat();

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [SYSTEM_INSTRUCTION, ...currentConvo.messages.slice(0, -1)] })
            });

            if (!response.ok) throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            const data = await response.json();
            
            if (!data.candidates?.[0]?.content?.parts) throw new Error("Formato de resposta da API inválido.");
            const botText = data.candidates[0].content.parts[0].text;

            currentConvo.messages.pop();
            currentConvo.messages.push({ role: "model", parts: [{ text: botText }] });

        } catch (error) {
            console.error("Erro ao buscar resposta da IA:", error);
            const errorMessage = "Oops! Algo deu errado. Verifique sua chave de API e a conexão.";
            currentConvo.messages.pop();
            currentConvo.messages.push({ role: "model", parts: [{ text: errorMessage }] });
        } finally {
            saveState();
            renderChat();
        }
    };

    const handleSendMessage = () => {
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        if (!currentConversationId || !conversations[currentConversationId]) {
            startNewChat(userMessage.substring(0, 30));
        }
        
        const currentConvo = conversations[currentConversationId];
        currentConvo.messages.push({ role: "user", parts: [{ text: userMessage }] });
        
        if (currentConvo.messages.filter(m => m.role === 'user').length === 1 && currentConvo.title === "Nova Conversa") {
            currentConvo.title = userMessage.substring(0, 30);
        }

        messageInput.value = "";
        
        saveState();
        renderChat();
        renderHistory();
        
        getBotResponse();
    };

    const startNewChat = (title = "Nova Conversa") => {
        const newId = `convo_${Date.now()}`;
        conversations[newId] = { id: newId, title: title, messages: [] };
        currentConversationId = newId;
        
        const welcomeMessage = "Olá! Eu sou Onio, seu assistente pessoal de Segurança da Informação. Como posso te ajudar a se proteger no mundo digital hoje?";
        conversations[newId].messages.push({ role: "model", parts: [{ text: welcomeMessage }] });

        saveState();
        renderChat();
        renderHistory();
    };

    // --- EVENT LISTENERS ---
    const chatForm = document.querySelector(".chat-form");
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSendMessage();
    });

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    });

    newChatButton.addEventListener("click", () => startNewChat());

    historyContainer.addEventListener("click", (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const id = li.dataset.id;
        
        if (e.target.closest('.edit-btn')) {
            const titleSpan = li.querySelector('.history-title');
            const currentTitle = titleSpan.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentTitle;
            input.className = 'rename-input';
            input.onclick = (e) => e.stopPropagation();
            
            const saveRename = () => {
                const newTitle = input.value.trim();
                if (newTitle) conversations[id].title = newTitle;
                saveState();
                renderHistory();
            };

            input.onblur = saveRename;
            input.onkeydown = (ev) => { if(ev.key === 'Enter') input.blur(); };
            
            titleSpan.replaceWith(input);
            input.focus();
            input.select();

        } else if (e.target.closest('.delete-btn')) {
            if (confirm(`Tem certeza que deseja excluir a conversa "${conversations[id].title}"?`)) {
                delete conversations[id];
                if (currentConversationId === id) {
                    const remainingKeys = Object.keys(conversations).sort((a, b) => b.localeCompare(a));
                    currentConversationId = remainingKeys[0] || null;
                }
                saveState();
                if (currentConversationId) {
                    renderChat();
                } else {
                    startNewChat();
                }
                renderHistory();
            }
        } else {
            if (currentConversationId !== id) {
                currentConversationId = id;
                saveState();
                renderChat();
                renderHistory();
            }
        }
    });

    emojiButton.addEventListener("click", () => emojiPicker.classList.toggle("show"));
    emojiPicker.addEventListener('emoji-click', event => { messageInput.value += event.detail.unicode; });

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    if (Object.keys(conversations).length === 0) {
        startNewChat();
    } else {
        if (!currentConversationId || !conversations[currentConversationId]) {
            currentConversationId = Object.keys(conversations).sort((a,b) => b.localeCompare(a))[0];
            saveState();
        }
        renderChat();
        renderHistory();
    }
});