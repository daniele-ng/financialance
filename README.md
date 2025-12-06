Financialance è un progetto sviluppato da un neo partita IVA forfettario per tenere sotto controllo le entrate e le tasse dovute al fisco italiano.
Il progetto è costituito da un server API sviluppato con NestJS e da un client basato su VueJS.

# Cosa si può fare?
Dopo la creazione di un account fittizio si può:
- impostare i dati fiscali dell'anno solare;
- registrare le fatture emesse;
- tenere sotto controllo le entrate e le spese fiscali.

# Requisiti minimi
- Node: ^20.19.0 || >=22.12.0

# Installazione
Per installare il server-api andare nella cartella "server-api" ed installare i pacchetti presenti nel file package.json:
```bash
financialance\server-api> npm install
```

Seguire la stessa procedura per installare i pacchetti node del client:
```bash
financialance\client> npm install
```

# Avvio
Per avviare il server-api eseguire il comando:
```bash
nest start
```

Per avviare il client eseguire il comando:
```bash
npm run dev
```

# Docker
Il repo contiene un'immagine di docker pronta all'uso: 
```bash
# installa immagine
docker-compose build
# avvia container
docker-compose up -d
```