window.onload = () => {
    const extractButton = document.getElementById('extractButton');
    const copyButton = document.getElementById('copyButton');
    const resultDiv = document.getElementById('result');
  
    async function extractList() {
      try {
        // Vérifie que l'API chrome.scripting est disponible
        if (!chrome.scripting) {
          throw new Error('API Scripting non disponible');
        }
  
        // Récupère l'onglet actif
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        });
  
        if (!tab) {
          throw new Error('Aucun onglet actif trouvé');
        }
  
        // Exécute le script dans la page
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const list = [];
            const elements = document.querySelectorAll('.list-group-item');
            
            elements.forEach(el => {
              const text = el.textContent;
              const match = text.match(/File:\s*(\S+)/);
              list.push(match ? match[1] : null);
            });
            
            return list.filter(item => item !== null).join(' ');
          }
        });
  
        const extractedText = results[0]?.result;
        resultDiv.textContent = extractedText || 'Aucun élément trouvé';
  
      } catch (error) {
        console.error('Erreur:', error);
        resultDiv.textContent = `Erreur: ${error.message}`;
      }
    }
  
    async function copyToClipboard() {
      try {
        const text = resultDiv.textContent;
        await navigator.clipboard.writeText(text);
        
        // Feedback visuel
        resultDiv.style.backgroundColor = '#e8f5e9';
        setTimeout(() => {
          resultDiv.style.backgroundColor = '';
        }, 500);
      } catch (error) {
        console.error('Erreur de copie:', error);
        resultDiv.textContent = `Erreur de copie: ${error.message}`;
      }
    }
  
    extractButton.addEventListener('click', extractList);
    copyButton.addEventListener('click', copyToClipboard);
  };