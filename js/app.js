async function printStreamToConsole(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  console.log(result);
}

const input = document.getElementById('lbsInput');
const output = document.getElementById('output');

output.style.visibility = 'hidden';

input.addEventListener('input', (e) => {
  let lbs = e.target.value;

  output.style.visibility = 'visible';

  let grams = document.getElementById('gOutput');
  grams.innerHTML = lbs/0.0022046;

  let kiloGrams = document.getElementById('kgOutput');
  kiloGrams.innerHTML = lbs/2.2046;

  let ounces = document.getElementById('ozOutput');
  ounces.innerHTML = lbs*16;

  e.preventDefault();
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js').then( () => {
      console.log('Service Worker Registered')
    })
  })
}

document.getElementById('gptForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(this); // Get form data
  const query = formData.get('gptInput'); // Get query from form

  try {
    const response = await fetch('/.netlify/functions/gpttest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query }) // Send query as JSON in request body
    });

    if (response.ok) {
      const data = await response.json();

      let gptResponse = document.getElementById('gptResponse');
      gptResponse.innerHTML = data.message.content;
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});