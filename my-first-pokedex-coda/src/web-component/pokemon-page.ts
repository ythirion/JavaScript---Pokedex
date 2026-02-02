class PokemonPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const id = this.getAttribute('id');
        const name = this.getAttribute('name');
        const img = this.getAttribute('img');
        const crie = this.getAttribute('crie');

        if (this.shadowRoot)
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; grid-column: 1 / -1; }
            .pokemon-page-container {
                display: grid;
                grid-template-columns: 1fr 1.8fr;
                gap: 40px;
                background: #16222d;
                border: 2px solid #00f2ff;
                border-radius: 15px;
                padding: 40px;
                color: white;
                font-family: 'Courier New', monospace;
            }
            .visuals { text-align: center; display: flex; flex-direction: column; justify-content: center; }
            .main-img { width: 100%; max-width: 300px; filter: drop-shadow(0 0 15px rgba(0,242,255,0.2)); }
            
            .details { display: flex; flex-direction: column; justify-content: center; }
            
            h2 { font-size: 2.5rem; text-transform: uppercase; margin-bottom: 0; color: white; }
            .pkm-id { color: #00f2ff; font-size: 1.5rem; margin-bottom: 20px; display: block; }
            
            h3 { 
                color: #00f2ff; 
                text-transform: uppercase; 
                letter-spacing: 2px; 
                border-bottom: 1px solid rgba(0,242,255,0.3);
                padding-bottom: 10px;
                margin-top: 0;
            }

            .audio-section { 
                margin-top: 30px; 
                padding: 15px;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
            }
            .audio-label { 
                display: block; 
                color: #00f2ff; 
                font-size: 0.7rem; 
                letter-spacing: 2px; 
                margin-bottom: 10px; 
                text-transform: uppercase;
            }
            audio { width: 100%; height: 35px; filter: invert(1) hue-rotate(180deg); }
        </style>

        <div class="pokemon-page-container">
            <div class="visuals">
                <img src="${img}" class="main-img"  onerror="this.src='src/img/favicon.png';">
                <h2>${name}</h2>
                <span class="pkm-id">#${id}</span>
            </div>
            <div class="details">
                <h3>Base Statistics</h3>
                <div class="stats-list">
                    <slot></slot> 
                </div>
                <div class="audio-section">
                    <span class="audio-label">Vocal Signature Analysis</span>
                    <audio controls src="${crie}"></audio>
                </div>
            </div>
        </div>`;
    }
}
window.customElements.define('pokemon-page', PokemonPage);
