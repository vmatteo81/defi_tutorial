import json
import os
import requests
from xml.etree import ElementTree as ET
from web3 import Web3
from web3.middleware import geth_poa_middleware
from web3.exceptions import TransactionNotFound

# Percorso del file di configurazione
config_file_path = "exchangeRates.cfg"

if os.path.exists(config_file_path):
    try:
        # Leggi le righe dal file
        with open(config_file_path, 'r') as file:
            lines = file.readlines()
        
        # Inizializza le variabili
        ethereum_node_url = None
        contract_address = None
        private_key = None
        my_abi = None
        for line in lines:
            key, value = line.strip().split('=')
            key = key.strip()
            value = value.strip()

            # Assegna i valori alle variabili in base alla chiave
            if key == "ETH_NODE_URL":
                ethereum_node_url = value
            elif key == "CONTRACT_ADDRESS":
                contract_address = value
            elif key == "PRIVATE_KEY":
                private_key = value
            elif key == "ABI":
                abi_file_path = value
        # Verifica che tutti i parametri siano stati impostati correttamente
        if ethereum_node_url and contract_address and private_key:
            # Inizializza Web3 con l'URL del nodo Ethereum
            web3 = Web3(Web3.HTTPProvider(ethereum_node_url))
            web3.middleware_onion.inject(geth_poa_middleware, layer=0)

            # Chiave privata del mittente
            sender_private_key = private_key

            # Indirizzo del contratto intelligente
            contract_address = contract_address
            with open(abi_file_path, 'r') as abi_file:
                my_abi = json.load(abi_file)
            # Creazione del contratto
            contract = web3.eth.contract(address=contract_address, abi=my_abi['abi'])
            # Scarica il tasso di cambio EUR/USD dal sito web
            url = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml"
            response = requests.get(url)
            if response.status_code == 200:
                xml_data = response.text

                # Analizza il contenuto XML per ottenere il tasso di cambio EUR/USD
                root = ET.fromstring(xml_data)
                eur_to_usd_rate = None

                for cube in root.iter('{http://www.ecb.int/vocabulary/2002-08-01/eurofxref}Cube'):
                    if cube.attrib.get('currency') == 'USD':
                        eur_to_usd_rate = float(cube.attrib.get('rate'))

                if eur_to_usd_rate is not None:
                    # Effettua la conversione in Wei
                    eur_to_usd_rate_wei = web3.to_wei(eur_to_usd_rate, 'ether')

                    # Account mittente
                    sender_account = web3.eth.account.from_key(sender_private_key)

                    # Valore da inviare con la transazione (può essere 0)
                    
                    value = web3.to_wei(0, 'ether')

                    # Chiamata alla funzione del contratto per aggiornare il tasso di cambio
                    nonce = web3.eth.get_transaction_count(sender_account.address)
                    owner_address = contract.functions.owner().call()
                    print(owner_address)
                    transaction = contract.functions.updateExchangeRate(eur_to_usd_rate_wei).build_transaction({
                        'chainId': 1337,  # Mainnet
                        'gas': 2000000,
                        'gasPrice': web3.to_wei('10', 'gwei'),
                        'nonce': nonce,
                    })

                    # Firma la transazione

                    print(transaction)
                    signed_transaction = web3.eth.account.sign_transaction(transaction, sender_private_key)
                    print(signed_transaction)
                    # Invia la transazione
                    transaction_hash = web3.eth.send_raw_transaction(signed_transaction.rawTransaction)

                    print(f"Transazione inviata con successo. Hash della transazione: {web3.to_hex(transaction_hash)}")
                    exchange_rate = contract.functions.getExchangeRate().call()
                    print(exchange_rate)
                else:
                    print("Impossibile trovare il tasso di cambio EUR/USD nel file XML.")
            else:
                print("Errore nel download del file XML.")
        else:
            print("Errore: Uno o più parametri mancanti nel file di configurazione.")
    except Exception as ex:
        print(f"Errore durante la lettura del file di configurazione o l'invio della transazione: {str(ex)}")
else:
    print("Il file di configurazione 'exchangeRates.cfg' non esiste nella directory corrente.")
