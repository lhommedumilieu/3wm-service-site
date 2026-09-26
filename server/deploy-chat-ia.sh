#!/usr/bin/env bash
# =====================================================================
#  web-3wm - Script 10 : deploiement du chatbot IA (chat-proxy)
#  Prepare par Claude
#
#  A lancer SUR web-3wm, depuis la racine du depot du site
#  (le dossier ou se trouve deja server/chat-proxy.js apres un
#  "sudo maj-site"), avec :   sudo bash server/deploy-chat-ia.sh
#
#  Ce script :
#   1. Cree un service systemd qui fait tourner server/chat-proxy.js
#   2. Ajoute une route /api/chat dans la config nginx du site
#   3. Recharge nginx
# =====================================================================
set -uo pipefail
JOURNAL="$HOME/journal-script10-$(date +%Y%m%d-%H%M).txt"
exec > >(tee -a "$JOURNAL") 2>&1
VERT='\e[32m'; JAUNE='\e[33m'; ROUGE='\e[31m'; CYAN='\e[36m'; FIN='\e[0m'
etape()  { echo -e "\n${CYAN}==== $* ====${FIN}"; }
ok()     { echo -e "  ${VERT}[OK]${FIN} $*"; }
alerte() { echo -e "  ${JAUNE}[!]${FIN}  $*"; }
erreur() { echo -e "  ${ROUGE}[ERREUR]${FIN} $*"; }

if [[ $EUID -ne 0 ]]; then echo "Lance-moi avec : sudo bash $0"; exit 1; fi

REPO_DIR="$(pwd)"
IP_IA="192.168.1.113"

etape "1. Verifications"
if [[ ! -f "$REPO_DIR/server/chat-proxy.js" ]]; then
  erreur "server/chat-proxy.js introuvable dans $REPO_DIR"
  echo "  Lance ce script depuis la racine du depot du site (fais d'abord : sudo maj-site)"
  exit 1
fi
command -v node >/dev/null || { erreur "Node.js n'est pas installe sur cette machine"; exit 1; }
NODE_BIN="$(command -v node)"
ok "Depot trouve : $REPO_DIR"
ok "Node.js : $(node --version) ($NODE_BIN)"

etape "2. Test de connexion a l'IA (ia-3wm)"
if curl -fsS -m 5 "http://$IP_IA:11434/api/tags" >/dev/null 2>&1; then
  ok "IA joignable sur http://$IP_IA:11434"
else
  alerte "IA injoignable pour l'instant sur http://$IP_IA:11434 (le service demarrera quand meme)"
fi

etape "3. Service systemd chat-ia"
SERVICE_USER="$(logname 2>/dev/null || echo root)"
cat > /etc/systemd/system/chat-ia.service <<EOF
[Unit]
Description=Chat IA 3WM Service (proxy vers Ollama)
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$REPO_DIR
Environment=OLLAMA_HOST=http://$IP_IA:11434
Environment=OLLAMA_MODEL=llama3.1:8b
Environment=PORT=3001
ExecStart=$NODE_BIN $REPO_DIR/server/chat-proxy.js
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now chat-ia >/dev/null 2>&1
systemctl restart chat-ia
sleep 2
if systemctl is-active --quiet chat-ia; then
  ok "Service chat-ia actif (port 3001 en local)"
else
  erreur "Le service chat-ia n'a pas demarre, voir : sudo journalctl -u chat-ia -n 50"
fi

etape "4. Configuration nginx (/api/chat)"
CONF=$(grep -rl "server_name" /etc/nginx/sites-available/ 2>/dev/null | grep -i "3wm\|3-wm" | head -n1)
if [[ -z "$CONF" ]]; then
  alerte "Fichier de config nginx du site introuvable automatiquement."
  echo "  Ajoute toi-meme ce bloc dans le 'server { ... }' de ton site (avant la derniere accolade) :"
  echo ""
  echo "    location /api/chat {"
  echo "        proxy_pass http://127.0.0.1:3001;"
  echo "        proxy_set_header Host \$host;"
  echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
  echo "    }"
  echo ""
  echo "  Puis : sudo nginx -t && sudo systemctl reload nginx"
elif grep -q "location /api/chat" "$CONF"; then
  ok "La route /api/chat existe deja dans $CONF, rien a faire"
else
  ok "Config nginx trouvee : $CONF"
  cp "$CONF" "$CONF.bak-$(date +%Y%m%d-%H%M)"
  TOTAL_LIGNES=$(wc -l < "$CONF")
  head -n $((TOTAL_LIGNES - 1)) "$CONF" > "$CONF.new"
  cat >> "$CONF.new" <<'BLOCK'
    location /api/chat {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
BLOCK
  tail -n 1 "$CONF" >> "$CONF.new"
  mv "$CONF.new" "$CONF"
  if grep -q "location /api/chat" "$CONF" && nginx -t >/dev/null 2>&1; then
    systemctl reload nginx
    ok "Route /api/chat ajoutee et nginx recharge (sauvegarde : $CONF.bak-*)"
  else
    erreur "L'ajout ou la config nginx generee est invalide, restauration de la sauvegarde"
    cp "$CONF.bak-"* "$CONF" 2>/dev/null
    echo "  Verifie manuellement avec : sudo nginx -t"
    echo "  Et ajoute toi-meme ce bloc dans le 'server { ... }' du site :"
    echo "    location /api/chat {"
    echo "        proxy_pass http://127.0.0.1:3001;"
    echo "        proxy_set_header Host \$host;"
    echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
    echo "    }"
  fi
fi

etape "Termine"
echo "  Journal : $JOURNAL"
echo "  Teste avec : curl -X POST http://localhost/api/chat -H 'Content-Type: application/json' -d '{\"messages\":[{\"role\":\"user\",\"content\":\"Bonjour\"}]}'"
echo "  Si tout fonctionne, le chat sur https://3-wm.net devrait repondre."
