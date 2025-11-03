// storage.js

// Salva um valor (objeto ou string) no localStorage
export function saveData(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

// Carrega um valor do localStorage
export function loadData(key) {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (err) {
    console.error('Erro ao carregar do localStorage:', err);
    return null;
  }
}

// Remove um item específico
export function removeData(key) {
  localStorage.removeItem(key);
}

// Limpa tudo do localStorage (usar com cuidado)
export function clearStorage() {
  localStorage.clear();
}
