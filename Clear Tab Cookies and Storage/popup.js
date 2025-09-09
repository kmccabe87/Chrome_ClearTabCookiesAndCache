document.getElementById('clearButton').addEventListener('click', () => {
  const status = document.getElementById('status');
  status.textContent = 'Processing...';
  status.classList.add('visible');

  const clearCookies = document.getElementById('clearCookies').checked;
  const clearLocal = document.getElementById('clearLocalStorage').checked;
  const clearSession = document.getElementById('clearSessionStorage').checked;
  const refreshTab = document.getElementById('refreshTab').checked;

  const hasClearing = clearCookies || clearLocal || clearSession;

  if (!hasClearing && !refreshTab) {
    status.textContent = 'Nothing selected.';
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) {
      status.textContent = 'Error: No active tab found.';
      return;
    }

    const url = new URL(tab.url);
    const domain = url.hostname;

    let operationsCompleted = 0;
    const totalOperations = (clearCookies ? 1 : 0) + ((clearLocal || clearSession) ? 1 : 0);

    const checkCompletion = () => {
      operationsCompleted++;
      if (operationsCompleted >= totalOperations) {
        if (refreshTab) {
          chrome.tabs.reload(tab.id, () => {
            if (chrome.runtime.lastError) {
              status.textContent = 'Error refreshing tab: ' + chrome.runtime.lastError.message;
            } else {
              status.textContent = hasClearing ? 'Data cleared and tab refreshed!' : 'Tab refreshed!';
            }
          });
        } else {
          status.textContent = hasClearing ? 'Data cleared successfully!' : 'No data cleared.';
        }
      }
    };

    if (clearCookies) {
      // Clear cookies for the domain
      chrome.cookies.getAll({ domain }, (cookies) => {
        if (cookies.length === 0) {
          checkCompletion();
          return;
        }
        let removedCount = 0;
        cookies.forEach((cookie) => {
          const cookieUrl = (cookie.secure ? 'https://' : 'http://') + domain + cookie.path;
          chrome.cookies.remove({ url: cookieUrl, name: cookie.name }, (details) => {
            removedCount++;
            if (removedCount === cookies.length) {
              checkCompletion();
            }
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          });
        });
      });
    } else if (totalOperations === 0) {
      checkCompletion(); // If no clearing but refresh is needed
    }

    if (clearLocal || clearSession) {
      // Inject content script to clear storage
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: clearStorage,
        args: [clearLocal, clearSession]
      }, () => {
        if (chrome.runtime.lastError) {
          status.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else {
          checkCompletion();
        }
      });
    }

    if (totalOperations === 0) {
      checkCompletion(); // For cases where only refresh is selected
    }
  });
});

// Function to be injected into the tab
function clearStorage(clearLocal, clearSession) {
  if (clearLocal) localStorage.clear();
  if (clearSession) sessionStorage.clear();
  console.log('Storage cleared:', { local: clearLocal, session: clearSession });
}